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
export const dayOf = (date = new Date()) => tbilisiDate(date).slice(0, 10); // 2026-10-04

// მრიცხველების გასაღები პერიოდის მიხედვით: თვე ("2026-10") ან დღე ("2026-10-17")
const base = (period: string) => (period.length === 7 ? `clicks:${period}` : `clicks:day:${period}`);
// დღიური მრიცხველები 60 დღეში იშლება
const DAY_TTL = 60 * 24 * 60 * 60;

const BOT_UA =
  /bot|crawl|spider|slurp|preview|facebookexternalhit|whatsapp|telegram|viber|skype|discord|headless|lighthouse|curl|wget|python|node-fetch|axios/i;

export function isBot(userAgent: string | null) {
  return !userAgent || BOT_UA.test(userAgent);
}

/**
 * ერთი გადასვლის ჩაწერა.
 * total: ყველა დაწკაპუნება; unique: ერთი ადამიანი (ბრაუზერის ქუქი, ან IP+ბრაუზერი) ერთ დღეში ერთხელ ითვლება.
 * ვინაობა არსად ინახება, მხოლოდ მისი ჰეში 1 დღით, დუბლიკატების გასაფილტრად.
 * workId: თუ გადასვლა კონკრეტულ ნამუშევარზე იყო, ცალკე ითვლება ნამუშევრის მიხედვითაც (რეპორტში „რომელმა ნივთმა მიიქცია ყურადღება“).
 */
export async function recordClick(slug: string, target: ClickTarget, visitorId: string, workId?: string) {
  if (!clicksEnabled) return;
  const month = monthOf();
  const day = dayOf();
  const visitor = createHash("sha256").update(`${visitorId}|${day}`).digest("hex").slice(0, 24);
  const seenKey = `seen:${day}:${slug}:${target}:${visitor}`;

  const dayKey = base(day);
  const [seen] = await pipeline([
    ["SET", seenKey, "1", "NX", "EX", 90000],
    ["HINCRBY", `clicks:${month}:total`, `${slug}:${target}`, 1],
    ["HINCRBY", `${dayKey}:total`, `${slug}:${target}`, 1],
    ["EXPIRE", `${dayKey}:total`, DAY_TTL],
  ]);
  if (seen?.result === "OK") {
    await pipeline([
      ["HINCRBY", `clicks:${month}:unique`, `${slug}:${target}`, 1],
      ["HINCRBY", `${dayKey}:unique`, `${slug}:${target}`, 1],
      ["EXPIRE", `${dayKey}:unique`, DAY_TTL],
    ]);
  }

  if (workId) {
    // ნამუშევრის მრიცხველი ცალკე ჰეშებშია, ხელოვანის დათვლას არ ეხება. უნიკალური: ერთი ადამიანი ერთ ნამუშევარზე დღეში ერთხელ
    const workSeenKey = `seen:${day}:${slug}:w:${workId}:${visitor}`;
    const [workSeen] = await pipeline([
      ["SET", workSeenKey, "1", "NX", "EX", 90000],
      ["HINCRBY", `clicks:${month}:worktotal`, `${slug}:${workId}`, 1],
      ["HINCRBY", `${dayKey}:worktotal`, `${slug}:${workId}`, 1],
      ["EXPIRE", `${dayKey}:worktotal`, DAY_TTL],
    ]);
    if (workSeen?.result === "OK") {
      await pipeline([
        ["HINCRBY", `clicks:${month}:workunique`, `${slug}:${workId}`, 1],
        ["HINCRBY", `${dayKey}:workunique`, `${slug}:${workId}`, 1],
        ["EXPIRE", `${dayKey}:workunique`, DAY_TTL],
      ]);
    }
  }
}

export type MonthStats = Record<string, { instagram: number; facebook: number; total: number }>;

