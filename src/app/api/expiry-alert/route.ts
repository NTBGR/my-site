import { NextResponse, type NextRequest } from "next/server";
import { artists } from "@/data/artists";
import { daysLeftText, memberships, onDay } from "@/lib/membership";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// ამ დღეებში მოდის გაფრთხილება: 7, 3 და 1 დღით ადრე, ვადის დღეს და მეორე დღეს (თუ ჯერ არ გაგრძელებულა)
const ALERT_DAYS = new Set([7, 3, 1, 0, -1]);

const escapeHtml = (s: string) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

/**
 * ყოველდღიური შემოწმება (Vercel cron): ვის ეწურება უფასო პერიოდი ან გადახდილი გამოწერა.
 * შეტყობინება ტელეგრამში მიდის მხოლოდ მაშინ, როცა ვინმეს ვადა ახლოვდება; სხვა დღეებში არაფერი იგზავნება.
 * ხელით შემოწმება (გაგზავნის გარეშე): GET /api/expiry-alert?dry=1, Authorization: Bearer <CRON_SECRET>
 */
export async function GET(req: NextRequest) {
  const secret = process.env.CRON_SECRET;
  if (!secret || req.headers.get("authorization") !== `Bearer ${secret}`) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const due = memberships(artists).filter(({ m }) => ALERT_DAYS.has(m.daysLeft));
  const lines = due.map(
    ({ artist, m }) =>
      `• <b>${escapeHtml(artist.name)}</b>: ${m.paid ? "გამოწერა" : `უფასო პერიოდი (${m.freeMonths} თვე)`} იწურება ${onDay(m.end)}, ${daysLeftText(m.daysLeft)}`,
  );
  const dry = req.nextUrl.searchParams.get("dry") === "1";

  if (lines.length > 0 && !dry) {
    if (!process.env.TELEGRAM_BOT_TOKEN || !process.env.TELEGRAM_CHAT_ID) {
      return NextResponse.json({ error: "telegram not configured" }, { status: 503 });
    }
    const text = ["<b>⏳ ხელოვანების ვადები</b>", "", ...lines, "", "გაგრძელების შემდეგ src/data/artists.ts-ში ჩაწერე paidUntil."].join("\n");
    const res = await fetch(`https://api.telegram.org/bot${process.env.TELEGRAM_BOT_TOKEN}/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ chat_id: process.env.TELEGRAM_CHAT_ID, text, parse_mode: "HTML" }),
    });
    if (!res.ok) return NextResponse.json({ error: `telegram ${res.status}` }, { status: 502 });
  }

  return NextResponse.json({ ok: true, sent: lines.length > 0 && !dry, due: due.map(({ artist, m }) => ({ slug: artist.slug, end: m.end, daysLeft: m.daysLeft })) });
}
