import type { Lang } from "@/lib/dictionary";

export type Category = {
  slug: string;
  name: string;
  description: string;
  // ხელოვანის პროფესია ამ კატეგორიაში (ბარათზე და ფილტრში ავტომატურად ჩანს)
  maker: string;
  en: { name: string; description: string; maker: string };
};

export const categories: Category[] = [
  {
    slug: "nakhatebi",
    name: "ნახატები",
    description: "ტილო, აკვარელი და გრაფიკა ორიგინალ ნამუშევრებად.",
    maker: "მხატვარი",
    en: {
      name: "Paintings",
      description: "Canvas, watercolour and graphic works as originals.",
      maker: "Painter",
    },
  },
  {
    slug: "posterebi",
    name: "პოსტერები",
    description: "ავტორების ორიგინალი ილუსტრაციები და გრაფიკა ბეჭდურ პოსტერებად.",
    maker: "გრაფიკოსი",
    en: {
      name: "Posters",
      description: "Makers' original illustrations and graphic art as printed posters.",
      maker: "Graphic artist",
    },
  },
  {
    slug: "keramika",
    name: "კერამიკა და ჭურჭელი",
    description: "ხელნაკეთი თიხის თასები, ლანგრები და ვაზები.",
    maker: "კერამიკოსი",
    en: {
      name: "Ceramics & tableware",
      description: "Handmade clay bowls, platters and vases.",
      maker: "Ceramicist",
    },
  },
  {
    slug: "skulptura",
    name: "სკულპტურა და ფიგურები",
    description: "ქვის, ხისა და ლითონის ფიგურები და კომპოზიციები.",
    maker: "მოქანდაკე",
    en: {
      name: "Sculpture & figurines",
      description: "Figures and compositions in stone, wood and metal.",
      maker: "Sculptor",
    },
  },
  {
    slug: "samkauli",
    name: "სამკაული",
    description: "ბეჭდები, საყურეები და ყელსაბამები ვერცხლში, ოქროსა და ქვებით, ხელით დამუშავებული.",
    maker: "იუველირი",
    en: {
      name: "Jewelry",
      description: "Rings, earrings and necklaces in silver, gold and gemstones, made by hand.",
      maker: "Jeweler",
    },
  },
  {
    slug: "tekstili",
    name: "ტექსტილი",
    description: "შარფები, ხალიჩები, ნაქარგი და ქსოვილზე დაბეჭდილი ნივთები.",
    maker: "ტექსტილის ოსტატი",
    en: {
      name: "Textiles",
      description: "Scarves, rugs, embroidery and printed fabric goods.",
      maker: "Textile maker",
    },
  },
  {
    slug: "tyavi",
    name: "ტყავის ნაწარმი",
    description: "ხელნაკეთი ჩანთები, საფულეები და აქსესუარები.",
    maker: "ტყავის ოსტატი",
    en: {
      name: "Leather goods",
      description: "Handmade bags, wallets and accessories.",
      maker: "Leatherworker",
    },
  },
  {
    slug: "khis-nakethobebi",
    name: "ხის ნაკეთობები",
    description: "კოვზები, დაფები, ყუთები და სხვა ხის ნივთები.",
    maker: "ხის ოსტატი",
    en: {
      name: "Woodwork",
      description: "Spoons, boards, boxes and other wooden items.",
      maker: "Woodworker",
    },
  },
  {
    slug: "saxlis-dekori",
    name: "სახლის დეკორი",
    description: "სანთლები, ვაზები, ჩარჩოები და სხვა ინტერიერის ნივთები.",
    maker: "დეკორის ოსტატი",
    en: {
      name: "Home decor",
      description: "Candles, vases, frames and other interior pieces.",
      maker: "Decor maker",
    },
  },
  {
    slug: "sachuqrebi",
    name: "საჩუქრები და ბარათები",
    description: "ხელნაკეთი ბარათები და პატარა საჩუქრები.",
    maker: "ილუსტრატორი",
    en: {
      name: "Gifts & cards",
      description: "Handmade cards and small gifts.",
      maker: "Illustrator",
    },
  },
];

// კატეგორიის ფერი (ილუსტრაციებისთვის და ბანერებისთვის), მიბმულია სახელზე
const palette: Record<string, string> = {
  nakhatebi: "#c4553a",
  posterebi: "#2f6b6f",
  bechdebi: "#3d5a73",
  keramika: "#5e7a55",
  skulptura: "#7a4e6a",
  samkauli: "#b07a4a",
  tekstili: "#4a6d8c",
  tyavi: "#a65d3f",
  "khis-nakethobebi": "#6b7c6a",
  "saxlis-dekori": "#8a6a9c",
  sachuqrebi: "#b44532",
};

export function categoryColor(slug: string) {
  return palette[slug] ?? palette.nakhatebi;
}

export function localizeCategory(category: Category, lang: Lang): Category {
  return lang === "ka" ? category : { ...category, ...category.en };
}

// ხელოვანის პროფესია მისი მთავარი კატეგორიის მიხედვით
export function makerOf(slug: string | undefined, lang: Lang) {
  const category = categories.find((c) => c.slug === slug) ?? categories[0];
  return lang === "ka" ? category.maker : category.en.maker;
}

export function getCategoryBySlug(slug: string) {
  return categories.find((category) => category.slug === slug);
}
