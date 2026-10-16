import { NextResponse, type NextRequest } from "next/server";
import { artists, workId } from "@/data/artists";
import { clicksEnabled, conversion, monthOf, monthStats, monthWorkStats, viewStats } from "@/lib/clicks";
import { monthFavorites, monthWorkFavorites } from "@/lib/favoriteStats";

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
  const [stats, favs, workClicks, favWorks, views] = await Promise.all([
    monthStats(month),
    monthFavorites(month),
    monthWorkStats(month),
    monthWorkFavorites(month),
    viewStats(month),
  ]);

  const rows = artists
    .map((a) => {
      const s = stats[a.slug] ?? { instagram: 0, facebook: 0, total: 0 };
      const f = favs[a.slug] ?? { people: 0, saves: 0 };
      const topIndex = f.top ? a.works.findIndex((w, i) => workId(w, i) === f.top!.id) : -1;
      const topTitle = topIndex >= 0 ? a.works[topIndex].title : undefined;
      // ყველა ნამუშევარი, რომელზეც რამე მოხდა: გადასვლა (ადამიანი + სულ დაწკაპუნება) და დაგულება; მაქს. 10
      const workRows = a.works
        .map((w, idx) => {
          const id = workId(w, idx);
          const c = (workClicks[a.slug] ?? []).find((x) => x.id === id);
          return { title: w.title, people: c?.people ?? 0, clicks: c?.total ?? 0, hearts: favWorks[`${a.slug}/${id}`] ?? 0 };
        })
        .filter((x) => x.people > 0 || x.hearts > 0)
        .sort((x, y) => y.people - x.people || y.hearts - x.hearts || y.clicks - x.clicks)
        .slice(0, 10);
      const v = views[a.slug] ?? { people: 0, total: 0 };
      return { artist: a, ...s, viewPeople: v.people, viewTotal: v.total, rate: conversion(v.people, s.instagram + s.facebook), people: s.instagram + s.facebook, favPeople: f.people, favSaves: f.saves, topTitle, topCount: f.top?.count ?? 0, workRows };
    })
    .sort((a, b) => b.people - a.people);

  const titleOf = (key: string) => {
    const [slug, id] = key.split("/");
    const artist = artists.find((a) => a.slug === slug);
    const index = artist ? artist.works.findIndex((w, i) => workId(w, i) === id) : -1;
    return artist && index >= 0 ? `${artist.works[index].title} (${artist.name})` : undefined;
  };
  const topClickedAll = Object.entries(workClicks)
    .flatMap(([slug, list]) => list.map((c) => ({ key: `${slug}/${c.id}`, count: c.people })))
    .filter((x) => x.count > 0 && titleOf(x.key))
    .sort((a, b) => b.count - a.count)
    .slice(0, 5);
  const topSavedAll = Object.entries(favWorks)
    .map(([key, count]) => ({ key, count }))
    .filter((x) => titleOf(x.key))
    .sort((a, b) => b.count - a.count)
    .slice(0, 5);
  const totalPeople = rows.reduce((sum, r) => sum + r.people, 0);
  const totalFavPeople = rows.reduce((sum, r) => sum + r.favPeople, 0);
  const summary = [
    `<b>📊 რეპორტი: ${month}</b>`,
    `სულ გადავიდა ${totalPeople} ადამიანი (სულ ${rows.reduce((sum, r) => sum + r.total, 0)} დაწკაპუნება).`,
    `ფავორიტებში დაამატა ${totalFavPeople} ადამიანმა (ხელოვანებს შორის ჯამი).`,
    "",
    ...rows.map(
      (r) =>
        `• ${escapeHtml(r.artist.name)}: <b>${r.people}</b> გადავიდა (ინსტა ${r.instagram}, ფბ ${r.facebook}; დაწკაპუნება ${r.total}); პროფილზე შევიდა ${r.viewPeople} (${r.viewTotal} ნახვა)${r.rate !== undefined ? `, გადავიდა ≈${r.rate}%` : ""}` +
        (r.favSaves ? `, ❤ ${r.favPeople} ადამიანმა დაიმახსოვრა` : ""),
    ),
    ...(topClickedAll.length
      ? ["", "<b>👆 რომელ ნამუშევრებზე გადავიდნენ ყველაზე ხშირად:</b>", ...topClickedAll.map((x, i) => `${i + 1}. ${escapeHtml(titleOf(x.key)!)}: ${x.count}`)]
      : []),
    ...(topSavedAll.length
      ? ["", "<b>❤ რომელი ნამუშევრები დაიმახსოვრეს ყველაზე ხშირად:</b>", ...topSavedAll.map((x, i) => `${i + 1}. ${escapeHtml(titleOf(x.key)!)}: ${x.count}`)]
      : []),
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
            `${inMonth(month)} „ხელოვანიდან“ შენს გვერდზე გადმოვიდა ${r.people} ადამიანი (სულ ${r.total} დაწკაპუნება):`,
            `• ინსტაგრამზე: ${r.instagram}`,
            `• ფეისბუქზე: ${r.facebook}`,
            ...(r.viewPeople > 0
              ? [
                  "",
                  `შენს პროფილზე შემოვიდა ${r.viewPeople} ადამიანი (სულ ${r.viewTotal} ნახვა)${r.rate !== undefined ? `, მათგან დაახლოებით ${r.rate}% გადავიდა ინსტაგრამზე ან ფეისბუქზე.` : "."}`,
                ]
              : []),
            ...(r.workRows.length
              ? [
                  "",
                  "ნამუშევრების მიხედვით (👆 გადავიდნენ ადამიანი, ფრჩხილებში სულ დაწკაპუნება; ❤ დაიმახსოვრეს):",
                  ...r.workRows.map((w, i) => `${i + 1}. „${w.title}“: 👆 ${w.people} (${w.clicks}), ❤ ${w.hearts}`),
                ]
              : []),
            ...(r.favSaves
              ? [
                  "",
                  `❤ ${r.favPeople} ადამიანმა დაიმახსოვრა შენი ნამუშევარი (სულ ${r.favSaves} დამატება ფავორიტებში).`,
                  ...(r.topTitle ? [`ყველაზე პოპულარული: „${r.topTitle}“ (${r.topCount}).`] : []),
                ]
              : []),
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

  return NextResponse.json({ ok: true, month, artists: rows.length, totalPeople, totalFavPeople });
}
