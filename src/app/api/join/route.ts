import { NextResponse } from "next/server";

export const runtime = "nodejs";

const MAX_FILES = 4;
const MAX_TOTAL_BYTES = 4 * 1024 * 1024; // Vercel-ის მოთხოვნის ლიმიტი ~4.5MB
const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp"];

function field(data: FormData, name: string) {
  const value = data.get(name);
  return typeof value === "string" ? value.trim() : "";
}

function escapeHtml(text: string) {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

export async function POST(request: Request) {
  const data = await request.formData();

  // ანტისპამ ხაფანგი: ადამიანი ამ ველს ვერ ხედავს
  if (field(data, "website")) {
    return NextResponse.json({ ok: true });
  }

  const name = field(data, "name");
  const email = field(data, "email");
  const city = field(data, "city");
  const category = field(data, "category");
  const bio = field(data, "bio");
  const instagram = field(data, "instagram");
  const facebook = field(data, "facebook");

  if (!name || !email || !city || !category || !bio || !instagram || !facebook) {
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
  if (files.some((f) => !ALLOWED_TYPES.includes(f.type))) {
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

  const application = { name, email, city, category, instagram, facebook, bio };

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
