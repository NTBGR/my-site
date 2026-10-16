import { createHash, createHmac, timingSafeEqual } from "node:crypto";

// სტატისტიკის გვერდის დაცვა: პაროლი STATS_PASSWORD (Vercel-ის ცვლადი, არ ინახება კოდში).
// ცვლადი არ არის ან ძალიან მოკლეა (8-ზე ნაკლები): გვერდი ჩაკეტილია ყველასთვის.
export const STATS_COOKIE = "stats_auth";
export const STATS_COOKIE_MAX_AGE = 60 * 60 * 24 * 30;

const secret = () => process.env.STATS_PASSWORD ?? "";

export function statsConfigured(): boolean {
  return secret().length >= 8;
}

const digest = (value: string) => createHash("sha256").update(value).digest();

// პაროლის შედარება მუდმივ დროში (ერთნაირი სიგრძის ჰეშებით)
export function passwordMatches(input: string): boolean {
  return statsConfigured() && timingSafeEqual(digest(input), digest(secret()));
}

// ქუქის მნიშვნელობა: პაროლზე დამოკიდებული ხელმოწერა. პაროლის შეცვლისას ყველა ძველი შესვლა უქმდება
export function statsToken(): string {
  return createHmac("sha256", secret()).update("khelovani-stats-v1").digest("hex");
}

export function tokenValid(value: string | undefined): boolean {
  if (!statsConfigured() || !value) return false;
  const expected = Buffer.from(statsToken());
  const given = Buffer.from(value);
  return given.length === expected.length && timingSafeEqual(given, expected);
}
