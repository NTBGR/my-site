import type { Lang } from "@/lib/dictionary";

export type ArtistWork = {
  title: string;
  color: string;
};

type ArtistText = {
  name: string;
  city: string;
  category: string;
  bio: string;
  workTitles: string[];
};

export type Artist = {
  slug: string;
  name: string;
  city: string;
  category: string;
  categories: string[];
  bio: string;
  instagram: string;
  works: ArtistWork[];
  en: ArtistText;
};

export const artists: Artist[] = [
  {
    slug: "elene-nimushi",
    name: "ელენე ნიმუში",
    city: "თბილისი",
    category: "მხატვარი",
    categories: ["nakhatebi"],
    bio: "ფიქტიური პორტრეტისტი, რომელიც თბილისის უბნებს თბილი ფერებით ხატავს. ეს პროფილი სატესტო მონაცემია და რეალურ ადამიანს არ ეკუთვნის.",
    instagram: "",
    works: [
      { title: "დილა სოლოლაკში", color: "#c45c3e" },
      { title: "ყვითელი აივანი", color: "#e0a45a" },
      { title: "წვიმიანი ქუჩა", color: "#6b7c6a" },
    ],
    en: {
      name: "Elene Nimushi",
      city: "Tbilisi",
      category: "Painter",
      bio: "A fictional portrait painter who paints Tbilisi's neighbourhoods in warm colours. This profile is test data and does not belong to a real person.",
      workTitles: ["Morning in Sololaki", "Yellow Balcony", "Rainy Street"],
    },
  },
  {
    slug: "giorgi-magaliti",
    name: "გიორგი მაგალითი",
    city: "ბათუმი",
    category: "ფოტოგრაფი",
    categories: ["nakhatebi"],
    bio: "სატესტო ფოტოგრაფი, რომელიც ზღვისპირა სინათლეს იღებს. სახელი და ბიოგრაფია სპეციალურად გამოგონილია.",
    instagram: "",
    works: [
      { title: "შავი ზღვის ჰორიზონტი", color: "#3d5a73" },
      { title: "პალმის ჩრდილი", color: "#8a9a6b" },
      { title: "საღამოს ტალღა", color: "#b07a4a" },
    ],
    en: {
      name: "Giorgi Magaliti",
      city: "Batumi",
      category: "Photographer",
      bio: "A test photographer who captures seaside light. The name and bio are invented on purpose.",
      workTitles: ["Black Sea Horizon", "Palm Shadow", "Evening Wave"],
    },
  },
  {
    slug: "mariam-savardebeli",
    name: "მარიამ სავარდებელი",
    city: "ქუთაისი",
    category: "კერამიკოსი",
    categories: ["keramika", "saxlis-dekori"],
    bio: "გამოგონილი კერამიკოსი, რომელიც თიხასთან მუშაობს. ყველა დეტალი მხოლოდ დემონსტრაციისთვისაა.",
    instagram: "",
    works: [
      { title: "თიხის თასი", color: "#a65d3f" },
      { title: "მწვანე ლანგარი", color: "#5e7a55" },
      { title: "ღია ფერის ვაზა", color: "#d4b48a" },
    ],
    en: {
      name: "Mariam Savardebeli",
      city: "Kutaisi",
      category: "Ceramicist",
      bio: "A made-up ceramicist who works with clay. Every detail is for demonstration only.",
      workTitles: ["Clay Bowl", "Green Platter", "Light Vase"],
    },
  },
  {
    slug: "leka-placeholderi",
    name: "ლეკა ფლეისჰოლდერი",
    city: "თელავი",
    category: "ილუსტრატორი",
    categories: ["nakhatebi", "sachuqrebi"],
    bio: "ფიქტიური ილუსტრატორი კახეთიდან. ეს ჩანაწერი რეალურ შემოქმედს არ ასახავს.",
    instagram: "",
    works: [
      { title: "ვენახის ესკიზი", color: "#7a4e6a" },
      { title: "მთის ხაზი", color: "#4f6d5a" },
      { title: "საღამოს ცა", color: "#c4785b" },
    ],
    en: {
      name: "Leka Placeholderi",
      city: "Telavi",
      category: "Illustrator",
      bio: "A fictional illustrator from Kakheti. This entry does not reflect a real maker.",
      workTitles: ["Vineyard Sketch", "Mountain Line", "Evening Sky"],
    },
  },
  {
    slug: "nino-demoeli",
    name: "ნინო დემოელი",
    city: "თბილისი",
    category: "მოქანდაკე",
    categories: ["skulptura", "khis-nakethobebi"],
    bio: "სატესტო მოქანდაკე, რომელიც ქვისა და ხის ფორმებს იკვლევს. პროფილი გამოგონილია.",
    instagram: "",
    works: [
      { title: "ქვის სილუეტი", color: "#8b8174" },
      { title: "ხის ფიგურა", color: "#9c6b45" },
      { title: "ბრინჯაოს ესკიზი", color: "#6a5a48" },
    ],
    en: {
      name: "Nino Demoeli",
      city: "Tbilisi",
      category: "Sculptor",
      bio: "A test sculptor who explores forms in stone and wood. The profile is invented.",
      workTitles: ["Stone Silhouette", "Wooden Figure", "Bronze Study"],
    },
  },
  {
    slug: "dato-testadze",
    name: "დათო ტესტაძე",
    city: "ბათუმი",
    category: "მხატვარი",
    categories: ["nakhatebi", "saxlis-dekori"],
    bio: "ფიქტიური მხატვარი, რომელიც ფერად აბსტრაქციას ხატავს. ინსტაგრამის ბმული განზრახ ცარიელია.",
    instagram: "",
    works: [
      { title: "წითელი კომპოზიცია", color: "#b44532" },
      { title: "ლურჯი ველი", color: "#4a6d8c" },
      { title: "ოქროსფერი შუქი", color: "#d4a017" },
    ],
    en: {
      name: "Dato Testadze",
      city: "Batumi",
      category: "Painter",
      bio: "A fictional painter of colourful abstraction. The Instagram link is intentionally empty.",
      workTitles: ["Red Composition", "Blue Field", "Golden Light"],
    },
  },
];

export function localizeArtist(artist: Artist, lang: Lang): Artist {
  if (lang === "ka") return artist;
  const { en } = artist;
  return {
    ...artist,
    name: en.name,
    city: en.city,
    category: en.category,
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

export function getArtistBySlug(slug: string): Artist | undefined {
  return artists.find((artist) => artist.slug === slug);
}

export function getCities(lang: Lang): string[] {
  return Array.from(
    new Set(artists.map((artist) => localizeArtist(artist, lang).city)),
  );
}
