import { makerOf } from "@/data/categories";
import type { Lang } from "@/lib/dictionary";

import { zhuzhaCeramics } from "@/data/makers/zhuzha-ceramics";
import { tbgrPosterLab } from "@/data/makers/tbgr-poster-lab";
import { tamusShop } from "@/data/makers/tamus-shop";
import { natiartSpace } from "@/data/makers/natiart-space";
import { glontinini } from "@/data/makers/glontinini";
import { mandeli } from "@/data/makers/mandeli";
import { salita } from "@/data/makers/salita";
import { saflora } from "@/data/makers/saflora";
import { cozyLights } from "@/data/makers/cozy-lights";
import { ninoHandmade } from "@/data/makers/nino-handmade";
import { neneLeatherCraft } from "@/data/makers/nene-leather-craft";
import { ivlisi } from "@/data/makers/ivlisi";
import { laArte } from "@/data/makers/la-arte";
import { mArt } from "@/data/makers/m-art";
import { mokazmuli } from "@/data/makers/mokazmuli";
import { woodMore } from "@/data/makers/wood-more";
import { natutasCeramics } from "@/data/makers/natutas-ceramics";
import { nanikosHandmade } from "@/data/makers/nanikos-handmade";
import { handcraftedHoliday } from "@/data/makers/handcrafted-holiday";

export type ArtistWork = {
  title: string;
  // ინგლისური სათაური (ქართულის გვერდით, რომ ორი ენა ერთ ნამუშევარზე იყოს და არ აირიოს)
  en: string;
  color: string;
  // ნამუშევრის ბმული (პოსტი ინსტაგრამზე, ფეისბუქზე და ა.შ.); თუ არ არის, ავტორის ინსტაგრამი/ფეისბუქი გამოიყენება
  url?: string;
  // ფასი ლარში (₾); თუ არ არის, საიტი ფასს არ აჩვენებს
  price?: number;
  // ფასდაკლება მხოლოდ ამ ნამუშევარზე (%): ხელოვანის საერთო ფასდაკლებას (`sale`) ჩაანაცვლებს
  salePercent?: number;
  // დამატების თარიღი (YYYY-MM-DD): 30 დღით „ახალი“ ნიშანი ჩანს
  added?: string;
  // თაგების გასაღებები (src/data/tags.ts): საჩუქრის მიზეზი, მაგ. "for-her", "for-mom"
  tags?: string[];
  // ნამდვილი ფოტო: ფაილი public/artists/<slug>/..., მისი ზომები პიქსელებში (პროპორციისთვის).
  // ბარათები 3:4-ია (ტელეფონის ვერტიკალური ფოტო); სრულეკრანიან ნახვაში ფოტო მთლიანად ჩანს.
  image?: string;
  width?: number;
  height?: number;
  // ბარათზე ფოტოს რომელი წერტილი დარჩეს ცენტრში, როცა ფოტო 3:4-ში იჭრება: „x% y%“ (მაგ. "80% 50%": მარჯვნივ). ნაგულისხმევი "50% 50%".
  // სრულეკრანიან ნახვაში ფოტო მთლიანად ჩანს, ამიტომ მხოლოდ ბარათზე მოქმედებს
  focal?: string;
  // true: ფოტო ბუნდოვანია ან დაბალი ხარისხისაა (ორიგინალი): მთავარის „ახალ ნამუშევრებში“ არ ჩანს, ხელოვანის გვერდზე კი ჩანს
  lowQuality?: boolean;
  // "contain": ბარათზე ფოტო მთლიანად ჩანს, ცენტრში, ფონზე (ჰორიზონტალური ან პატარა ფოტოსთვის, რომ არ დაიჭრას და არ გაბუნდოვანდეს)
  fit?: "contain";
};

type ArtistText = {
  name: string;
  city: string;
  bio: string;
};

