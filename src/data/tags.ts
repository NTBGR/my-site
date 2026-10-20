import { effectivePrice, getWorkEntries, pricing, type WorkEntry } from "@/data/artists";
import type { Lang } from "@/lib/dictionary";

// თაგები: ნამუშევრების სწრაფი ჯგუფები საჩუქრის მიზეზის მიხედვით (კატეგორია კი ხელობას აჩვენებს).
// ნამუშევარს თაგი ეძლევა ხელით (artists.ts-ში `tags`), გარდა ფასიანი თაგისა: ის ფასიდან ავტომატურად გამოდის.
export type Tag = {
  slug: string;
  // ემოჯი წარწერის წინ (ზოლში და გვერდის სათაურში)
  emoji: string;
  name: string;
  description: string;
  // თუ მითითებულია, ამ ფასამდე (ჩათვლით) ყველა ნამუშევარი ავტომატურად ხვდება თაგში
  maxPrice?: number;
  // ძებნისთვის: სიტყვები, რითაც ადამიანი ამ საჩუქარს ეძებს („დედისთვის“, „ბავშვი“, „football“...)
  keywords?: string[];
  // თუ true, თაგში ხვდება ყველა ნამუშევარი, რომელსაც ახლა ფასდაკლება აქვს
  sale?: boolean;
  // დროებით დამალული თაგი: არ ჩანს ზოლში, გვერდიც არ იხსნება და sitemap-შიც არ არის (წაშლა არ სჭირდება, უბრალოდ ამოიღე hidden)
  hidden?: boolean;
  // სეზონური თაგი: ჩანს მხოლოდ ამ თარიღებს შორის (YYYY-MM-DD, ორივე ჩათვლით); გარეთ ისე იქცევა, როგორც hidden (ზოლში, ძებნაში და sitemap-ში არ არის, გვერდიც არ იხსნება)
  season?: { from: string; to: string };
  // საახალწლო/ზეიმის სტილი ბანერზე (მწვანე ფონი და თოვლი)
  festive?: boolean;
  // „მალე“: ამ თარიღამდე (YYYY-MM-DD, თბილისის დროით 00:00) თაგი ზოლში ჩანს, მაგრამ გამორთულია (დაჭერა არ შეიძლება, ათვლით); გვერდი, ბანერი, ძებნა და sitemap დამალულია. თარიღზე თავისით ამოქმედდება
  opensAt?: string;
  // ბანერის კოლაჟი: სამი კატეგორიის სურათი
  collage: [string, string, string];
  en: { name: string; description: string };
};

// თანმიმდევრობა ზოლში ასეთია
export const tags: Tag[] = [
  {
    slug: "sale",
    keywords: ["ფასდაკლება","ფასდაკლებები","ფასდაკლებული","აქცია","გაიაფებული","sale","discount","deal"],
    collage: ["posterebi", "sachuqrebi", "keramika"],
    emoji: "🔥",
    name: "ფასდაკლებები",
    description: "ხელნაკეთი ნამუშევრები ფასდაკლებით.",
    sale: true,
    en: { name: "Sale", description: "Handmade works at a discount." },
  },
  {
    slug: "for-kids",
    keywords: ["ბავშვი","ბავშვისთვის","ბავშვებისთვის","შვილი","შვილისთვის","kids","kid","child","baby"],
    collage: ["sachuqrebi", "tekstili", "saxlis-dekori"],
    emoji: "🧸",
    name: "საჩუქარი ბავშვისთვის",
    description: "ხელნაკეთი საჩუქრები ბავშვებისთვის.",
    en: { name: "Gifts for kids", description: "Handmade gifts for kids." },
  },
  {
    slug: "under-100",
    keywords: ["იაფი","ბიუჯეტი","ბიუჯეტური","ლარამდე","100","cheap","budget","affordable"],
    collage: ["sachuqrebi", "keramika", "tekstili"],
    emoji: "🏷️",
    name: "საჩუქარი 100 ₾-მდე",
    description: "ხელნაკეთი ნამუშევრები 100 ლარამდე ფასად.",
    maxPrice: 100,
    en: { name: "Gifts under 100 ₾", description: "Handmade works priced up to 100 GEL." },
  },
  {
    slug: "for-her",
    keywords: ["ქალი","ქალისთვის","ქალბატონი","ქალბატონისთვის","დედა","დედას","დედისთვის","მეუღლე","ცოლი","ცოლისთვის","გოგო","გოგოს","გოგოსთვის","მეგობარი","და","დისთვის","her","woman","women","girl","girlfriend","mom","mother","wife","sister","ladies"],
    collage: ["samkauli", "tekstili", "sachuqrebi"],
    emoji: "💐",
    name: "საჩუქარი ქალბატონებისთვის",
    description: "ხელნაკეთი საჩუქრები ქალბატონებისთვის: თაიგულები, სამკაულები და სხვა.",
    en: { name: "Gifts for ladies", description: "Handmade gifts for ladies: bouquets, jewelry and more." },
  },
  {
    slug: "for-him",
    keywords: ["კაცი","კაცისთვის","მამაკაცი","მამაკაცისთვის","მამა","მამას","მამისთვის","ქმარი","ქმრისთვის","ბიჭი","ბიჭისთვის","ძმა","ძმისთვის","him","man","men","dad","father","husband","boyfriend","brother"],
    collage: ["tyavi", "posterebi", "khis-nakethobebi"],
    emoji: "🎁",
    name: "საჩუქარი მამაკაცებისთვის",
    description: "ხელნაკეთი საჩუქრები მამაკაცებისთვის: პოსტერები და სხვა.",
    en: { name: "Gifts for men", description: "Handmade gifts for men: posters and more." },
  },
  {
    slug: "for-fans",
    keywords: ["ფეხბურთი","ფეხბურთელი","სპორტი","გულშემატკივარი","გულშემატკივარს","ბარსა","რეალი","football","soccer","sport","sports","fan","fans"],
    collage: ["posterebi", "nakhatebi", "sachuqrebi"],
    emoji: "⚽",
    name: "საჩუქარი გულშემატკივარს",
    description: "პოსტერები და სხვა საჩუქრები სპორტის გულშემატკივრისთვის.",
    en: { name: "Gifts for fans", description: "Posters and other gifts for sports fans." },
  },
  {
    slug: "new-year",
    keywords: ["ახალი წელი","ახალწელი","საახალწლო","ახალ წელს","შობა","ნაძვის ხე","ნიუ იარ","new year","newyear","christmas","xmas","holiday","gift"],
    collage: ["sachuqrebi", "keramika", "tekstili"],
    emoji: "🎄",
    name: "საახალწლო საჩუქრები",
    description: "ხელნაკეთი საჩუქრები ახალი წლისთვის: პირდაპირ ავტორისგან, რომ ახალი წელი განსაკუთრებული იყოს.",
    // სეზონი: თარიღების შეცვლით ბანერი და გვერდი ადრე ან გვიან გამოჩნდება
    season: { from: "2026-10-19", to: "2027-01-10" },
    // opensAt: "2026-12-01", // ჩართე ეს ხაზი, რომ ჩიპი ისევ გამორთული იყოს („მალე“ და ათვლა) მითითებულ თარიღამდე
    festive: true,
    // დროებით ამოღებულია (2026-10-21): ჩიპი, გვერდი, ძებნა და sitemap დამალულია. დასაბრუნებლად: წაშალე შემდეგი hidden ხაზი (+ სურვილისამებრ ჩართე opensAt „მალე“-ს ათვლისთვის) და მთავარზე ბანერისთვის დაამატე <NewYearPromo /> app/page.tsx-ში <SalePromo />-ის შემდეგ.
    // დანარჩენი (ბანერის ფოტოები public/categories/soft-1, soft-2, soft-3c, ფიფქები, ქაუნთდაუნი, ყველა ნამუშევრის new-year თაგი) მზადაა და ხელუხლებელია
    hidden: true,
    en: { name: "New Year gifts", description: "Handmade gifts for the New Year, straight from the maker, to make the holidays special." },
  },
  {
    slug: "for-mom",
    collage: ["sachuqrebi", "tekstili", "saxlis-dekori"],
    emoji: "🌸",
    hidden: true,
    name: "საჩუქარი დედას",
    description: "ხელნაკეთი საჩუქრები დედისთვის.",
    en: { name: "Gifts for mom", description: "Handmade gifts for mom." },
  },
  {
    slug: "never-wilts",
    collage: ["tekstili", "sachuqrebi", "saxlis-dekori"],
    emoji: "🌷",
    hidden: true,
    name: "თაიგული, რომელიც არ ჭკნება",
    description: "ნაქსოვი თაიგულები, რომლებიც არ ჭკნება და დიდხანს ინახება.",
    en: { name: "Bouquets that never wilt", description: "Crocheted bouquets that never wilt and keep for years." },
  },
];

