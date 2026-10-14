import type { WorkEntry } from "@/data/artists";

// ბარათისთვის საჭირო მინიმალური მონაცემი (კლიენტის გვერდებზე ზედმეტი ტექსტი არ გადავიდეს)
export type WorkCardData = {
  key: string; // "ავტორი/ნამუშევარი": შენახვისთვის
  href: string;
  title: string;
  artistName: string;
  artistSlug: string;
  city: string;
  categories: string[];
  image?: string;
  image2?: string;
  color: string;
  price?: number;
  madeToOrder?: boolean;
  unique?: boolean;
  isNew?: boolean;
  order: number; // ახალი ნამუშევრები ზემოთ: დიდი რიცხვი = უფრო ახალი
};

export function toWorkCard(entry: WorkEntry, order = 0): WorkCardData {
  const { artist, work, id } = entry;
  return {
    key: `${artist.slug}/${id}`,
    href: `/works/${artist.slug}/${id}`,
    title: work.title,
    artistName: artist.name,
    artistSlug: artist.slug,
    city: artist.city,
    categories: artist.categories,
    image: work.image,
    image2: work.images?.[0],
    color: work.color,
    price: work.price,
    madeToOrder: work.madeToOrder,
    unique: work.unique,
    isNew: work.isNew,
    order,
  };
}

// ყველა ნამუშევარი ბარათებად; რიგით ბოლო ნამუშევარი = ყველაზე ახალი
export function toWorkCards(entries: WorkEntry[]): WorkCardData[] {
  return entries.map((entry, i) => toWorkCard(entry, i));
}
