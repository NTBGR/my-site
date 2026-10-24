import { createHash } from "node:crypto";
import { artists, workId } from "@/data/artists";
import { clicksEnabled, monthOf, pipeline } from "@/lib/clicks";

// „ფავორიტებში დამატებების“ დათვლა თვის მიხედვით (Redis).
// ვინაობა არსად ინახება: მხოლოდ ბრაუზერის ანონიმური კოდის ჰეში, რომ ერთი ადამიანი ერთ ნამუშევარს ერთხელ ჩაითვალოს.
// ამოღებას არ ვითვლით: რეპორტში ჩანს, რამდენმა დაამატა თვის განმავლობაში.
const TTL = 60 * 60 * 24 * 120;

const validKeys = new Set(artists.flatMap((a) => a.works.map((w, i) => `${a.slug}/${workId(w, i)}`)));

export function isWorkKey(key: unknown): key is string {
  return typeof key === "string" && validKeys.has(key);
}

export async function recordFavorite(key: string, visitorId: string) {
  if (!clicksEnabled) return;
  const slug = key.split("/")[0];
  const month = monthOf();
  const visitor = createHash("sha256").update(`fav|${visitorId}`).digest("hex").slice(0, 24);
  await pipeline([
    ["SADD", `favp:${month}:${slug}`, visitor],
    ["EXPIRE", `favp:${month}:${slug}`, TTL],
    ["SADD", `favw:${month}:${key}`, visitor],
    ["EXPIRE", `favw:${month}:${key}`, TTL],
  ]);
}

export type FavoriteStats = Record<string, { people: number; saves: number; top?: { id: string; count: number } }>;

// ხელოვანის მიხედვით: რამდენმა ადამიანმა დაამატა რამე ფავორიტებში, სულ რამდენი დამატება და ყველაზე ხშირად დამატებული ნამუშევარი
export async function monthFavorites(month: string): Promise<FavoriteStats> {
  if (!clicksEnabled) return {};
  const workKeys = [...validKeys];
  const results = await pipeline([
    ...artists.map((a) => ["SCARD", `favp:${month}:${a.slug}`]),
    ...workKeys.map((k) => ["SCARD", `favw:${month}:${k}`]),
  ]);
  const stats: FavoriteStats = {};
  artists.forEach((a, i) => {
    stats[a.slug] = { people: Number(results[i]?.result) || 0, saves: 0 };
  });
  workKeys.forEach((k, i) => {
    const count = Number(results[artists.length + i]?.result) || 0;
    const [slug, id] = k.split("/");
    const row = stats[slug];
    row.saves += count;
    if (count > 0 && (!row.top || count > row.top.count)) row.top = { id, count };
  });
  return stats;
}

// ნამუშევრის მიხედვით: რამდენმა ადამიანმა დაიმახსოვრა (ფავორიტებში დაამატა) ამ თვეში. გასაღები: "ხელოვანი/ნამუშევარი"
export async function monthWorkFavorites(month: string): Promise<Record<string, number>> {
  if (!clicksEnabled) return {};
  const keys = [...validKeys];
  const results = await pipeline(keys.map((k) => ["SCARD", `favw:${month}:${k}`]));
  const out: Record<string, number> = {};
  keys.forEach((k, i) => {
    const count = Number(results[i]?.result) || 0;
    if (count > 0) out[k] = count;
  });
  return out;
}

// ყველაზე ხშირად შენახული ნამუშევრები (მიმდინარე და წინა თვე ერთად); 5 წუთით ვინახავთ მეხსიერებაში, რომ ყოველ ვიზიტზე ბაზას არ მივმართოთ
let trendCache: { at: number; data: { key: string; count: number }[] } | null = null;

export async function topSavedWorks(limit = 8): Promise<{ key: string; count: number }[]> {
  return (await savedCounts()).slice(0, limit);
}

// ყველა ნამუშევრის შენახვები ერთ ობიექტად (გასაღები „ხელოვანი/ნამუშევარი“): ბარათებზე ❤ რიცხვისთვის; ვისაც არავინ შეუნახავს, აქ არ არის
export async function saveCounts(): Promise<Record<string, number>> {
  return Object.fromEntries((await savedCounts()).map(({ key, count }) => [key, count]));
}

// ერთი ხელოვანის ნამუშევრების შენახვები (გასაღები „ხელოვანი/ნამუშევარი“) და მათი ჯამი: ხელოვანის გვერდზე საჯაროდ ჩანს
export async function artistSaves(slug: string): Promise<{ byWork: Record<string, number>; total: number }> {
  const byWork: Record<string, number> = {};
  let total = 0;
  for (const { key, count } of await savedCounts()) {
    if (!key.startsWith(`${slug}/`)) continue;
    byWork[key] = count;
    total += count;
  }
  return { byWork, total };
}

async function savedCounts(): Promise<{ key: string; count: number }[]> {
  if (!clicksEnabled) return [];
  if (trendCache && Date.now() - trendCache.at < 5 * 60 * 1000) return trendCache.data;
  try {
    const month = monthOf();
    const [y, m] = month.split("-").map(Number);
    const previous = new Date(Date.UTC(y, m - 2, 15)).toISOString().slice(0, 7);
    const keys = [...validKeys];
    const results = await pipeline([
      ...keys.map((k) => ["SCARD", `favw:${month}:${k}`]),
      ...keys.map((k) => ["SCARD", `favw:${previous}:${k}`]),
    ]);
    const data = keys
      .map((key, i) => ({ key, count: (Number(results[i]?.result) || 0) + (Number(results[keys.length + i]?.result) || 0) }))
      .filter((x) => x.count > 0)
      .sort((a, b) => b.count - a.count);
    trendCache = { at: Date.now(), data };
    return data;
  } catch {
    return [];
  }
}
