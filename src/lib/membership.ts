import type { ArtistData } from "@/data/artists";

// ხელოვანის უფასო პერიოდი და გამოწერა: როდის დაიწყო, როდის იწურება და რამდენი დღე დარჩა.
// დაწყება: `joined` (ან, თუ არ არის, ყველაზე ადრეული ნამუშევრის `added`); ხანგრძლივობა: `freeMonths` (ნაგულისხმევი 3 თვე);
// თუ ხელოვანმა გადაიხადა, `paidUntil` ვადას აგრძელებს. ყველა თარიღი თბილისის დროით

export const DEFAULT_FREE_MONTHS = 3;
const DAY = 24 * 60 * 60 * 1000;

export type MembershipStatus = "trial" | "paid" | "soon" | "expired" | "forever";

export type Membership = {
  // დაწყების დღე (YYYY-MM-DD)
  start: string;
  freeMonths: number;
  // უფასო პერიოდის ბოლო: ამ დღიდან უფასო აღარ არის
  trialEnd: string;
  // საბოლოო ვადა: უფასო პერიოდი ან გადახდილი პერიოდი, რომელიც უფრო გვიანაა
  end: string;
  paid: boolean;
  // მუდმივად უფასო: ვადა არ აქვს (end ცარიელია, daysLeft = Infinity)
  forever: boolean;
  // რამდენი დღე დარჩა ვადამდე (0 = დღეს იწურება, უარყოფითი = უკვე გავიდა)
  daysLeft: number;
  status: MembershipStatus;
};

// დღევანდელი დღე თბილისში (YYYY-MM-DD)
export function tbilisiToday(date = new Date()): string {
  return new Intl.DateTimeFormat("en-CA", { timeZone: "Asia/Tbilisi", year: "numeric", month: "2-digit", day: "2-digit" }).format(date);
}

// თვეების დამატება: თუ ასეთი დღე იმ თვეში არ არის (31 იანვარი + 1 თვე), თვის ბოლო დღე
export function addMonths(day: string, months: number): string {
  const [y, m, d] = day.split("-").map(Number);
  const lastDay = new Date(Date.UTC(y, m - 1 + months + 1, 0)).getUTCDate();
  return new Date(Date.UTC(y, m - 1 + months, Math.min(d, lastDay))).toISOString().slice(0, 10);
}

const daysBetween = (from: string, to: string) => Math.round((Date.parse(to) - Date.parse(from)) / DAY);

export function startOf(artist: ArtistData): string | undefined {
  if (artist.joined) return artist.joined;
  const dates = artist.works.map((work) => work.added).filter((d): d is string => Boolean(d)).sort();
  return dates[0];
}

export function membership(artist: ArtistData, today = tbilisiToday()): Membership | undefined {
  const start = startOf(artist);
  if (!start) return undefined;
  if (artist.freeForever) {
    return { start, freeMonths: 0, trialEnd: "", end: "", paid: false, forever: true, daysLeft: Number.POSITIVE_INFINITY, status: "forever" };
  }
  const freeMonths = artist.freeMonths ?? DEFAULT_FREE_MONTHS;
  const trialEnd = addMonths(start, freeMonths);
  const paid = Boolean(artist.paidUntil && artist.paidUntil > trialEnd);
  const end = paid ? artist.paidUntil! : trialEnd;
  const daysLeft = daysBetween(today, end);
  const status: MembershipStatus = daysLeft < 0 ? "expired" : daysLeft <= 7 ? "soon" : paid ? "paid" : "trial";
  return { start, freeMonths, trialEnd, end, paid, forever: false, daysLeft, status };
}

// ყველა ხელოვანი ვადით, ყველაზე ახლოს მყოფი ვადა პირველი; მუდმივად უფასოები ბოლოში
export function memberships(list: ArtistData[], today = tbilisiToday()) {
  return list
    .map((artist) => ({ artist, m: membership(artist, today) }))
    .filter((row): row is { artist: ArtistData; m: Membership } => Boolean(row.m))
    .sort((a, b) => Number(a.m.forever) - Number(b.m.forever) || a.m.end.localeCompare(b.m.end));
}

const MONTHS_GEN = ["იანვარს", "თებერვალს", "მარტს", "აპრილს", "მაისს", "ივნისს", "ივლისს", "აგვისტოს", "სექტემბერს", "ოქტომბერს", "ნოემბერს", "დეკემბერს"];
// „18 დეკემბერს“
export const onDay = (day: string) => `${Number(day.slice(8, 10))} ${MONTHS_GEN[Number(day.slice(5, 7)) - 1]}`;

// „დარჩა 12 დღე“, „დღეს იწურება“, „ვადა გავიდა 3 დღის წინ“
export function daysLeftText(daysLeft: number): string {
  if (daysLeft > 1) return `დარჩა ${daysLeft} დღე`;
  if (daysLeft === 1) return "ხვალ იწურება";
  if (daysLeft === 0) return "დღეს იწურება";
  return `ვადა გავიდა ${-daysLeft} დღის წინ`;
}
