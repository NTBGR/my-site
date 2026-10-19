import { getLocalizedArtists, getWorkEntries } from "@/data/artists";
import { categories, localizeCategory } from "@/data/categories";
import { tags, worksForTag, localizeTag, isTagVisible, lockedUntil } from "@/data/tags";
import type { Lang } from "@/lib/dictionary";
import { scoreText } from "@/lib/searchMatch";

// ძებნის ინდექსი ავტოშეთავაზებისთვის (ჰედერის ძებნა). იქმნება სერვერზე და ბრაუზერში მცირე სიად მიდის (ათეულობით ჩანაწერი).
// text: რითაც ეძებენ: სახელი ორივე ენაზე + სიტყვები (საჩუქრის თაგს „დედისთვის“, „football“...)
export type SearchItem = {
  kind: "gift" | "category" | "artist" | "work";
  label: string;
  sub?: string;
  href: string;
  text: string;
};

export function buildSearchIndex(lang: Lang): SearchItem[] {
  const ka = getLocalizedArtists("ka");
  const en = getLocalizedArtists("en");
  const items: SearchItem[] = [];

  // საჩუქრის თაგები: მხოლოდ ისინი, რომლებშიც ნამუშევარი არის
  for (const tag of tags) {
    if (!isTagVisible(tag) || lockedUntil(tag) !== undefined || worksForTag(tag, "ka").length === 0) continue;
    const local = localizeTag(tag, lang);
    items.push({
      kind: "gift",
      label: `${local.emoji} ${local.name}`,
      sub: local.description,
      href: `/gifts/${tag.slug}`,
      text: [tag.name, tag.en.name, tag.description, ...(tag.keywords ?? [])].join(" "),
    });
  }

  for (const raw of categories) {
    const local = localizeCategory(raw, lang);
    items.push({
      kind: "category",
      label: local.name,
      href: `/categories/${raw.slug}`,
      text: [raw.name, raw.en.name, raw.maker, raw.en.maker].join(" "),
    });
  }

  const localized = getLocalizedArtists(lang);
  localized.forEach((artist, i) => {
    items.push({
      kind: "artist",
      label: artist.name,
      sub: [artist.category, artist.city].filter(Boolean).join(" · "),
      href: `/artists/${artist.slug}`,
      text: [ka[i].name, en[i].name, ka[i].city, en[i].city, artist.category].join(" "),
    });
  });

  // ნამუშევარზე დაჭერა ხსნის ძებნის შედეგს, სადაც ის ფოტოთი ჩანს და იზრდება
  getWorkEntries(lang).forEach(({ artist, work, index }) => {
    const kaTitle = ka.find((a) => a.slug === artist.slug)?.works[index]?.title ?? work.title;
    const enTitle = en.find((a) => a.slug === artist.slug)?.works[index]?.title ?? work.title;
    items.push({
      kind: "work",
      label: work.title,
      sub: artist.name,
      href: `/artists?q=${encodeURIComponent(work.title)}`,
      text: [kaTitle, enTitle, artist.name].join(" "),
    });
  });

  return items;
}

// ავტოშეთავაზება: საჩუქრები, კატეგორიები, ხელოვანები, ნამუშევრები (თითოეული ჯგუფიდან მცირე რაოდენობა), საუკეთესო დამთხვევა ზემოთ
const LIMITS: Record<SearchItem["kind"], number> = { gift: 2, category: 2, artist: 2, work: 4 };
const ORDER: SearchItem["kind"][] = ["gift", "category", "artist", "work"];

export function suggest(items: SearchItem[], query: string, max = 7): SearchItem[] {
  const q = query.trim();
  if (q.length < 2) return [];
  const scored = items
    .map((item) => ({ item, score: scoreText(item.text, q) }))
    .filter((x) => x.score > 0);
  const out: SearchItem[] = [];
  for (const kind of ORDER) {
    const group = scored
      .filter((x) => x.item.kind === kind)
      .sort((a, b) => b.score - a.score)
      .slice(0, LIMITS[kind])
      .map((x) => x.item);
    out.push(...group);
  }
  return out.slice(0, max);
}
