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
  // თუ true, თაგში ხვდება ყველა ნამუშევარი, რომელსაც ახლა ფასდაკლება აქვს
  sale?: boolean;
  // დროებით დამალული თაგი: არ ჩანს ზოლში, გვერდიც არ იხსნება და sitemap-შიც არ არის (წაშლა არ სჭირდება, უბრალოდ ამოიღე hidden)
  hidden?: boolean;
  // ბანერის კოლაჟი: სამი კატეგორიის სურათი
  collage: [string, string, string];
  en: { name: string; description: string };
};

// თანმიმდევრობა ზოლში ასეთია
export const tags: Tag[] = [
  {
    slug: "sale",
    collage: ["posterebi", "sachuqrebi", "keramika"],
    emoji: "🔥",
    name: "ფასდაკლებები",
    description: "ხელნაკეთი ნამუშევრები ფასდაკლებით.",
    sale: true,
    en: { name: "Sale", description: "Handmade works at a discount." },
  },
  {
    slug: "for-kids",
    collage: ["sachuqrebi", "tekstili", "saxlis-dekori"],
    emoji: "🧸",
    name: "საჩუქარი ბავშვისთვის",
    description: "ხელნაკეთი საჩუქრები ბავშვებისთვის.",
    en: { name: "Gifts for kids", description: "Handmade gifts for kids." },
  },
  {
    slug: "under-100",
    collage: ["sachuqrebi", "keramika", "tekstili"],
    emoji: "🏷️",
    name: "საჩუქარი 100 ₾-მდე",
    description: "ხელნაკეთი ნამუშევრები 100 ლარამდე ფასად.",
    maxPrice: 100,
    en: { name: "Gifts under 100 ₾", description: "Handmade works priced up to 100 GEL." },
  },
  {
    slug: "for-her",
    collage: ["samkauli", "tekstili", "sachuqrebi"],
    emoji: "💐",
    name: "საჩუქარი ქალბატონებისთვის",
    description: "ხელნაკეთი საჩუქრები ქალბატონებისთვის: თაიგულები, სამკაულები და სხვა.",
    en: { name: "Gifts for ladies", description: "Handmade gifts for ladies: bouquets, jewelry and more." },
  },
  {
    slug: "for-him",
    collage: ["tyavi", "posterebi", "khis-nakethobebi"],
    emoji: "🎁",
    name: "საჩუქარი მამაკაცებისთვის",
    description: "ხელნაკეთი საჩუქრები მამაკაცებისთვის: პოსტერები და სხვა.",
    en: { name: "Gifts for men", description: "Handmade gifts for men: posters and more." },
  },
  {
    slug: "for-fans",
    collage: ["posterebi", "nakhatebi", "sachuqrebi"],
    emoji: "⚽",
    name: "საჩუქარი გულშემატკივარს",
    description: "პოსტერები და სხვა საჩუქრები სპორტის გულშემატკივრისთვის.",
    en: { name: "Gifts for fans", description: "Posters and other gifts for sports fans." },
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

export function getTagBySlug(slug: string) {
  return tags.find((tag) => tag.slug === slug && !tag.hidden);
}

export function localizeTag(tag: Tag, lang: Lang) {
  return lang === "ka"
    ? { slug: tag.slug, emoji: tag.emoji, collage: tag.collage, name: tag.name, description: tag.description }
    : { slug: tag.slug, emoji: tag.emoji, collage: tag.collage, ...tag.en };
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
  return tags.filter((tag) => !tag.hidden && worksForTag(tag, "ka").length > 0).map((tag) => localizeTag(tag, lang));
}
