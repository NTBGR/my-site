import { NextResponse } from "next/server";
import { TERMS_SUMMARY, TERMS_VERSION } from "@/app/terms/content";
import { PRIVACY_VERSION } from "@/app/privacy/content";
import { categoryNameKa, cities, OTHER_CATEGORY, OTHER_CITY } from "@/data/join-options";
import { allowed, clientIp } from "@/lib/ratelimit";

export const runtime = "nodejs";

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
  // ბოტებისგან დაცვა: ერთი IP-დან საათში 5 განაცხადი, ყველასგან ერთად საათში 60 (გამოგზავნის სპამი Telegram-ს არ უნდა აავსოს).
  // ეს ლიმიტი მხოლოდ სწორად შევსებულ განაცხადებზე ითვლება (ქვემოთ, გაგზავნამდე): ველის შევსება რომ დაავიწყდეს, ადამიანს ცდები არ დაეწვას.
  // აქ მხოლოდ ფართო დამცავი ლიმიტია უბრალოდ დაუსრულებელი ცდებისგან
  const ip = clientIp(request.headers);
  if (!(await allowed(`join:try:${ip}`, 60, 3600))) {
    return NextResponse.json({ error: "rateLimited" }, { status: 429 });
  }

  // არასწორი ფორმატის მოთხოვნა (მაგ. JSON) 500-ს კი არა, 400-ს აბრუნებს
  let data: FormData;
  try {
    data = await request.formData();
  } catch {
    return NextResponse.json({ error: "required" }, { status: 400 });
  }

  // ანტისპამ ხაფანგი: ადამიანი ამ ველს ვერ ხედავს
  if (field(data, "website")) {
    return NextResponse.json({ ok: true });
  }

  const name = field(data, "name", 100);
  const email = field(data, "email", 150);
  const brand = field(data, "brand", 100);
  // ქალაქი და მიმართულება: სიიდან ან „სხვა“ + ხელით ჩაწერილი (სიგრძით შეზღუდული) ტექსტი
  const cityValue = field(data, "city");
  const city =
    cityValue === OTHER_CITY
      ? field(data, "cityOther", 80)
      : cities.some((c) => c.value === cityValue)
        ? cityValue
        : "";
  const categoryValue = field(data, "category");
  const categoryBase = categoryNameKa(categoryValue);
  const categoryName =
    categoryValue === OTHER_CATEGORY
      ? field(data, "categoryOther", 80)
        ? `სხვა: ${field(data, "categoryOther", 80)}`
        : ""
      : categoryBase;
  const bio = field(data, "bio", 2000);
  const instagram = field(data, "instagram");
  const facebook = field(data, "facebook");
  const comment = field(data, "comment", 1000);
  // თანხმობის გამშვები უჯრა სავალდებულოა (კლიენტი ამას ისედაც ამოწმებს; აქ — პირდაპირი მოთხოვნებისთვის)
  const agreed = Boolean(field(data, "agree"));

  if (!name || !brand || !email || !city || !categoryName || !bio || !instagram || !agreed) {
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

  if (!(await allowed(`join:ip:${ip}`, 5, 3600)) || !(await allowed("join:all", 60, 3600))) {
    return NextResponse.json({ error: "rateLimited" }, { status: 429 });
  }

  // თანხმობის ჩანაწერი: როდის და რომელ ვერსიას დათანხმდა (თბილისის დრო), რომ მოთხოვნისას დასტური გვქონდეს
  const consent = `პირობები ${TERMS_VERSION} (${TERMS_SUMMARY}), კონფიდენციალურობა ${PRIVACY_VERSION} · ${new Date().toLocaleString("en-GB", { timeZone: "Asia/Tbilisi" })} (თბილისის დრო)`;
  const application = { name, brand, email, city, category: categoryName, instagram, facebook, bio, comment, consent };

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
    telegramOn ? sendToTelegram(application) : Promise.resolve(false),
    emailOn ? sendToEmail(application) : Promise.resolve(false),
  ]);

  if (!results.some(Boolean)) {
    return NextResponse.json({ error: "failed" }, { status: 502 });
  }

  return NextResponse.json({ ok: true });
}

type Application = {
  name: string;
  brand: string;
  email: string;
  city: string;
  category: string;
  instagram: string;
  facebook: string;
  bio: string;
  comment: string;
  consent: string;
};

async function sendToTelegram(app: Application) {
  const token = process.env.TELEGRAM_BOT_TOKEN as string;
  const chatId = process.env.TELEGRAM_CHAT_ID as string;
  const api = (method: string) => `https://api.telegram.org/bot${token}/${method}`;

  const text = [
    "<b>ახალი განაცხადი</b>",
    "",
    `<b>სახელი და გვარი:</b> ${escapeHtml(app.name)}`,
    `<b>ბრენდი / მაღაზია:</b> ${escapeHtml(app.brand)}`,
    `<b>იმეილი:</b> ${escapeHtml(app.email)}`,
    `<b>ქალაქი:</b> ${escapeHtml(app.city)}`,
    `<b>მიმართულება:</b> ${escapeHtml(app.category)}`,
    `<b>ინსტაგრამი:</b> ${escapeHtml(app.instagram) || "—"}`,
    `<b>ფეისბუქი:</b> ${escapeHtml(app.facebook) || "—"}`,
    "",
    "<b>ბიოგრაფია:</b>",
    escapeHtml(app.bio),
    ...(app.comment ? ["", "<b>კომენტარი:</b>", escapeHtml(app.comment)] : []),
    "",
    `<b>თანხმობა:</b> ${escapeHtml(app.consent)}`,
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

    return true;
  } catch (error) {
    console.error("Telegram ქსელის შეცდომა", error);
    return false;
  }
}

async function sendToEmail(app: Application) {
  const html = `
    <h2>ახალი განაცხადი: ${escapeHtml(app.brand)} (${escapeHtml(app.name)})</h2>
    <p><b>იმეილი:</b> ${escapeHtml(app.email)}</p>
    <p><b>ქალაქი:</b> ${escapeHtml(app.city)}</p>
    <p><b>მიმართულება:</b> ${escapeHtml(app.category)}</p>
    <p><b>ინსტაგრამი:</b> ${escapeHtml(app.instagram) || "—"}</p>
    <p><b>ფეისბუქი:</b> ${escapeHtml(app.facebook) || "—"}</p>
    <p><b>ბიოგრაფია:</b><br>${escapeHtml(app.bio).replace(/\n/g, "<br>")}</p>
    ${app.comment ? `<p><b>კომენტარი:</b><br>${escapeHtml(app.comment).replace(/\n/g, "<br>")}</p>` : ""}
    <p><b>თანხმობა:</b> ${escapeHtml(app.consent)}</p>
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
        subject: `ახალი განაცხადი: ${app.brand}`,
        html,
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