// ჩანს თუ არა თაგი ახლა: hidden არ არის და სეზონშია (თუ სეზონი აქვს)
export function isTagVisible(tag: Tag, now: number = Date.now()): boolean {
  if (tag.hidden) return false;
  if (!tag.season) return true;
  // თარიღი UTC-ის შუაღამეა, საქართველო კი UTC+4-ია: დასაწყისს 1 დღით ადრე ვუშვებთ, რომ ღამით „ჯერ არ დაწყებულად“ არ ჩანდეს, ბოლოს კი ბოლო დღეს ვრთავთ
  const DAY = 24 * 60 * 60 * 1000;
  return now > Date.parse(tag.season.from) - DAY && now < Date.parse(tag.season.to) + DAY;
}

// გახსნის დრო მილიწამებში (თბილისი, UTC+4), თუ თაგი ჯერ დაბლოკილია; სხვა შემთხვევაში undefined
export function lockedUntil(tag: Tag, now: number = Date.now()): number | undefined {
  if (!tag.opensAt) return undefined;
  const at = Date.parse(`${tag.opensAt}T00:00:00+04:00`);
  return now < at ? at : undefined;
}

export function getTagBySlug(slug: string) {
  return tags.find((tag) => tag.slug === slug && isTagVisible(tag) && lockedUntil(tag) === undefined);
}

export function localizeTag(tag: Tag, lang: Lang) {
  const base = lang === "ka"
    ? { slug: tag.slug, emoji: tag.emoji, collage: tag.collage, name: tag.name, description: tag.description }
    : { slug: tag.slug, emoji: tag.emoji, collage: tag.collage, ...tag.en };
  return { ...base, opensAtMs: lockedUntil(tag) };
}

// ამ თაგის ნამუშევრები
export function worksForTag(tag: Tag, lang: Lang): WorkEntry[] {
  return getWorkEntries(lang).filter(({ artist, work }) => {
    if (work.tags?.includes(tag.slug)) return true;
    if (tag.sale) return Boolean(pricing(artist, work)?.percent);
    // ფასის თაგი: ფასდაკლებული ფასით
    const price = effectivePrice(artist, work);
    return tag.maxPrice !== undefined && price !== undefined && price <= tag.maxPrice;
  });
}

// მხოლოდ ის თაგები, რომლებსაც ნამუშევარი აქვს (ცარიელი თაგი არ ჩანს)
export function activeTags(lang: Lang) {
  return tags.filter((tag) => isTagVisible(tag) && worksForTag(tag, "ka").length > 0).map((tag) => localizeTag(tag, lang));
}
