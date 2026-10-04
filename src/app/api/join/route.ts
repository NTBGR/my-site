import { NextResponse } from "next/server";
import { categoryNameKa, cities } from "@/data/join-options";
import { allowed, clientIp } from "@/lib/ratelimit";

export const runtime = "nodejs";

const MAX_FILES = 10;
const MAX_TOTAL_BYTES = 4 * 1024 * 1024; // Vercel-ის მოთხოვნის ლიმიტი ~4.5MB
const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp"];

// ფაილის ტიპს სათაურზე არ ვენდობით (გამგზავნს შეუძლია ცრუ ტიპი მიუთითოს): პირველი ბაიტებით ვამოწმებთ, ნამდვილად სურათია თუ არა
async function looksLikeImage(file: File) {
  const b = new Uint8Array(await file.slice(0, 12).arrayBuffer());
  const jpeg = b[0] === 0xff && b[1] === 0xd8 && b[2] === 0xff;
  const png = b[0] === 0x89 && b[1] === 0x50 && b[2] === 0x4e && b[3] === 0x47;
  const webp = b[0] === 0x52 && b[1] === 0x49 && b[2] === 0x46 && b[3] === 0x46 && b[8] === 0x57 && b[9] === 0x45 && b[10] === 0x42 && b[11] === 0x50;
  return jpeg || png || webp;
}

// ველის მაქსიმალური სიგრძე სერვერზეც (ბრაუზერის maxLength მხოლოდ ადამიანისთვის მუშაობს, ბოტი მას გვერდს უვლის)
function field(data: FormData, name: string, max = 200) {
  const value = data.get(name);
  return typeof value === "string" ? value.trim().slice(0, max) : "";
}