// მონაცემები, როგორც ფაილში წერია. პირველი კატეგორია ხელოვანის მთავარია:
// მისგან ავტომატურად ამოდის პროფესია (მაგ. keramika → „კერამიკოსი“)
export type ArtistData = {
  slug: string;
  name: string;
  city: string;
  categories: string[];
  // საიტზე დამატების თარიღი (YYYY-MM-DD): 14 დღით მთავარზე „ახალი ხელოვანი“ ზოლი ჩანს.
  // თუ არ არის, ავტომატურად იღება ყველაზე ადრეული ნამუშევრის `added`
  joined?: string;
  // უფასო პერიოდი თვეებში, `joined`-იდან (ნაგულისხმევი 2). ვადები და დარჩენილი დღეები ჩანს /stats-ზე, გაფრთხილება მოდის ტელეგრამში
  freeMonths?: number;
  // მუდმივად უფასო (ვადა არ აქვს, გაფრთხილება არ მოდის): პირველი ხელოვანები
  freeForever?: boolean;
  // გამოწერა გადახდილია ამ დღემდე (YYYY-MM-DD): ყოველი გადახდის შემდეგ გადაწიე. თუ არ არის, მოქმედებს მხოლოდ უფასო პერიოდი
  paidUntil?: string;
  // რაზე დაეთანხმა ხელოვანი /join ფორმაში (ტელეგრამის შეტყობინებიდან): პირობებისა და კონფიდენციალურობის ვერსიები, დრო (თბილისის) და ფორმაში ნაჩვენები შეთავაზება.
  // /stats-ზე ჩანს. თუ არ არის, ხელით დაემატა და თანხმობის ჩანაწერი არ არსებობს
  consent?: { terms: string; privacy: string; at: string; offer: string };
  // „გადამოწმებულია“: ხელით შემოწმებულია, რომ ხელოვანის გვერდი ნამდვილია და აქტიური. ნიშანი ჩანს მის გვერდზე და ბარათზე.
  // გასაუქმებლად წაშალე ეს ხაზი ან false დაწერე
  verified?: boolean;
  // ფასდაკლება ხელოვანის ყველა ნამუშევარზე: percent (%) და არასავალდებულო `until` (YYYY-MM-DD, ამ დღის ჩათვლით).
  // გასაშვებად მიუთითე, შესაჩერებლად წაშალე ეს ხაზი ან გასვლის თარიღი დაწერე
  sale?: { percent: number; until?: string };
  // გარე ფოტო: ხელოვანის ბარათზე სიებში (მაგ. ლოგო). თუ არ არის, პირველი ნამუშევრის ფოტო ან ილუსტრაცია
  cover?: string;
  // ხელოვანის გვერდის ბანერის ფოტო (ბანერის ფერს რომ მოუხდეს). თუ არ არის, ქავერი
  banner?: string;
  bio: string;
  instagram: string;
  facebook: string;
  works: ArtistWork[];
  en: ArtistText;
};

// საიტზე გამოსაყენებელი ხელოვანი: + პროფესია (category) მიმდინარე ენაზე
export type Artist = ArtistData & { category: string };

// ხელოვანები (თითო ხელოვანი თავის ფაილშია: src/data/makers/<slug>.ts). რიგი ამ სიაში მხოლოდ ტექნიკურია; საიტზე ახლადდამატებული პირველია (joined თარიღით).
export const artists: ArtistData[] = [
  zhuzhaCeramics,
  tbgrPosterLab,
  tamusShop,
  natiartSpace,
  glontinini,
  mandeli,
  salita,
  saflora,
  cozyLights,
  ninoHandmade,
  neneLeatherCraft,
  ivlisi,
  laArte,
  mArt,
  mokazmuli,
  woodMore,
  natutasCeramics,
  nanikosHandmade,
  handcraftedHoliday,
];

export function localizeArtist(artist: ArtistData, lang: Lang): Artist {
  const category = makerOf(artist.categories[0], lang);
  if (lang === "ka") return { ...artist, category };
  const { en } = artist;
  return {
    ...artist,
    name: en.name,
    city: en.city,
    category,
    bio: en.bio,
    works: artist.works.map((work) => ({
      ...work,
      title: work.en || work.title,
    })),
  };
}

export function getLocalizedArtists(lang: Lang): Artist[] {
  return artists.map((artist) => localizeArtist(artist, lang));
}

export function getArtistBySlug(slug: string): ArtistData | undefined {
  return artists.find((artist) => artist.slug === slug);
}

export function getCities(lang: Lang): string[] {
  return Array.from(
    new Set(artists.map((artist) => localizeArtist(artist, lang).city)),
  );
}

// ნამუშევრის კოდი: ფოტოს ფაილის სახელი (მაგ. "ring-amore"); ფოტოს გარეშე რიგითი ნომერი.
// სტაბილურია: შენახვის (❤️) გასაღებად ვიყენებთ, ნამუშევრების რიგი რომ შეიცვალოს.
export function workId(work: ArtistWork, index: number): string {
  const file = work.image?.split("/").pop()?.replace(/\.[^.]+$/, "");
  return file || `w${index}`;
}

export type WorkEntry = { artist: Artist; work: ArtistWork; index: number; id: string };

// დამატების დრო (ms); თარიღის გარეშე (ძველი) ნამუშევარი 0 არის და სიის ბოლოში ხვდება
export function workAddedTime(work: { added?: string }): number {
  return work.added ? Date.parse(work.added) || 0 : 0;
}

