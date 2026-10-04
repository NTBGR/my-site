import { makerOf } from "@/data/categories";
import type { Lang } from "@/lib/dictionary";

export type ArtistWork = {
  title: string;
  color: string;
  // ნამუშევრის ბმული (პოსტი ინსტაგრამზე, ფეისბუქზე და ა.შ.); თუ არ არის, ავტორის ინსტაგრამი/ფეისბუქი გამოიყენება
  url?: string;
  // ნამდვილი ფოტო: ფაილი public/artists/<slug>/..., მისი ზომები პიქსელებში (პროპორციისთვის).
  // ბარათები ყოველთვის 9:16-ია (სთორისის ფორმატი); სრულეკრანიან ნახვაში ფოტო მთლიანად ჩანს.
  image?: string;
  width?: number;
  height?: number;
};

type ArtistText = {
  name: string;
  city: string;
  bio: string;
  workTitles: string[];
};

// მონაცემები, როგორც ფაილში წერია. პირველი კატეგორია ხელოვანის მთავარია:
// მისგან ავტომატურად ამოდის პროფესია (მაგ. keramika → „კერამიკოსი“)
export type ArtistData = {
  slug: string;
  name: string;
  city: string;
  categories: string[];
  bio: string;
  instagram: string;
  facebook: string;
  works: ArtistWork[];
  en: ArtistText;
};

// საიტზე გამოსაყენებელი ხელოვანი: + პროფესია (category) მიმდინარე ენაზე
export type Artist = ArtistData & { category: string };