function escapeHtml(text: string) {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

export async function POST(request: Request) {
  // ბოტებისგან დაცვა: ერთი IP-დან საათში 5 განაცხადი, ყველასგან ერთად საათში 60 (გამოგზავნის სპამი Telegram-ს არ უნდა აავსოს)
  const ip = clientIp(request.headers);
  if (!(await allowed(`join:ip:${ip}`, 5, 3600)) || !(await allowed("join:all", 60, 3600))) {
    return NextResponse.json({ error: "rateLimited" }, { status: 429 });
  }

  const data = await request.formData();

  // ანტისპამ ხაფანგი: ადამიანი ამ ველს ვერ ხედავს
  if (field(data, "website")) {
    return NextResponse.json({ ok: true });
  }

  const name = field(data, "name", 100);
  const email = field(data, "email", 150);
  const cityValue = field(data, "city");
  const city = cities.some((c) => c.value === cityValue) ? cityValue : "";
  const categoryName = categoryNameKa(field(data, "category"));
  const bio = field(data, "bio", 2000);
  const instagram = field(data, "instagram");
  const facebook = field(data, "facebook");
  const comment = field(data, "comment", 1000);

  if (!name || !email || !city || !categoryName || !bio || !instagram) {
    return NextResponse.json(
      { error: "required" },
      { status: 400 },
    );
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json(
      { error: "email" },
      { status: 400 },
    );
  }

  const files = data
    .getAll("works")
    .filter((f): f is File => f instanceof File && f.size > 0);

  if (files.length === 0) {
    return NextResponse.json(
      { error: "photos" },
      { status: 400 },
    );
  }
  if (files.length > MAX_FILES) {
    return NextResponse.json(
      { error: "tooMany" },
      { status: 400 },
    );
  }
  const realImages = await Promise.all(files.map(looksLikeImage));
  if (files.some((f) => !ALLOWED_TYPES.includes(f.type)) || realImages.some((ok) => !ok)) {
    return NextResponse.json(
      { error: "type" },
      { status: 400 },
    );
  }
  if (files.reduce((sum, f) => sum + f.size, 0) > MAX_TOTAL_BYTES) {
    return NextResponse.json(
      { error: "size" },
      { status: 400 },
    );
  }

  const application = { name, email, city, category: categoryName, instagram, facebook, bio, comment };

  const telegramOn = Boolean(
    process.env.TELEGRAM_BOT_TOKEN && process.env.TELEGRAM_CHAT_ID,
  );
  const emailOn = Boolean(process.env.RESEND_API_KEY && process.env.JOIN_TO_EMAIL);

  if (!telegramOn && !emailOn) {
    console.error(
      "მიწოდება არ არის მორგებული: მიუთითე TELEGRAM_BOT_TOKEN + TELEGRAM_CHAT_ID ან RESEND_API_KEY + JOIN_TO_EMAIL",
    );
    return NextResponse.json({ error: "unavailable" }, { status: 500 });
  }

  const results = await Promise.all([
    telegramOn ? sendToTelegram(application, files) : Promise.resolve(false),
    emailOn ? sendToEmail(application, files) : Promise.resolve(false),
  ]);

  if (!results.some(Boolean)) {
    return NextResponse.json({ error: "failed" }, { status: 502 });
  }

  return NextResponse.json({ ok: true });
}

type Application = {
  name: string;
  email: string;
  city: string;
  category: string;
  instagram: string;
  facebook: string;
  bio: string;
  comment: string;
};

async function sendToTelegram(app: Application, files: File[]) {
  const token = process.env.TELEGRAM_BOT_TOKEN as string;
  const chatId = process.env.TELEGRAM_CHAT_ID as string;
  const api = (method: string) => `https://api.telegram.org/bot${token}/${method}`;

  const text = [
    "<b>ახალი განაცხადი</b>",
    "",
    `<b>სახელი:</b> ${escapeHtml(app.name)}`,
    `<b>ემაილი:</b> ${escapeHtml(app.email)}`,
    `<b>ქალაქი:</b> ${escapeHtml(app.city)}`,
    `<b>მიმართულება:</b> ${escapeHtml(app.category)}`,
    `<b>ინსტაგრამი:</b> ${escapeHtml(app.instagram) || "—"}`,
    `<b>ფეისბუქი:</b> ${escapeHtml(app.facebook) || "—"}`,
    "",
    "<b>ბიოგრაფია:</b>",
    escapeHtml(app.bio),
    ...(app.comment ? ["", "<b>კომენტარი:</b>", escapeHtml(app.comment)] : []),
  ].join("\n");

  try {
    const res = await fetch(api("sendMessage"), {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id: chatId,
        text,
        parse_mode: "HTML",
        disable_web_page_preview: true,
      }),
    });
    if (!res.ok) {
      console.error("Telegram შეცდომა", res.status, await res.text());
      return false;
    }

    // ფოტოები ცალკე ეგზავნება; თუ ვერ გაიგზავნა, ტექსტი მაინც მიღებულია
    if (files.length > 0) {
      const form = new FormData();
      form.append("chat_id", chatId);
      if (files.length === 1) {
        form.append("photo", files[0], files[0].name);
        const photoRes = await fetch(api("sendPhoto"), { method: "POST", body: form });
        if (!photoRes.ok) {
          console.error("Telegram ფოტოს შეცდომა", photoRes.status, await photoRes.text());
        }
      } else {
        const media = files.map((file, i) => ({
          type: "photo",
          media: `attach://photo${i}`,
        }));
        form.append("media", JSON.stringify(media));
        files.forEach((file, i) => form.append(`photo${i}`, file, file.name));
        const groupRes = await fetch(api("sendMediaGroup"), { method: "POST", body: form });
        if (!groupRes.ok) {
          console.error("Telegram ფოტოების შეცდომა", groupRes.status, await groupRes.text());
        }
      }
    }
    return true;
  } catch (error) {
    console.error("Telegram ქსელის შეცდომა", error);
    return false;
  }
}

async function sendToEmail(app: Application, files: File[]) {
  const attachments = await Promise.all(
    files.map(async (f) => ({
      filename: f.name,
      content: Buffer.from(await f.arrayBuffer()).toString("base64"),
    })),
  );

  const html = `
    <h2>ახალი განაცხადი: ${escapeHtml(app.name)}</h2>
    <p><b>ემაილი:</b> ${escapeHtml(app.email)}</p>
    <p><b>ქალაქი:</b> ${escapeHtml(app.city)}</p>
    <p><b>მიმართულება:</b> ${escapeHtml(app.category)}</p>
    <p><b>ინსტაგრამი:</b> ${escapeHtml(app.instagram) || "—"}</p>
    <p><b>ფეისბუქი:</b> ${escapeHtml(app.facebook) || "—"}</p>
    <p><b>ბიოგრაფია:</b><br>${escapeHtml(app.bio).replace(/\n/g, "<br>")}</p>
    ${app.comment ? `<p><b>კომენტარი:</b><br>${escapeHtml(app.comment).replace(/\n/g, "<br>")}</p>` : ""}
  `;

  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: process.env.JOIN_FROM_EMAIL || "ხელოვანი <onboarding@resend.dev>",
        to: [process.env.JOIN_TO_EMAIL],
        reply_to: app.email,
        subject: `ახალი განაცხადი: ${app.name}`,
        html,
        attachments,
      }),
    });
    if (!res.ok) {
      console.error("Resend შეცდომა", res.status, await res.text());
      return false;
    }
    return true;
  } catch (error) {
    console.error("Resend ქსელის შეცდომა", error);
    return false;
  }
}
