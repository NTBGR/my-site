export type ArtistWork = {
  title: string;
  color: string;
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
  },
];

export function getArtistBySlug(slug: string): Artist | undefined {
  return artists.find((artist) => artist.slug === slug);
}

export function getCities(): string[] {
  return Array.from(new Set(artists.map((artist) => artist.city)));
}
