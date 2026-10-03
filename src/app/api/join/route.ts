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

  if (!name || !email || !city || !category || !bio) {
    return NextResponse.json(
      { error: "შეავსე ყველა სავალდებულო ველი." },
      { status: 400 },
    );
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json(
      { error: "ემაილის მისამართი არასწორია." },
      { status: 400 },
    );
  }

  const files = data
    .getAll("works")
    .filter((f): f is File => f instanceof File && f.size > 0);

  if (files.length > MAX_FILES) {
    return NextResponse.json(
      { error: `მაქსიმუმ ${MAX_FILES} ფოტოს ატვირთვაა შესაძლებელი.` },
      { status: 400 },
    );
  }
  if (files.some((f) => !ALLOWED_TYPES.includes(f.type))) {
    return NextResponse.json(
      { error: "დაშვებულია მხოლოდ JPG, PNG ან WEBP ფორმატი." },
      { status: 400 },
    );
  }
  if (files.reduce((sum, f) => sum + f.size, 0) > MAX_TOTAL_BYTES) {
    return NextResponse.json(
      { error: "ფოტოების ჯამური ზომა 4MB-ს არ უნდა აღემატებოდეს." },
      { status: 400 },
    );
  }

  const apiKey = process.env.RESEND_API_KEY;
  const to = process.env.JOIN_TO_EMAIL;
  if (!apiKey || !to) {
    console.error("RESEND_API_KEY ან JOIN_TO_EMAIL არ არის მითითებული");
    return NextResponse.json(
      { error: "გაგზავნა დროებით შეუძლებელია. სცადე მოგვიანებით." },
      { status: 500 },
    );
  }

  const attachments = await Promise.all(
    files.map(async (f) => ({
      filename: f.name,
      content: Buffer.from(await f.arrayBuffer()).toString("base64"),
    })),
  );

  const html = `
    <h2>ახალი განაცხადი: ${escapeHtml(name)}</h2>
    <p><b>ემაილი:</b> ${escapeHtml(email)}</p>
    <p><b>ქალაქი:</b> ${escapeHtml(city)}</p>
    <p><b>მიმართულება:</b> ${escapeHtml(category)}</p>
    <p><b>ინსტაგრამი:</b> ${escapeHtml(instagram) || "—"}</p>
    <p><b>ბიოგრაფია:</b><br>${escapeHtml(bio).replace(/\n/g, "<br>")}</p>
  `;

  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: process.env.JOIN_FROM_EMAIL || "ხელოვანი <onboarding@resend.dev>",
      to: [to],
      reply_to: email,
      subject: `ახალი განაცხადი: ${name}`,
      html,
      attachments,
    }),
  });

  if (!res.ok) {
    console.error("Resend შეცდომა", res.status, await res.text());
    return NextResponse.json(
      { error: "გაგზავნა ვერ მოხერხდა. სცადე მოგვიანებით." },
      { status: 502 },
    );
  }

  return NextResponse.json({ ok: true });
}
