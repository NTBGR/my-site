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
