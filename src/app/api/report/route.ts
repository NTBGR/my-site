import { NextResponse, type NextRequest } from "next/server";
import { artists } from "@/data/artists";
import { clicksEnabled, monthOf, monthStats } from "@/lib/clicks";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 60;

const MONTHS = [
  "იანვარ", "თებერვალ", "მარტ", "აპრილ", "მაის", "ივნის",
  "ივლის", "აგვისტო", "სექტემბერ", "ოქტომბერ", "ნოემბერ", "დეკემბერ",
];
// „ოქტომბერში“, „აგვისტოში“
const inMonth = (month: string) => `${MONTHS[Number(month.slice(5, 7)) - 1]}ში`;

function previousMonth() {
  const [y, m] = monthOf().split("-").map(Number);
  const date = new Date(Date.UTC(y, m - 2, 15));
  return date.toISOString().slice(0, 7);
}

const escapeHtml = (s: string) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

async function telegram(text: string) {
  const res = await fetch(`https://api.telegram.org/bot${process.env.TELEGRAM_BOT_TOKEN}/sendMessage`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ chat_id: process.env.TELEGRAM_CHAT_ID, text, parse_mode: "HTML" }),
  });
  if (!res.ok) throw new Error(`telegram ${res.status}`);
}

/**
 * ყოველთვიური რეპორტი ტელეგრამში (Vercel cron, ყოველი თვის 1-ში).
 * ჯერ შეჯამება, შემდეგ თითო ხელოვანზე მზა ტექსტი, რომელსაც კოპირებ და უგზავნი.
 * ხელით გაშვება: GET /api/report?month=2026-10, Authorization: Bearer <CRON_SECRET>
 */
export async function GET(req: NextRequest) {
  const secret = process.env.CRON_SECRET;
  if (!secret || req.headers.get("authorization") !== `Bearer ${secret}`) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }
  if (!clicksEnabled) return NextResponse.json({ error: "clicks storage not configured" }, { status: 503 });
  if (!process.env.TELEGRAM_BOT_TOKEN || !process.env.TELEGRAM_CHAT_ID) {
    return NextResponse.json({ error: "telegram not configured" }, { status: 503 });
  }

  const param = req.nextUrl.searchParams.get("month");
  const month = param && /^\d{4}-\d{2}$/.test(param) ? param : previousMonth();
  const stats = await monthStats(month);

  const rows = artists
    .map((a) => {
      const s = stats[a.slug] ?? { instagram: 0, facebook: 0, total: 0 };
      return { artist: a, ...s, people: s.instagram + s.facebook };
    })
    .sort((a, b) => b.people - a.people);

  const totalPeople = rows.reduce((sum, r) => sum + r.people, 0);
  const summary = [
    `<b>📊 რეპორტი: ${month}</b>`,
    `სულ გადავიდა ${totalPeople} ადამიანი.`,
    "",
    ...rows.map(
      (r) =>
        `• ${escapeHtml(r.artist.name)}: <b>${r.people}</b> (ინსტა ${r.instagram}, ფბ ${r.facebook}; დაწკაპუნება ${r.total})`,
    ),
    "",
    "ქვემოთ თითო ხელოვანზე მზა ტექსტია: შეეხე ბლოკს, დაკოპირდება, და გაუგზავნე.",
  ].join("\n");
  await telegram(summary);

  // თითო ხელოვანის ტექსტი <pre> ბლოკშია: ტელეგრამში ერთი შეხებით კოპირდება.
  // რამდენიმე ხელოვანი ერთ შეტყობინებაში (ლიმიტი 4096 სიმბოლო), რომ ტელეგრამის სიჩქარის ლიმიტს არ გადავაჭარბოთ
  const blocks = rows.map((r) =>
    [
      `<b>${escapeHtml(r.artist.name)}</b>`,
      "<pre>" +
        escapeHtml(
          [
            `გამარჯობა, ${r.artist.name}! 👋`,
            "",
            `${inMonth(month)} „ხელოვანიდან“ შენს გვერდზე გადმოვიდა ${r.people} ადამიანი:`,
            `• ინსტაგრამზე: ${r.instagram}`,
            `• ფეისბუქზე: ${r.facebook}`,
            "",
            "მადლობა, რომ ჩვენთან ხარ! 🧡",
          ].join("\n"),
        ) +
        "</pre>",
    ].join("\n"),
  );
  const messages: string[] = [];
  for (const block of blocks) {
    const last = messages[messages.length - 1];
    if (last && last.length + block.length + 2 < 3800) messages[messages.length - 1] = `${last}\n\n${block}`;
    else messages.push(block);
  }
  for (let i = 0; i < messages.length; i++) {
    if (i > 0) await new Promise((resolve) => setTimeout(resolve, 1100));
    await telegram(messages[i]);
  }

  return NextResponse.json({ ok: true, month, artists: rows.length, totalPeople });
}
