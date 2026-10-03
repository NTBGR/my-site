import type { Lang } from "@/lib/dictionary";

export type Category = {
  slug: string;
  name: string;
  description: string;
  en: { name: string; description: string };
};

export const categories: Category[] = [
  {
    slug: "nakhatebi",
    name: "ნახატები",
    description: "ტილო, აკვარელი და გრაფიკა ორიგინალ ნამუშევრებად.",
    en: {
      name: "Paintings",
      description: "Canvas, watercolour and graphic works as originals.",
    },
  },
  {
    slug: "bechdebi",
    name: "ბეჭდები",
    description: "ხელნაკეთი ბეჭდები ვერცხლში, ოქროსა და ქვებით.",
    en: {
      name: "Rings",
      description: "Handmade rings in silver, gold and gemstones.",
    },
  },
  {
    slug: "keramika",
    name: "კერამიკა და ჭურჭელი",
    description: "ხელნაკეთი თიხის თასები, ლანგრები და ვაზები.",
    en: {
      name: "Ceramics & tableware",
      description: "Handmade clay bowls, platters and vases.",
    },
  },
  {
    slug: "skulptura",
    name: "სკულპტურა და ფიგურები",
    description: "ქვის, ხისა და ლითონის ფიგურები და კომპოზიციები.",
    en: {
      name: "Sculpture & figurines",
      description: "Figures and compositions in stone, wood and metal.",
    },
  },
  {
    slug: "samkauli",
    name: "სამკაული",
    description: "ხელნაკეთი სამკაული ვერცხლში, ოქროსა და სხვა მასალაში.",
    en: {
      name: "Jewelry",
      description: "Handmade jewelry in silver, gold and other materials.",
    },
  },
  {
    slug: "tekstili",
    name: "ტექსტილი",
    description: "შარფები, ხალიჩები, ნაქარგი და ქსოვილზე დაბეჭდილი ნივთები.",
    en: {
      name: "Textiles",
      description: "Scarves, rugs, embroidery and printed fabric goods.",
    },
  },
  {
    slug: "tyavi",
    name: "ტყავის ნაწარმი",
    description: "ხელნაკეთი ჩანთები, საფულეები და აქსესუარები.",
    en: {
      name: "Leather goods",
      description: "Handmade bags, wallets and accessories.",
    },
  },
  {
    slug: "khis-nakethobebi",
    name: "ხის ნაკეთობები",
    description: "კოვზები, დაფები, ყუთები და სხვა ხის ნივთები.",
    en: {
      name: "Woodwork",
      description: "Spoons, boards, boxes and other wooden items.",
    },
  },
  {
    slug: "saxlis-dekori",
    name: "სახლის დეკორი",
    description: "სანთლები, ვაზები, ჩარჩოები და სხვა ინტერიერის ნივთები.",
    en: {
      name: "Home decor",
      description: "Candles, vases, frames and other interior pieces.",
    },
  },
  {
    slug: "sachuqrebi",
    name: "საჩუქრები და ბარათები",
    description: "ხელნაკეთი ბარათები და პატარა საჩუქრები.",
    en: {
      name: "Gifts & cards",
      description: "Handmade cards and small gifts.",
    },
  },
];

export function localizeCategory(category: Category, lang: Lang): Category {
  return lang === "ka" ? category : { ...category, ...category.en };
}

export function getCategoryBySlug(slug: string) {
  return categories.find((category) => category.slug === slug);
}
