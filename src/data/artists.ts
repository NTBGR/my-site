import { makerOf } from "@/data/categories";
import type { Lang } from "@/lib/dictionary";

export type ArtistWork = {
  title: string;
  color: string;
  // ნამუშევრის ბმული (პოსტი ინსტაგრამზე, ფეისბუქზე და ა.შ.); თუ არ არის, ავტორის ინსტაგრამი/ფეისბუქი გამოიყენება
  url?: string;
  // ნამდვილი ფოტო: ფაილი public/artists/<slug>/..., მისი ზომები პიქსელებში (პროპორციისთვის).
  // ბარათები 3:4-ია (ტელეფონის ვერტიკალური ფოტო); სრულეკრანიან ნახვაში ფოტო მთლიანად ჩანს.
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
  // გარე ფოტო: ხელოვანის ბარათზე სიებში (მაგ. ლოგო). თუ არ არის, პირველი ნამუშევრის ფოტო ან ილუსტრაცია
  cover?: string;
  // ხელოვანის გვერდის ბანერის ფოტო (ბანერის ფერს რომ მოუხდეს). თუ არ არის, ქავერი
  banner?: string;
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
    slug: "zhuzha-ceramics",
    name: "ZHUZHA Ceramics",
    city: "თბილისი",
    categories: ["keramika", "samkauli"],
    cover: "/artists/zhuzha-ceramics/ring-amore.jpg",
    banner: "/artists/zhuzha-ceramics/necklace-green-star.jpg",
    bio: "ZHUZHA Ceramics ხელით ქმნის კერამიკულ აქსესუარებს და ნივთებს: ზღვის ვარსკვლავის ყელსაბამებს ფერადი მძივებით, ბეჭდებს, ბროშებს, ზოდიაქოს გულსაკიდებს და ფინჯნებს.",
    instagram: "https://www.instagram.com/zhuzhaceramics/",
    facebook: "https://www.facebook.com/profile.php?id=61580098836416",
    works: [
      { title: "ყელსაბამი „ცისფერი ვარსკვლავი“", color: "#3f9fd6", image: "/artists/zhuzha-ceramics/necklace-blue-star.jpg", width: 1200, height: 1600 },
      { title: "ყელსაბამი „ყვითელი ვარსკვლავი“", color: "#d4402c", image: "/artists/zhuzha-ceramics/necklace-yellow-star.jpg", width: 1200, height: 1600 },
      { title: "ყელსაბამი „მწვანე ვარსკვლავი“", color: "#3f7a3a", image: "/artists/zhuzha-ceramics/necklace-green-star.jpg", width: 1200, height: 1600 },
      { title: "ყელსაბამი „წითელი ვარსკვლავი“", color: "#e0452d", image: "/artists/zhuzha-ceramics/necklace-red-star.jpg", width: 1200, height: 1600 },
      { title: "ბეჭედი „ტიტა“", color: "#8a6fbf", image: "/artists/zhuzha-ceramics/ring-tulip.jpg", width: 844, height: 1125 },
      { title: "ბეჭედი „AMORE“", color: "#c9a3ad", image: "/artists/zhuzha-ceramics/ring-amore.jpg", width: 844, height: 1125 },
      { title: "ბროში „გული“", color: "#d9573f", image: "/artists/zhuzha-ceramics/brooch-heart.jpg", width: 1125, height: 1500 },
      { title: "ზოდიაქოს გულსაკიდები", color: "#2e2a8a", image: "/artists/zhuzha-ceramics/pendants-zodiac.jpg", width: 1125, height: 1500 },
      { title: "ფინჯანი „სხეული“", color: "#a89f97", image: "/artists/zhuzha-ceramics/mug-body.jpg", width: 1125, height: 1500 },
    ],
    en: {
      name: "ZHUZHA Ceramics",
      city: "Tbilisi",
      bio: "ZHUZHA Ceramics makes ceramic accessories and objects by hand: starfish necklaces with colourful beads, rings, brooches, zodiac pendants and mugs.",
      workTitles: [
        "Necklace \"Blue Star\"",
        "Necklace \"Yellow Star\"",
        "Necklace \"Green Star\"",
        "Necklace \"Red Star\"",
        "Ring \"Tulip\"",
        "Ring \"AMORE\"",
        "Brooch \"Heart\"",
        "Zodiac pendants",
        "Mug \"Body\"",
      ],
    },
  },
  {
    slug: "tbgr-poster-lab",
    name: "TBGR Poster Lab",
    // ქალაქი ჯერ უცნობია: ცარიელზე საიტი უბრალოდ არ აჩვენებს
    city: "",
    categories: ["posterebi"],
    cover: "/artists/tbgr-poster-lab/kvara.jpg",
    banner: "/artists/tbgr-poster-lab/kvara.jpg",
    bio: "TBGR Poster Lab ქმნის მინიმალისტური სტილის პოსტერებს სპორტის ლეგენდებსა და ფეხბურთის კლუბებზე: გმირის ფერები, ციტატა, მოკლე ისტორია და მთავარი მიღწევები ერთ კომპოზიციაში.",
    instagram: "https://www.instagram.com/tbgrposterlab/",
    facebook: "https://www.facebook.com/profile.php?id=61586527464734",
    works: [
      { title: "პოსტერი „კვარა“", color: "#1c1c22", image: "/artists/tbgr-poster-lab/kvara.jpg", width: 1440, height: 1440 },
      { title: "პოსტერი „მესი“", color: "#4a8fc4", image: "/artists/tbgr-poster-lab/messi.jpg", width: 1440, height: 1440 },
      { title: "პოსტერი „რონალდო“", color: "#c4302b", image: "/artists/tbgr-poster-lab/ronaldo.jpg", width: 1440, height: 1440 },
      { title: "პოსტერი „იამალი“", color: "#2f4f9e", image: "/artists/tbgr-poster-lab/yamal.jpg", width: 1440, height: 1440 },
      { title: "პოსტერი „ალი“", color: "#c2242e", image: "/artists/tbgr-poster-lab/ali.jpg", width: 1440, height: 1440 },
      { title: "პოსტერი „რეალ მადრიდი“", color: "#1d4f9c", image: "/artists/tbgr-poster-lab/real-madrid.jpg", width: 1440, height: 1440 },
      { title: "პოსტერი „ბარსელონა“", color: "#a3123f", image: "/artists/tbgr-poster-lab/barcelona.jpg", width: 1440, height: 1440 },
      { title: "პოსტერი „ლივერპული“", color: "#8a1c1c", image: "/artists/tbgr-poster-lab/liverpool.jpg", width: 1440, height: 1440 },
      { title: "პოსტერი „მანჩესტერ იუნაიტედი“", color: "#d8281c", image: "/artists/tbgr-poster-lab/manchester-united.jpg", width: 1440, height: 1440 },
      { title: "პოსტერი „მილანი“", color: "#d6122e", image: "/artists/tbgr-poster-lab/milan.jpg", width: 1440, height: 1440 },
      { title: "პოსტერი „ბაიერნი“", color: "#dc052d", image: "/artists/tbgr-poster-lab/bayern.jpg", width: 1440, height: 1440 },
      { title: "პოსტერი „პსჟ“", color: "#0a3a73", image: "/artists/tbgr-poster-lab/psg.jpg", width: 1440, height: 1440 },
    ],
    en: {
      name: "TBGR Poster Lab",
      city: "",
      bio: "TBGR Poster Lab makes minimalist posters about sports legends and football clubs: the hero's colours, a quote, a short story and key achievements in one composition.",
      workTitles: [
        "Poster \"Kvara\"",
        "Poster \"Messi\"",
        "Poster \"Ronaldo\"",
        "Poster \"Yamal\"",
        "Poster \"Ali\"",
        "Poster \"Real Madrid\"",
        "Poster \"FC Barcelona\"",
        "Poster \"Liverpool F.C.\"",
        "Poster \"Manchester United\"",
        "Poster \"AC Milan\"",
        "Poster \"Bayern München\"",
        "Poster \"PSG\"",
      ],
    },
  },
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