export const artists: ArtistData[] = [
  {
    slug: "elene-nimushi",
    name: "ელენე ნიმუში",
    city: "თბილისი",
    categories: ["nakhatebi"],
    bio: "ფიქტიური პორტრეტისტი, რომელიც თბილისის უბნებს თბილი ფერებით ხატავს. ეს პროფილი სატესტო მონაცემია და რეალურ ადამიანს არ ეკუთვნის.",
    // დემო ბმულები: ჩაანაცვლე ავტორის რეალური პროფილებით
    instagram: "https://www.instagram.com/",
    facebook: "https://www.facebook.com/",
    works: [
      { title: "დილა სოლოლაკში", color: "#c45c3e", width: 1080, height: 1920 },
      { title: "ყვითელი აივანი", color: "#e0a45a", width: 1080, height: 1920 },
      { title: "წვიმიანი ქუჩა", color: "#6b7c6a", width: 1080, height: 1920 },
    ],
    en: {
      name: "Elene Nimushi",
      city: "Tbilisi",
      bio: "A fictional portrait painter who paints Tbilisi's neighbourhoods in warm colours. This profile is test data and does not belong to a real person.",
      workTitles: ["Morning in Sololaki", "Yellow Balcony", "Rainy Street"],
    },
  },
  {
    slug: "giorgi-magaliti",
    name: "გიორგი მაგალითი",
    city: "ბათუმი",
    categories: ["nakhatebi"],
    bio: "სატესტო ფოტოგრაფი, რომელიც ზღვისპირა სინათლეს იღებს. სახელი და ბიოგრაფია სპეციალურად გამოგონილია.",
    // დემო ბმულები: ჩაანაცვლე ავტორის რეალური პროფილებით
    instagram: "https://www.instagram.com/",
    facebook: "https://www.facebook.com/",
    works: [
      { title: "შავი ზღვის ჰორიზონტი", color: "#3d5a73", width: 1080, height: 1920 },
      { title: "პალმის ჩრდილი", color: "#8a9a6b", width: 1080, height: 1920 },
      { title: "საღამოს ტალღა", color: "#b07a4a", width: 1080, height: 1920 },
    ],
    en: {
      name: "Giorgi Magaliti",
      city: "Batumi",
      bio: "A test photographer who captures seaside light. The name and bio are invented on purpose.",
      workTitles: ["Black Sea Horizon", "Palm Shadow", "Evening Wave"],
    },
  },
  {
    slug: "mariam-savardebeli",
    name: "მარიამ სავარდებელი",
    city: "ქუთაისი",
    categories: ["keramika", "saxlis-dekori"],
    bio: "გამოგონილი კერამიკოსი, რომელიც თიხასთან მუშაობს. ყველა დეტალი მხოლოდ დემონსტრაციისთვისაა.",
    // დემო ბმულები: ჩაანაცვლე ავტორის რეალური პროფილებით
    instagram: "https://www.instagram.com/",
    facebook: "https://www.facebook.com/",
    works: [
      { title: "თიხის თასი", color: "#a65d3f", width: 1080, height: 1920 },
      { title: "მწვანე ლანგარი", color: "#5e7a55", width: 1080, height: 1920 },
      { title: "ღია ფერის ვაზა", color: "#d4b48a", width: 1080, height: 1920 },
    ],
    en: {
      name: "Mariam Savardebeli",
      city: "Kutaisi",
      bio: "A made-up ceramicist who works with clay. Every detail is for demonstration only.",
      workTitles: ["Clay Bowl", "Green Platter", "Light Vase"],
    },
  },
  {
    slug: "leka-placeholderi",
    name: "ლეკა ფლეისჰოლდერი",
    city: "თელავი",
    categories: ["nakhatebi", "sachuqrebi"],
    bio: "ფიქტიური ილუსტრატორი კახეთიდან. ეს ჩანაწერი რეალურ შემოქმედს არ ასახავს.",
    // დემო ბმულები: ჩაანაცვლე ავტორის რეალური პროფილებით
    instagram: "https://www.instagram.com/",
    facebook: "https://www.facebook.com/",
    works: [
      { title: "ვენახის ესკიზი", color: "#7a4e6a", width: 1080, height: 1920 },
      { title: "მთის ხაზი", color: "#4f6d5a", width: 1080, height: 1920 },
      { title: "საღამოს ცა", color: "#c4785b", width: 1080, height: 1920 },
    ],
    en: {
      name: "Leka Placeholderi",
      city: "Telavi",
      bio: "A fictional illustrator from Kakheti. This entry does not reflect a real maker.",
      workTitles: ["Vineyard Sketch", "Mountain Line", "Evening Sky"],
    },
  },
  {
    slug: "nino-demoeli",
    name: "ნინო დემოელი",
    city: "თბილისი",
    categories: ["skulptura", "khis-nakethobebi"],
    bio: "სატესტო მოქანდაკე, რომელიც ქვისა და ხის ფორმებს იკვლევს. პროფილი გამოგონილია.",
    // დემო ბმულები: ჩაანაცვლე ავტორის რეალური პროფილებით
    instagram: "https://www.instagram.com/",
    facebook: "https://www.facebook.com/",
    works: [
      { title: "ქვის სილუეტი", color: "#8b8174", width: 1080, height: 1920 },
      { title: "ხის ფიგურა", color: "#9c6b45", width: 1080, height: 1920 },
      { title: "ბრინჯაოს ესკიზი", color: "#6a5a48", width: 1080, height: 1920 },
    ],
    en: {
      name: "Nino Demoeli",
      city: "Tbilisi",
      bio: "A test sculptor who explores forms in stone and wood. The profile is invented.",
      workTitles: ["Stone Silhouette", "Wooden Figure", "Bronze Study"],
    },
  },
  {
    slug: "dato-testadze",
    name: "დათო ტესტაძე",
    city: "ბათუმი",
    categories: ["nakhatebi", "saxlis-dekori"],
    bio: "ფიქტიური მხატვარი, რომელიც ფერად აბსტრაქციას ხატავს. ინსტაგრამის ბმული განზრახ ცარიელია.",
    // დემო ბმულები: ჩაანაცვლე ავტორის რეალური პროფილებით
    instagram: "https://www.instagram.com/",
    facebook: "https://www.facebook.com/",
    works: [
      { title: "წითელი კომპოზიცია", color: "#b44532", width: 1080, height: 1920 },
      { title: "ლურჯი ველი", color: "#4a6d8c", width: 1080, height: 1920 },
      { title: "ოქროსფერი შუქი", color: "#d4a017", width: 1080, height: 1920 },
    ],
    en: {
      name: "Dato Testadze",
      city: "Batumi",
      bio: "A fictional painter of colourful abstraction. The Instagram link is intentionally empty.",
      workTitles: ["Red Composition", "Blue Field", "Golden Light"],
    },
  },
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
    works: artist.works.map((work, i) => ({
      ...work,
      title: en.workTitles[i] ?? work.title,
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
