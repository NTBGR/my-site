import { createHash } from "node:crypto";

// გადასვლების დათვლა Upstash Redis-ში (REST API, ბიბლიოთეკის გარეშე).
// Vercel-ის Upstash ინტეგრაცია ცვლადებს პრეფიქსით ამატებს (KV_REST_API_URL, STORAGE_REST_API_URL...);
// ხელით შექმნილ ბაზას UPSTASH_REDIS_REST_URL/UPSTASH_REDIS_REST_TOKEN აქვს.
function findEnv(suffix: string, fallback: string) {
  if (process.env[fallback]) return process.env[fallback];
  const key = Object.keys(process.env).find((k) => k.endsWith(suffix) && !k.includes("READ_ONLY"));
  return key ? process.env[key] : undefined;
}
const URL_ = process.env.KV_REST_API_URL || findEnv("_REST_API_URL", "UPSTASH_REDIS_REST_URL");
const TOKEN = process.env.KV_REST_API_TOKEN || findEnv("_REST_API_TOKEN", "UPSTASH_REDIS_REST_TOKEN");

export const clicksEnabled = Boolean(URL_ && TOKEN);

export type ClickTarget = "instagram" | "facebook";

type RedisResult = { result?: unknown; error?: string };

export async function pipeline(commands: (string | number)[][]): Promise<RedisResult[]> {
  const res = await fetch(`${URL_}/pipeline`, {
    method: "POST",
    headers: { Authorization: `Bearer ${TOKEN}`, "Content-Type": "application/json" },
    body: JSON.stringify(commands),
    cache: "no-store",
  });
  if (!res.ok) throw new Error(`redis ${res.status}`);
  return res.json();
}

// თბილისის დროით თვე და დღე (რეპორტი ქართული თვის მიხედვით)
function tbilisiDate(date = new Date()) {
  return new Date(date.getTime() + 4 * 60 * 60 * 1000).toISOString();
}
export const monthOf = (date = new Date()) => tbilisiDate(date).slice(0, 7); // 2026-10
const dayOf = (date = new Date()) => tbilisiDate(date).slice(0, 10); // 2026-10-04

const BOT_UA =
  /bot|crawl|spider|slurp|preview|facebookexternalhit|whatsapp|telegram|viber|skype|discord|headless|lighthouse|curl|wget|python|node-fetch|axios/i;

export function isBot(userAgent: string | null) {
  return !userAgent || BOT_UA.test(userAgent);
}

/**
 * ერთი გადასვლის ჩაწერა.
 * total: ყველა დაწკაპუნება; unique: ერთი ადამიანი (ბრაუზერის ქუქი, ან IP+ბრაუზერი) ერთ დღეში ერთხელ ითვლება.
 * ვინაობა არსად ინახება, მხოლოდ მისი ჰეში 1 დღით, დუბლიკატების გასაფილტრად.
 */
export async function recordClick(slug: string, target: ClickTarget, visitorId: string) {
  if (!clicksEnabled) return;
  const month = monthOf();
  const day = dayOf();
  const visitor = createHash("sha256").update(`${visitorId}|${day}`).digest("hex").slice(0, 24);
  const seenKey = `seen:${day}:${slug}:${target}:${visitor}`;

  const [seen] = await pipeline([
    ["SET", seenKey, "1", "NX", "EX", 90000],
    ["HINCRBY", `clicks:${month}:total`, `${slug}:${target}`, 1],
  ]);
  if (seen?.result === "OK") {
    await pipeline([["HINCRBY", `clicks:${month}:unique`, `${slug}:${target}`, 1]]);
  }
}

export type MonthStats = Record<string, { instagram: number; facebook: number; total: number }>;

// თვის სტატისტიკა ხელოვანების მიხედვით (უნიკალური ადამიანები + ჯამური დაწკაპუნებები)
export async function monthStats(month: string): Promise<MonthStats> {
  if (!clicksEnabled) return {};
  const [unique, total] = await pipeline([
    ["HGETALL", `clicks:${month}:unique`],
    ["HGETALL", `clicks:${month}:total`],
  ]);
  const stats: MonthStats = {};
  const read = (r: RedisResult, apply: (slug: string, target: string, n: number) => void) => {
    const flat = (r?.result as string[] | null) ?? [];
    for (let i = 0; i < flat.length; i += 2) {
      const [slug, target] = flat[i].split(":");
      apply(slug, target, Number(flat[i + 1]) || 0);
    }
  };
  const row = (slug: string) => (stats[slug] ??= { instagram: 0, facebook: 0, total: 0 });
  read(unique, (slug, target, n) => {
    if (target === "instagram" || target === "facebook") row(slug)[target] += n;
  });
  read(total, (slug, _t, n) => {
    row(slug).total += n;
  });
  return stats;
}
