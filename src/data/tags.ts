import { getWorkEntries, type WorkEntry } from "@/data/artists";
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
  en: { name: string; description: string };
};

// თანმიმდევრობა ზოლში ასეთია
export const tags: Tag[] = [
  {
    slug: "for-her",
    emoji: "💐",
    name: "საჩუქარი ქალბატონებისთვის",
    description: "ხელნაკეთი საჩუქრები ქალბატონებისთვის: თაიგულები, სამკაულები და სხვა.",
    en: { name: "Gifts for ladies", description: "Handmade gifts for ladies: bouquets, jewelry and more." },
  },
  {
    slug: "under-100",
    emoji: "🏷️",
    name: "საჩუქარი 100 ₾-მდე",
    description: "ხელნაკეთი ნამუშევრები 100 ლარამდე ფასად.",
    maxPrice: 100,
    en: { name: "Gifts under 100 ₾", description: "Handmade works priced up to 100 GEL." },
  },
  {
    slug: "for-mom",
    emoji: "🌸",
    name: "საჩუქარი დედას",
    description: "ხელნაკეთი საჩუქრები დედისთვის.",
    en: { name: "Gifts for mom", description: "Handmade gifts for mom." },
  },
  {
    slug: "never-wilts",
    emoji: "🌷",
    name: "თაიგული, რომელიც არ ჭკნება",
    description: "ნაქსოვი თაიგულები, რომლებიც არ ჭკნება და დიდხანს ინახება.",
    en: { name: "Bouquets that never wilt", description: "Crocheted bouquets that never wilt and keep for years." },
  },
  {
    slug: "for-fans",
    emoji: "⚽",
    name: "საჩუქარი გულშემატკივარს",
    description: "პოსტერები და სხვა საჩუქრები სპორტის გულშემატკივრისთვის.",
    en: { name: "Gifts for fans", description: "Posters and other gifts for sports fans." },
  },
];

export function getTagBySlug(slug: string) {
  return tags.find((tag) => tag.slug === slug);
}

export function localizeTag(tag: Tag, lang: Lang) {
  return lang === "ka"
    ? { slug: tag.slug, emoji: tag.emoji, name: tag.name, description: tag.description }
    : { slug: tag.slug, emoji: tag.emoji, ...tag.en };
}

// ამ თაგის ნამუშევრები
export function worksForTag(tag: Tag, lang: Lang): WorkEntry[] {
  return getWorkEntries(lang).filter(({ work }) => {
    if (work.tags?.includes(tag.slug)) return true;
    return tag.maxPrice !== undefined && work.price !== undefined && work.price <= tag.maxPrice;
  });
}

// მხოლოდ ის თაგები, რომლებსაც ნამუშევარი აქვს (ცარიელი თაგი არ ჩანს)
export function activeTags(lang: Lang) {
  return tags.filter((tag) => worksForTag(tag, "ka").length > 0).map((tag) => localizeTag(tag, lang));
}
