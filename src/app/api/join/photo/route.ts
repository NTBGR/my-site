import { NextResponse } from "next/server";
import { MAX_JOIN_WORKS as MAX_WORKS } from "@/data/join-options";
import { allowed, clientIp } from "@/lib/ratelimit";
import { escapeHtml, telegramApi, telegramOn, verifyTicket } from "@/lib/telegram";

export const runtime = "nodejs";

// განაცხადის ფორმის ფოტო: ერთი მოთხოვნა = ერთი ნამუშევარი (ფოტო + დასახელება + ფასი).
// Vercel-ის მოთხოვნის ზომა ~4,5 MB-ია, ამიტომ ბრაუზერი ფოტოებს ცალ-ცალკე და გაპატარავებულს გზავნის.
const MAX_BYTES = 2.5 * 1024 * 1024;

function field(data: FormData, name: string, max = 200) {
  const value = data.get(name);
  return typeof value === "string" ? value.trim().slice(0, max) : "";
}

// ფაილის ტიპს მისი პირველი ბაიტებით ვამოწმებთ და არა სახელით (JPEG, PNG ან WEBP)
function imageType(bytes: Uint8Array): "image/jpeg" | "image/png" | "image/webp" | null {
  if (bytes[0] === 0xff && bytes[1] === 0xd8 && bytes[2] === 0xff) return "image/jpeg";
  if (bytes[0] === 0x89 && bytes[1] === 0x50 && bytes[2] === 0x4e && bytes[3] === 0x47) return "image/png";
  const ascii = (from: number, to: number) => String.fromCharCode(...bytes.slice(from, to));
  if (ascii(0, 4) === "RIFF" && ascii(8, 12) === "WEBP") return "image/webp";
  return null;
}

export async function POST(request: Request) {
  if (!telegramOn()) return NextResponse.json({ error: "unavailable" }, { status: 500 });

  const ip = clientIp(request.headers);
  if (!(await allowed(`joinphoto:ip:${ip}`, 120, 3600))) {
    return NextResponse.json({ error: "rateLimited" }, { status: 429 });
  }

  let data: FormData;
  try {
    data = await request.formData();
  } catch {
    return NextResponse.json({ error: "required" }, { status: 400 });
  }

  const ref = verifyTicket(field(data, "ticket", 100));
  if (ref === null) return NextResponse.json({ error: "ticket" }, { status: 403 });

  const index = Number(field(data, "index", 3));
  const total = Number(field(data, "total", 3));
  const title = field(data, "title", 100);
  // ფასი: მხოლოდ ციფრები (ცარიელი = „ფასი შეთანხმებით“)
  const price = field(data, "price", 8).replace(/\D/g, "").slice(0, 6);
  const file = data.get("photo");
  if (
    !Number.isInteger(index) || index < 1 || index > MAX_WORKS ||
    !Number.isInteger(total) || total < index || total > MAX_WORKS ||
    !title || !(file instanceof File)
  ) {
    return NextResponse.json({ error: "required" }, { status: 400 });
  }
  if (file.size > MAX_BYTES) return NextResponse.json({ error: "tooBig" }, { status: 413 });

  const bytes = new Uint8Array(await file.arrayBuffer());
  const type = imageType(bytes);
  if (!type) return NextResponse.json({ error: "type" }, { status: 415 });

  // ერთ განაცხადზე მაქსიმუმ 15 ფოტო (გამეორებული გაგზავნის ცდებიც ითვლება, ამიტომ მცირე რეზერვით)
  if (!(await allowed(`joinphoto:ref:${ref}`, MAX_WORKS * 2, 24 * 3600))) {
    return NextResponse.json({ error: "rateLimited" }, { status: 429 });
  }

  const caption = `<b>${index}/${total}</b> · ${escapeHtml(title)} · ${price ? `${price} ₾` : "ფასი შეთანხმებით"}`;
  const form = new FormData();
  form.set("chat_id", process.env.TELEGRAM_CHAT_ID as string);
  form.set("caption", caption);
  form.set("parse_mode", "HTML");
  form.set("reply_parameters", JSON.stringify({ message_id: ref, allow_sending_without_reply: true }));
  form.set("photo", new Blob([bytes], { type }), `${index}.${type === "image/png" ? "png" : type === "image/webp" ? "webp" : "jpg"}`);

  try {
    const res = await fetch(telegramApi("sendPhoto"), { method: "POST", body: form });
    if (!res.ok) {
      console.error("Telegram ფოტოს შეცდომა", res.status, await res.text());
      return NextResponse.json({ error: "failed" }, { status: 502 });
    }
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Telegram ფოტოს ქსელის შეცდომა", error);
    return NextResponse.json({ error: "failed" }, { status: 502 });
  }
}