// სტატისტიკა ხელოვანების მიხედვით (უნიკალური ადამიანები + ჯამური დაწკაპუნებები): period = თვე ("2026-10") ან დღე ("2026-10-17")
export async function monthStats(period: string): Promise<MonthStats> {
  if (!clicksEnabled) return {};
  const [unique, total] = await pipeline([
    ["HGETALL", `${base(period)}:unique`],
    ["HGETALL", `${base(period)}:total`],
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

export type WorkClicks = { id: string; people: number; total: number };

// თვის დაწკაპუნებები ნამუშევრების მიხედვით: ხელოვანის slug → ნამუშევრები (ყველაზე მეტი ადამიანით დაწყებული)
export async function monthWorkStats(period: string): Promise<Record<string, WorkClicks[]>> {
  if (!clicksEnabled) return {};
  const [unique, total] = await pipeline([
    ["HGETALL", `${base(period)}:workunique`],
    ["HGETALL", `${base(period)}:worktotal`],
  ]);
  const byKey = new Map<string, WorkClicks & { slug: string }>();
  const read = (r: RedisResult, apply: (row: WorkClicks, n: number) => void) => {
    const flat = (r?.result as string[] | null) ?? [];
    for (let i = 0; i < flat.length; i += 2) {
      const sep = flat[i].indexOf(":");
      if (sep < 0) continue;
      const slug = flat[i].slice(0, sep);
      const id = flat[i].slice(sep + 1);
      const row = byKey.get(flat[i]) ?? { slug, id, people: 0, total: 0 };
      byKey.set(flat[i], row);
      apply(row, Number(flat[i + 1]) || 0);
    }
  };
  read(unique, (row, n) => {
    row.people += n;
  });
  read(total, (row, n) => {
    row.total += n;
  });
  const out: Record<string, WorkClicks[]> = {};
  for (const { slug, ...row } of byKey.values()) (out[slug] ??= []).push(row);
  for (const list of Object.values(out)) list.sort((a, b) => b.people - a.people || b.total - a.total);
  return out;
}

// ---------- ხელოვანის პროფილის ნახვები ----------
// ნახვების მრიცხველები გადასვლებისგან ცალკეა: views:<თვე|day:დღე>:unique/total, ველი = ხელოვანის slug
const viewBase = (period: string) => (period.length === 7 ? `views:${period}` : `views:day:${period}`);

/**
 * პროფილის ერთი ნახვა. total: ყველა ნახვა; unique: ერთი ადამიანი დღეში ერთხელ (ვინაობა არ ინახება, მხოლოდ ჰეში 1 დღით).
 */
export async function recordView(slug: string, visitorId: string) {
  if (!clicksEnabled) return;
  const month = monthOf();
  const day = dayOf();
  const visitor = createHash("sha256").update(`view|${visitorId}|${day}`).digest("hex").slice(0, 24);
  const [seen] = await pipeline([
    ["SET", `seenview:${day}:${slug}:${visitor}`, "1", "NX", "EX", 90000],
    ["HINCRBY", `${viewBase(month)}:total`, slug, 1],
    ["HINCRBY", `${viewBase(day)}:total`, slug, 1],
    ["EXPIRE", `${viewBase(day)}:total`, DAY_TTL],
  ]);
  if (seen?.result === "OK") {
    await pipeline([
      ["HINCRBY", `${viewBase(month)}:unique`, slug, 1],
      ["HINCRBY", `${viewBase(day)}:unique`, slug, 1],
      ["EXPIRE", `${viewBase(day)}:unique`, DAY_TTL],
    ]);
  }
}

export type ViewStats = Record<string, { people: number; total: number }>;

// პროფილის ნახვები ხელოვანების მიხედვით: period = თვე ("2026-10") ან დღე ("2026-10-17")
export async function viewStats(period: string): Promise<ViewStats> {
  if (!clicksEnabled) return {};
  const [unique, total] = await pipeline([
    ["HGETALL", `${viewBase(period)}:unique`],
    ["HGETALL", `${viewBase(period)}:total`],
  ]);
  const out: ViewStats = {};
  const read = (r: RedisResult, apply: (row: { people: number; total: number }, n: number) => void) => {
    const flat = (r?.result as string[] | null) ?? [];
    for (let i = 0; i < flat.length; i += 2) apply((out[flat[i]] ??= { people: 0, total: 0 }), Number(flat[i + 1]) || 0);
  };
  read(unique, (row, n) => {
    row.people += n;
  });
  read(total, (row, n) => {
    row.total += n;
  });
  return out;
}

// რამდენი პროცენტი გადავიდა ინსტაგრამზე ან ფეისბუქზე იმათგან, ვინც პროფილზე შემოვიდა.
// გადასვლა სხვა გვერდებიდანაც შეიძლება (საჩუქრების სია, მთავარი), ამიტომ შეფასებაა და 100%-ს არ აღემატება
export function conversion(viewPeople: number, clickPeople: number): number | undefined {
  if (viewPeople <= 0) return undefined;
  return Math.min(100, Math.round((clickPeople / viewPeople) * 100));
}

// სტატისტიკის გაანულება: წაიშლება მხოლოდ დათვლის გასაღებები (გადასვლები, ნახვები, ფავორიტები და დუბლიკატების ნიშნები).
// სიხშირის ლიმიტის მრიცხველები (rl:*) და სხვა არაფერი ეხება. აღდგენა შეუძლებელია
export async function resetStats(): Promise<number> {
  if (!clicksEnabled) return 0;
  let deleted = 0;
  for (const pattern of ["clicks:*", "views:*", "favp:*", "favw:*", "seen:*", "seenview:*"]) {
    let cursor = "0";
    do {
      const [res] = await pipeline([["SCAN", cursor, "MATCH", pattern, "COUNT", 500]]);
      const [next, keys] = (res?.result as [string, string[]] | undefined) ?? ["0", []];
      cursor = String(next);
      if (keys.length > 0) {
        await pipeline([["DEL", ...keys]]);
        deleted += keys.length;
      }
    } while (cursor !== "0");
  }
  return deleted;
}

// ხელოვანის გვერდზე ჩვენებული „ამ თვეში გადავიდა N ადამიანი“. ხშირი კითხვა რომ ბაზას არ დააწვეს, 5 წუთით ვიმახსოვრებთ მეხსიერებაში
let reachCache: { at: number; month: string; people: Record<string, number> } | null = null;

export async function monthReach(slug: string): Promise<number> {
  if (!clicksEnabled) return 0;
  const month = monthOf();
  if (!reachCache || reachCache.month !== month || Date.now() - reachCache.at > 5 * 60 * 1000) {
    const stats = await monthStats(month);
    reachCache = {
      at: Date.now(),
      month,
      people: Object.fromEntries(Object.entries(stats).map(([key, s]) => [key, s.instagram + s.facebook])),
    };
  }
  return reachCache.people[slug] ?? 0;
}