// ყველა ნამუშევარი ერთ სიაში (ავტორთან ერთად): ყველგან დროით, ყველაზე ახლად დამატებული პირველი.
// თანაბარი თარიღისას რიგი ფაილისაა (sort სტაბილურია)
export function getWorkEntries(lang: Lang): WorkEntry[] {
  return getLocalizedArtists(lang)
    .flatMap((artist) => artist.works.map((work, index) => ({ artist, work, index, id: workId(work, index) })))
    .sort((a, b) => workAddedTime(b.work) - workAddedTime(a.work));
}

const DAY = 24 * 60 * 60 * 1000;

// ნამუშევარი „ახალია“, თუ ბოლო 30 დღეში დაემატა
export function isNewWork(work: ArtistWork): boolean {
  if (!work.added) return false;
  const age = Date.now() - Date.parse(work.added);
  // თარიღი YYYY-MM-DD UTC-ის შუაღამეა: საქართველოში (UTC+4) დღევანდელი თარიღი ღამით ჯერ „მომავალში“ ჩანს, ამიტომ 1 დღემდე დაშვება
  return age > -DAY && age < 30 * DAY;
}

// ხელოვანის სიებში საჩვენებლად: ყველაზე ახლად დამატებული პირველი (მარცხნივ).
// თარიღი: `joined`, თორემ ყველაზე ადრეული ნამუშევრის `added`; თანაბარისას ფაილში უფრო ქვემოთ ჩაწერილი პირველი
export function newestArtistsFirst<T extends ArtistData>(list: T[]): T[] {
  const time = (artist: T) => {
    if (artist.joined) return Date.parse(artist.joined) || 0;
    const dates = artist.works.map(workAddedTime).filter((n) => n > 0);
    return dates.length ? Math.min(...dates) : 0;
  };
  return list
    .map((artist, i) => ({ artist, i, t: time(artist) }))
    .sort((a, b) => b.t - a.t || b.i - a.i)
    .map((x) => x.artist);
}

// ფოტო ბარათზე (3:4) ბუნდოვანი არ გამოვა: ჰორიზონტალური ან პატარა ფოტო ბარათზე იჭრება და იზრდება, ამიტომ მთავარის „ახალ ნამუშევრებში“ მხოლოდ ასეთი ფოტოები ჩანს.
// წესი: თანაფარდობა 0.4–0.9 და ბარათზე მოხვედრილი ნაწილი სულ მცირე 780 პიქსელი სიგანეში
export function hasCardQualityPhoto(work: ArtistWork): boolean {
  if (work.lowQuality || !work.image || !work.width || !work.height) return false;
  const ratio = work.width / work.height;
  if (ratio < 0.4 || ratio > 0.9) return false;
  const visibleWidth = ratio >= 0.75 ? work.height * 0.75 : work.width;
  return visibleWidth >= 780;
}

// ხელოვანი „ახალია“, თუ ბოლო 14 დღეში დაემატა
export function isNewArtist(artist: ArtistData): boolean {
  const dates = [artist.joined, ...artist.works.map((work) => work.added)]
    .filter((d): d is string => Boolean(d))
    .map((d) => Date.parse(d))
    .filter((n) => !Number.isNaN(n));
  if (dates.length === 0) return false;
  // joined მითითებულია: ის ვარგა; თორემ ყველაზე ადრეული ნამუშევარი (ყველა ნამუშევარს თარიღი უნდა ჰქონდეს, თორემ ხელოვანი ძველია)
  const explicit = artist.joined ? Date.parse(artist.joined) : undefined;
  const allDated = artist.works.length > 0 && artist.works.every((work) => work.added);
  const start = explicit ?? (allDated ? Math.min(...dates) : undefined);
  if (start === undefined || Number.isNaN(start)) return false;
  const age = Date.now() - start;
  return age > -DAY && age < 14 * DAY;
}

// ფასი ფასდაკლების გათვალისწინებით: price = რასაც მყიდველი იხდის, original/percent მხოლოდ ფასდაკლებისას
export type Pricing = { price: number; original?: number; percent?: number };

export function pricing(artist: ArtistData, work: ArtistWork): Pricing | undefined {
  if (work.price === undefined) return undefined;
  let percent = work.salePercent;
  if (percent === undefined && artist.sale) {
    const { until } = artist.sale;
    // until-ის დღე ჩათვლით (24 საათი თარიღის დასაწყისიდან)
    const live = !until || Date.now() < Date.parse(until) + 24 * 60 * 60 * 1000;
    if (live) percent = artist.sale.percent;
  }
  if (!percent || percent <= 0 || percent >= 100) return { price: work.price };
  return { price: Math.round(work.price * (1 - percent / 100)), original: work.price, percent };
}

// ფასი, რასაც მყიდველი იხდის (ფასდაკლებით)
export function effectivePrice(artist: ArtistData, work: ArtistWork): number | undefined {
  return pricing(artist, work)?.price;
}
