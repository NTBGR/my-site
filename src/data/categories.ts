import type { Lang } from "@/lib/dictionary";

export type Category = {
  slug: string;
  name: string;
  description: string;
  // ხელოვანის პროფესია ამ კატეგორიაში (ბარათზე და ფილტრში ავტომატურად ჩანს)
  maker: string;
  // მრავლობითი (ხელოვანების გვერდის ფილტრისთვის: „კერამიკოსები“)
  makers: string;
  en: { name: string; description: string; maker: string; makers: string };
};

export const categories: Category[] = [
  {
    slug: "nakhatebi",
    name: "ნახატები",
    description: "ტილო, აკვარელი და გრაფიკა ორიგინალ ნამუშევრებად.",
    maker: "მხატვარი",
    makers: "მხატვრები",
    en: {
      name: "Paintings",
      description: "Canvas, watercolour and graphic works as originals.",
      maker: "Painter",
      makers: "Painters",
    },
  },
  {
    slug: "posterebi",
    name: "პოსტერები",
    description: "ავტორების ორიგინალი ილუსტრაციები და გრაფიკა ბეჭდურ პოსტერებად.",
    maker: "გრაფიკოსი",
    makers: "გრაფიკოსები",
    en: {
      name: "Posters",
      description: "Makers' original illustrations and graphic art as printed posters.",
      maker: "Graphic artist",
      makers: "Graphic artists",
    },
  },
  {
    slug: "keramika",
    name: "კერამიკა და ჭურჭელი",
    description: "ხელნაკეთი თიხის თასები, ლანგრები და ვაზები.",
    maker: "კერამიკოსი",
    makers: "კერამიკოსები",
    en: {
      name: "Ceramics & tableware",
      description: "Handmade clay bowls, platters and vases.",
      maker: "Ceramicist",
      makers: "Ceramicists",
    },
  },
  {
    slug: "skulptura",
    name: "სკულპტურა და ფიგურები",
    description: "ქვის, ხისა და ლითონის ფიგურები და კომპოზიციები.",
    maker: "მოქანდაკე",
    makers: "მოქანდაკეები",
    en: {
      name: "Sculpture & figurines",
      description: "Figures and compositions in stone, wood and metal.",
      maker: "Sculptor",
      makers: "Sculptors",
    },
  },
  {
    slug: "samkauli",
    name: "სამკაული",
    description: "ბეჭდები, საყურეები და ყელსაბამები ვერცხლში, ოქროსა და ქვებით, ხელით დამუშავებული.",
    maker: "იუველირი",
    makers: "იუველირები",
    en: {
      name: "Jewelry",
      description: "Rings, earrings and necklaces in silver, gold and gemstones, made by hand.",
      maker: "Jeweler",
      makers: "Jewelers",
    },
  },
  {
    slug: "tekstili",
    name: "ტექსტილი",
    description: "შარფები, ხალიჩები, ნაქარგი და ქსოვილზე დაბეჭდილი ნივთები.",
    maker: "ტექსტილის ოსტატი",
    makers: "ტექსტილის ოსტატები",
    en: {
      name: "Textiles",
      description: "Scarves, rugs, embroidery and printed fabric goods.",
      maker: "Textile maker",
      makers: "Textile makers",
    },
  },
  {
    slug: "tyavi",
    name: "ტყავის ნაწარმი",
    description: "ხელნაკეთი ჩანთები, საფულეები და აქსესუარები.",
    maker: "ტყავის ოსტატი",
    makers: "ტყავის ოსტატები",
    en: {
      name: "Leather goods",
      description: "Handmade bags, wallets and accessories.",
      maker: "Leatherworker",
      makers: "Leatherworkers",
    },
  },
  {
    slug: "khis-nakethobebi",
    name: "ხის ნაკეთობები",
    description: "კოვზები, დაფები, ყუთები და სხვა ხის ნივთები.",
    maker: "ხის ოსტატი",
    makers: "ხის ოსტატები",
    en: {
      name: "Woodwork",
      description: "Spoons, boards, boxes and other wooden items.",
      maker: "Woodworker",
      makers: "Woodworkers",
    },
  },
  {
    slug: "saxlis-dekori",
    name: "სახლის დეკორი",
    description: "სანთლები, ვაზები, ჩარჩოები და სხვა ინტერიერის ნივთები.",
    maker: "დეკორის ოსტატი",
    makers: "დეკორის ოსტატები",
    en: {
      name: "Home decor",
      description: "Candles, vases, frames and other interior pieces.",
      maker: "Decor maker",
      makers: "Decor makers",
    },
  },
  {
    slug: "sachuqrebi",
    name: "საჩუქრები და ბარათები",
    description: "ხელნაკეთი ბარათები და პატარა საჩუქრები.",
    maker: "ილუსტრატორი",
    makers: "ილუსტრატორები",
    en: {
      name: "Gifts & cards",
      description: "Handmade cards and small gifts.",
      maker: "Illustrator",
      makers: "Illustrators",
    },
  },
];

// კატეგორიის ფერი (ბანერებისთვის), მიბმულია სახელზე. ფოტოები თბილი ბეჟისფერია, ამიტომ ფერებიც ერთ თბილ, მიჩუმებულ
// მიწისფერ ოჯახშია (ტაუპი, თიხა, ხე, ტყავი): ბანერი და ფოტო ერთმანეთს ეხამება, ტექსტი თეთრად კარგად იკითხება.
const palette: Record<string, string> = {
  nakhatebi: "#7d6a55",
  posterebi: "#6f6a5c",
  bechdebi: "#85705a",
  keramika: "#7a6e5a",
  skulptura: "#756c60",
  samkauli: "#85705a",
  tekstili: "#7c705f",
  tyavi: "#82614a",
  "khis-nakethobebi": "#7b6247",
  "saxlis-dekori": "#6e5f4c",
  sachuqrebi: "#8a7058",
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
