import { makerOf } from "@/data/categories";
import type { Lang } from "@/lib/dictionary";

export type ArtistWork = {
  title: string;
  color: string;
  // ნამუშევრის ბმული (პოსტი ინსტაგრამზე, ფეისბუქზე და ა.შ.); თუ არ არის, ავტორის ინსტაგრამი/ფეისბუქი გამოიყენება
  url?: string;
  // ფასი ლარში (₾); თუ არ არის, საიტი ფასს არ აჩვენებს
  price?: number;
  // ფასდაკლება მხოლოდ ამ ნამუშევარზე (%): ხელოვანის საერთო ფასდაკლებას (`sale`) ჩაანაცვლებს
  salePercent?: number;
  // დამატების თარიღი (YYYY-MM-DD): 30 დღით „ახალი“ ნიშანი ჩანს
  added?: string;
  // თაგების გასაღებები (src/data/tags.ts): საჩუქრის მიზეზი, მაგ. "for-her", "for-mom"
  tags?: string[];
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
  // საიტზე დამატების თარიღი (YYYY-MM-DD): 14 დღით მთავარზე „ახალი ხელოვანი“ ზოლი ჩანს.
  // თუ არ არის, ავტომატურად იღება ყველაზე ადრეული ნამუშევრის `added`
  joined?: string;
  // „გადამოწმებულია“: ხელით შემოწმებულია, რომ ხელოვანის გვერდი ნამდვილია და აქტიური. ნიშანი ჩანს მის გვერდზე და ბარათზე.
  // გასაუქმებლად წაშალე ეს ხაზი ან false დაწერე
  verified?: boolean;
  // ფასდაკლება ხელოვანის ყველა ნამუშევარზე: percent (%) და არასავალდებულო `until` (YYYY-MM-DD, ამ დღის ჩათვლით).
  // გასაშვებად მიუთითე, შესაჩერებლად წაშალე ეს ხაზი ან გასვლის თარიღი დაწერე
  sale?: { percent: number; until?: string };
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
    joined: "2026-10-18",
    verified: true,
    name: "ZHU-ZHA Ceramics",
    city: "თბილისი",
    categories: ["keramika", "samkauli"],
    cover: "/artists/zhuzha-ceramics/ring-amore-rose.jpg",
    banner: "/artists/zhuzha-ceramics/necklace-green-star.jpg",
    bio: "ZHU-ZHA Ceramics ხელით ქმნის კერამიკულ აქსესუარებს: ზღვის ვარსკვლავის ყელსაბამებს ფერადი მძივებით, ბეჭდებს და ბროშებს.",
    instagram: "https://www.instagram.com/zhuzhaceramics/",
    facebook: "https://www.facebook.com/profile.php?id=61580098836416",
    works: [
      { title: "ყელსაბამი „ცისფერი ვარსკვლავი“", color: "#3f9fd6", image: "/artists/zhuzha-ceramics/necklace-blue-star.jpg", width: 1200, height: 1600, price: 120, tags: ["for-mom", "for-her", "new-year"] },
      { title: "ყელსაბამი „ყვითელი ვარსკვლავი“", color: "#d4402c", image: "/artists/zhuzha-ceramics/necklace-yellow-star.jpg", width: 1200, height: 1600, price: 120, tags: ["for-mom", "for-her", "new-year"] },
      { title: "ყელსაბამი „მწვანე ვარსკვლავი“", color: "#3f7a3a", image: "/artists/zhuzha-ceramics/necklace-green-star.jpg", width: 1200, height: 1600, price: 120, tags: ["for-mom", "for-her", "new-year"] },
      { title: "ყელსაბამი „წითელი ვარსკვლავი“", color: "#e0452d", image: "/artists/zhuzha-ceramics/necklace-red-star.jpg", width: 1200, height: 1600, price: 120, tags: ["for-mom", "for-her", "new-year"] },
      { title: "ბეჭედი „ტიტა“", color: "#8a6fbf", image: "/artists/zhuzha-ceramics/ring-tulip.jpg", width: 844, height: 1125, price: 80, tags: ["for-her", "new-year"] },
      { title: "ბეჭედი „AMORE“", color: "#c9a3ad", image: "/artists/zhuzha-ceramics/ring-amore.jpg", width: 844, height: 1125, price: 80, tags: ["for-her", "new-year"] },
      { title: "ბროში „გული“", color: "#d9573f", image: "/artists/zhuzha-ceramics/brooch-heart.jpg", width: 1125, height: 1500, price: 80, tags: ["for-mom", "for-her", "new-year"] },
      { title: "ბეჭედი „მწვანე გული“", color: "#2f6b4a", image: "/artists/zhuzha-ceramics/ring-green-heart.jpg", width: 1200, height: 1600, price: 85, tags: ["for-her", "new-year"], added: "2026-10-18" },
      { title: "ბეჭედი „AMORE“ ვარდით", color: "#c8573a", image: "/artists/zhuzha-ceramics/ring-amore-rose.jpg", width: 1200, height: 1600, price: 80, tags: ["for-her", "new-year"], added: "2026-10-18" },
      { title: "საყურეები „ტალღა“", color: "#a9756a", image: "/artists/zhuzha-ceramics/earrings-wave.jpg", width: 1200, height: 1600, price: 90, tags: ["for-mom", "for-her", "new-year"], added: "2026-10-18" },
      { title: "ნაკრები „წითელი გულები“", color: "#d02a24", image: "/artists/zhuzha-ceramics/set-red-hearts.jpg", width: 1200, height: 1600, price: 230, tags: ["for-mom", "for-her", "new-year"], added: "2026-10-18" },
      { title: "ნაკრები „კრემი და ოქრო“", color: "#cbbfa8", image: "/artists/zhuzha-ceramics/set-cream-gold.jpg", width: 1125, height: 1500, price: 240, tags: ["for-mom", "for-her", "new-year"], added: "2026-10-18" },
      { title: "ბეჭედი „AMORE“ წითელზე", color: "#e0391c", image: "/artists/zhuzha-ceramics/ring-amore-red.jpg", width: 1200, height: 1600, price: 80, tags: ["for-her", "new-year"], added: "2026-10-18" },
      { title: "ბეჭდები „დიდი გული“", color: "#d9d2c3", image: "/artists/zhuzha-ceramics/rings-amore-big.jpg", width: 1200, height: 1600, price: 90, tags: ["for-her", "new-year"], added: "2026-10-18" },
      { title: "ბეჭედი „ცეცხლოვანი გული“", color: "#f0642b", image: "/artists/zhuzha-ceramics/ring-flame-heart.jpg", width: 1200, height: 1600, price: 90, tags: ["for-her", "new-year"], added: "2026-10-18" },
      { title: "ბეჭედი „შავი ტიტა“", color: "#6e6a66", image: "/artists/zhuzha-ceramics/ring-tulip-black.jpg", width: 1200, height: 1600, price: 80, tags: ["for-her", "new-year"], added: "2026-10-18" },
      { title: "ყელსაბამი „ნარინჯისფერი ვარსკვლავი“", color: "#ec4a22", image: "/artists/zhuzha-ceramics/necklace-orange-star.jpg", width: 1200, height: 1600, price: 120, tags: ["for-mom", "for-her", "new-year"], added: "2026-10-18" },
      { title: "ბეჭედი „სადაფის გული“", color: "#e6d9c6", image: "/artists/zhuzha-ceramics/ring-pearl-heart.jpg", width: 1179, height: 1464, price: 90, tags: ["for-her", "new-year"], added: "2026-10-19" },
      { title: "ბეჭედი „ALL YOU NEED IS LOVE“", color: "#b3202a", image: "/artists/zhuzha-ceramics/ring-all-you-need.jpg", width: 1179, height: 1549, price: 90, tags: ["for-her", "new-year"], added: "2026-10-19" },
    ],
    en: {
      name: "ZHU-ZHA Ceramics",
      city: "Tbilisi",
      bio: "ZHU-ZHA Ceramics makes ceramic accessories by hand: starfish necklaces with colourful beads, rings and brooches.",
      workTitles: [
        "Necklace \"Blue Star\"",
        "Necklace \"Yellow Star\"",
        "Necklace \"Green Star\"",
        "Necklace \"Red Star\"",
        "Ring \"Tulip\"",
        "Ring \"AMORE\"",
        "Brooch \"Heart\"",
        "Ring \"Green Heart\"",
        "Ring \"AMORE\" with a rose",
        "Earrings \"Wave\"",
        "Set \"Red Hearts\"",
        "Set \"Cream & Gold\"",
        "Ring \"AMORE\" on red",
        "Rings \"Big Heart\"",
        "Ring \"Fiery Heart\"",
        "Ring \"Black Tulip\"",
        "Necklace \"Orange Star\"",
        "Ring \"Pearl Heart\"",
        "Ring \"All You Need Is Love\"",
      ],
    },
  },
  {
    slug: "tbgr-poster-lab",
    joined: "2026-10-19",
    verified: true,
    name: "TBGR Poster Lab",
    // ქალაქი ჯერ უცნობია: ცარიელზე საიტი უბრალოდ არ აჩვენებს
    city: "",
    categories: ["posterebi"],
    sale: { percent: 20 },
    cover: "/artists/tbgr-poster-lab/arsenal-champions.jpg",
    banner: "/artists/tbgr-poster-lab/kvara.jpg",
    bio: "TBGR Poster Lab ქმნის მინიმალისტური სტილის პოსტერებს სპორტის ლეგენდებსა და ფეხბურთის კლუბებზე: გმირის ფერები, ციტატა, მოკლე ისტორია და მთავარი მიღწევები ერთ კომპოზიციაში.",
    instagram: "https://www.instagram.com/tbgrposterlab/",
    facebook: "https://www.facebook.com/profile.php?id=61586527464734",
    works: [
      { title: "პოსტერი „კვარა“", color: "#1c1c22", image: "/artists/tbgr-poster-lab/kvara.jpg", width: 1440, height: 1440, price: 60, tags: ["for-fans", "for-him", "new-year"] },
      { title: "პოსტერი „მესი“", color: "#4a8fc4", image: "/artists/tbgr-poster-lab/messi.jpg", width: 1440, height: 1440, price: 60, tags: ["for-fans", "for-him", "new-year"] },
      { title: "პოსტერი „რონალდო“", color: "#c4302b", image: "/artists/tbgr-poster-lab/ronaldo.jpg", width: 1440, height: 1440, price: 60, tags: ["for-fans", "for-him", "new-year"] },
      { title: "პოსტერი „იამალი“", color: "#2f4f9e", image: "/artists/tbgr-poster-lab/yamal.jpg", width: 1440, height: 1440, price: 60, tags: ["for-fans", "for-him", "new-year"] },
      { title: "პოსტერი „ალი“", color: "#c2242e", image: "/artists/tbgr-poster-lab/ali.jpg", width: 1440, height: 1440, price: 60, tags: ["for-fans", "for-him", "new-year"] },
      { title: "პოსტერი „რეალ მადრიდი“", color: "#1d4f9c", image: "/artists/tbgr-poster-lab/real-madrid.jpg", width: 1440, height: 1440, price: 60, tags: ["for-fans", "for-him", "new-year"] },
      { title: "პოსტერი „ბარსელონა“", color: "#a3123f", image: "/artists/tbgr-poster-lab/barcelona.jpg", width: 1440, height: 1440, price: 60, tags: ["for-fans", "for-him", "new-year"] },
      { title: "პოსტერი „ლივერპული“", color: "#8a1c1c", image: "/artists/tbgr-poster-lab/liverpool.jpg", width: 1440, height: 1440, price: 60, tags: ["for-fans", "for-him", "new-year"] },
      { title: "პოსტერი „მანჩესტერ იუნაიტედი“", color: "#d8281c", image: "/artists/tbgr-poster-lab/manchester-united.jpg", width: 1440, height: 1440, price: 60, tags: ["for-fans", "for-him", "new-year"] },
      { title: "პოსტერი „მილანი“", color: "#d6122e", image: "/artists/tbgr-poster-lab/milan.jpg", width: 1440, height: 1440, price: 60, tags: ["for-fans", "for-him", "new-year"] },
      { title: "პოსტერი „ბაიერნი“", color: "#dc052d", image: "/artists/tbgr-poster-lab/bayern.jpg", width: 1440, height: 1440, price: 60, tags: ["for-fans", "for-him", "new-year"] },
      { title: "პოსტერი „პსჟ“", color: "#0a3a73", image: "/artists/tbgr-poster-lab/psg.jpg", width: 1440, height: 1440, price: 60, tags: ["for-fans", "for-him", "new-year"] },
      { title: "პოსტერი „რეალ მადრიდი · ლოგო“", color: "#1d3a8a", image: "/artists/tbgr-poster-lab/real-madrid-logo.jpg", width: 1200, height: 1600, price: 60, tags: ["for-fans", "for-him", "new-year"], added: "2026-10-17" },
      { title: "პოსტერი „მილანი · ლოგო“", color: "#d6122e", image: "/artists/tbgr-poster-lab/milan-logo.jpg", width: 1200, height: 1600, price: 60, tags: ["for-fans", "for-him", "new-year"], added: "2026-10-17" },
      { title: "პოსტერი „კამ ნოუ“", color: "#a3123f", image: "/artists/tbgr-poster-lab/camp-nou.jpg", width: 1200, height: 1600, price: 60, tags: ["for-fans", "for-him", "new-year"], added: "2026-10-17" },
      { title: "პოსტერი „ოლდ ტრაფორდი“", color: "#d8281c", image: "/artists/tbgr-poster-lab/old-trafford.jpg", width: 1200, height: 1600, price: 60, tags: ["for-fans", "for-him", "new-year"], added: "2026-10-17" },
      { title: "პოსტერი „არსენალი“", color: "#e0242b", image: "/artists/tbgr-poster-lab/arsenal.jpg", width: 1200, height: 1600, price: 60, tags: ["for-fans", "for-him", "new-year"], added: "2026-10-19" },
      { title: "პოსტერი „არსენალი · ჩემპიონები“", color: "#d9141c", image: "/artists/tbgr-poster-lab/arsenal-champions.jpg", width: 1200, height: 1600, price: 60, tags: ["for-fans", "for-him", "new-year"], added: "2026-10-19" },
      { title: "პოსტერი „იუვენტუსი“", color: "#2b2b2b", image: "/artists/tbgr-poster-lab/juventus.jpg", width: 1200, height: 1600, price: 60, tags: ["for-fans", "for-him", "new-year"], added: "2026-10-19" },
      { title: "პოსტერი „რონალდო · სიუ“", color: "#b8332c", image: "/artists/tbgr-poster-lab/ronaldo-celebration.jpg", width: 1200, height: 1600, price: 60, tags: ["for-fans", "for-him", "new-year"], added: "2026-10-17" },
      { title: "პოსტერი „თოფურია“", color: "#c4302b", image: "/artists/tbgr-poster-lab/topuria.jpg", width: 1200, height: 1600, price: 60, tags: ["for-fans", "for-him", "new-year"], added: "2026-10-17" },
      { title: "პოსტერი „რამოსი“", color: "#2b4a7a", image: "/artists/tbgr-poster-lab/ramos.jpg", width: 1200, height: 1200, price: 60, tags: ["for-fans", "for-him", "new-year"], added: "2026-10-17" },
      { title: "პოსტერი „მბაპე“", color: "#1d3a8a", image: "/artists/tbgr-poster-lab/mbappe.jpg", width: 1200, height: 1200, price: 60, tags: ["for-fans", "for-him", "new-year"], added: "2026-10-17" },
      { title: "პოსტერი „მალდინი“", color: "#d6122e", image: "/artists/tbgr-poster-lab/maldini.jpg", width: 1200, height: 1200, price: 60, tags: ["for-fans", "for-him", "new-year"], added: "2026-10-17" },
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
        "Poster \"Real Madrid · Logo\"",
        "Poster \"AC Milan · Logo\"",
        "Poster \"Camp Nou\"",
        "Poster \"Old Trafford\"",
        "Poster \"Arsenal F.C.\"",
        "Poster \"Arsenal · Champions\"",
        "Poster \"Juventus F.C.\"",
        "Poster \"Ronaldo · Siuu\"",
        "Poster \"Topuria\"",
        "Poster \"Ramos\"",
        "Poster \"Mbappé\"",
        "Poster \"Maldini\"",
      ],
    },
  },
  {
    slug: "tamus-shop",
    verified: true,
    name: "Tamus Shop",
    // ქალაქი ჯერ უცნობია: ცარიელზე საიტი უბრალოდ არ აჩვენებს
    city: "",
    categories: ["tekstili", "sachuqrebi"],
    cover: "/artists/tamus-shop/bouquet-pink-blooms.jpg",
    banner: "/artists/tamus-shop/bouquet-pink-blooms.jpg",
    bio: "ჰობი, რომელიც ბიზნესად იქცა. მე ვარ თამუ და უკვე 5 წელია ხელით ნაქსოვი ნივთების მაღაზია მაქვს. Tamus Shop-ში შეხვდებით უამრავ ფერად ნივთს: ძაფის ტიტებისა და ვარდების თაიგულებს, ფუმფულა ძაფის თაიგულებს და ამიგურუმის პატარა თოჯინებს. ასეთი თაიგული არ ჭკნება და საჩუქრად დიდხანს ინახება.",
    instagram: "https://www.instagram.com/tamusshop3/",
    facebook: "https://www.facebook.com/profile.php?id=100071936977915",
    works: [
      { title: "თაიგული „ვარდისფერი ყვავილები“", color: "#e58fb0", image: "/artists/tamus-shop/bouquet-pink-blooms.jpg", width: 1200, height: 1598, price: 55, tags: ["for-mom", "for-her", "never-wilts", "new-year"], added: "2026-10-14" },
      { title: "ფუმფულა თაიგული „ყვითელი“", color: "#f2a900", image: "/artists/tamus-shop/plush-yellow.jpg", width: 1200, height: 1598, price: 45, tags: ["for-mom", "for-her", "never-wilts", "new-year"], added: "2026-10-14" },
      { title: "ფუმფულა თაიგული „ვარდისფერი ვარდები“", color: "#e8559a", image: "/artists/tamus-shop/plush-pink-roses.jpg", width: 1200, height: 1598, price: 45, tags: ["for-mom", "for-her", "never-wilts", "new-year"], added: "2026-10-14" },
      { title: "თაიგული „ყვითელი ტიტები თოჯინით“", color: "#f0b400", image: "/artists/tamus-shop/tulips-yellow-doll.jpg", width: 1200, height: 1598, price: 60, tags: ["for-mom", "for-her", "never-wilts", "new-year"], added: "2026-10-14" },
      { title: "თაიგული „ტიტები და სიმინდი“", color: "#1f9c86", image: "/artists/tamus-shop/tulips-teal-corn.jpg", width: 1200, height: 1598, price: 45, tags: ["for-mom", "for-her", "never-wilts", "new-year"], added: "2026-10-14" },
      { title: "თაიგული „ცისფერი ტიტები“", color: "#2d9fd0", image: "/artists/tamus-shop/tulips-blue-doll.jpg", width: 1200, height: 1600, price: 65, tags: ["for-mom", "for-her", "never-wilts", "new-year"], added: "2026-10-14" },
      { title: "თაიგული „ვარდისფერი ტიტები“", color: "#f0a0b8", image: "/artists/tamus-shop/tulips-pink.jpg", width: 1200, height: 1598, price: 35, tags: ["for-mom", "for-her", "never-wilts", "new-year"], added: "2026-10-14" },
      { title: "თაიგული „ნარინჯისფერი ტიტები“", color: "#e8501c", image: "/artists/tamus-shop/tulips-orange.jpg", width: 1200, height: 1598, price: 35, tags: ["for-mom", "for-her", "never-wilts", "new-year"], added: "2026-10-14" },
      { title: "ფუმფულა თაიგული „წითელი ვარდები“", color: "#c8102e", image: "/artists/tamus-shop/plush-red-roses.jpg", width: 1200, height: 1598, price: 45, tags: ["for-mom", "for-her", "never-wilts", "new-year"], added: "2026-10-14" },
      { title: "ფუმფულა თაიგული „წითელი ყვავილები“", color: "#d8201c", image: "/artists/tamus-shop/plush-red-flowers.jpg", width: 1200, height: 1598, price: 25, tags: ["for-mom", "for-her", "never-wilts", "new-year"], added: "2026-10-14" },
    ],
    en: {
      name: "Tamus Shop",
      city: "",
      bio: "A hobby that grew into a business. I'm Tamu, and for five years I've run a shop of hand-crocheted things. At Tamus Shop you'll find lots of colourful pieces: yarn bouquets of tulips and roses, plush-yarn bouquets and small amigurumi dolls. A crocheted bouquet never wilts and keeps for years as a gift.",
      workTitles: [
        "Bouquet \"Pink Blooms\"",
        "Plush bouquet \"Yellow\"",
        "Plush bouquet \"Pink Roses\"",
        "Bouquet \"Yellow Tulips with a Doll\"",
        "Bouquet \"Tulips and Corn\"",
        "Bouquet \"Blue Tulips\"",
        "Bouquet \"Pink Tulips\"",
        "Bouquet \"Orange Tulips\"",
        "Plush bouquet \"Red Roses\"",
        "Plush bouquet \"Red Flowers\"",
      ],
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

// ნამუშევრის კოდი: ფოტოს ფაილის სახელი (მაგ. "ring-amore"); ფოტოს გარეშე რიგითი ნომერი.
// სტაბილურია: შენახვის (❤️) გასაღებად ვიყენებთ, ნამუშევრების რიგი რომ შეიცვალოს.
export function workId(work: ArtistWork, index: number): string {
  const file = work.image?.split("/").pop()?.replace(/\.[^.]+$/, "");
  return file || `w${index}`;
}

export type WorkEntry = { artist: Artist; work: ArtistWork; index: number; id: string };

// დამატების დრო (ms); თარიღის გარეშე (ძველი) ნამუშევარი 0 არის და სიის ბოლოში ხვდება
export function workAddedTime(work: { added?: string }): number {
  return work.added ? Date.parse(work.added) || 0 : 0;
}

// ყველა ნამუშევარი ერთ სიაში (ავტორთან ერთად): ყველგან დროით, ყველაზე ახლად დამატებული პირველი.
// თანაბარი თარიღისას რიგი ფაილისაა (sort სტაბილურია)
export function getWorkEntries(lang: Lang): WorkEntry[] {
  return getLocalizedArtists(lang)
    .flatMap((artist) => artist.works.map((work, index) => ({ artist, work, index, id: workId(work, index) })))
    .sort((a, b) => workAddedTime(b.work) - workAddedTime(a.work));
}

const DAY = 24 * 60 * 60 * 1000;

// ნამუშევარი „ახალია“, თუ ბოლო 30 დღეში დაემატა
export function isNewWork(work: ArtistWork): boolean {
  if (!work.added) return false;
  const age = Date.now() - Date.parse(work.added);
  // თარიღი YYYY-MM-DD UTC-ის შუაღამეა: საქართველოში (UTC+4) დღევანდელი თარიღი ღამით ჯერ „მომავალში“ ჩანს, ამიტომ 1 დღემდე დაშვება
  return age > -DAY && age < 30 * DAY;
}

// ხელოვანი „ახალია“, თუ ბოლო 14 დღეში დაემატა
export function isNewArtist(artist: ArtistData): boolean {
  const dates = [artist.joined, ...artist.works.map((work) => work.added)]
    .filter((d): d is string => Boolean(d))
    .map((d) => Date.parse(d))
    .filter((n) => !Number.isNaN(n));
  if (dates.length === 0) return false;
  // joined მითითებულია: ის ვარგა; თორემ ყველაზე ადრეული ნამუშევარი (ყველა ნამუშევარს თარიღი უნდა ჰქონდეს, თორემ ხელოვანი ძველია)
  const explicit = artist.joined ? Date.parse(artist.joined) : undefined;
  const allDated = artist.works.length > 0 && artist.works.every((work) => work.added);
  const start = explicit ?? (allDated ? Math.min(...dates) : undefined);
  if (start === undefined || Number.isNaN(start)) return false;
  const age = Date.now() - start;
  return age > -DAY && age < 14 * DAY;
}

// ფასი ფასდაკლების გათვალისწინებით: price = რასაც მყიდველი იხდის, original/percent მხოლოდ ფასდაკლებისას
export type Pricing = { price: number; original?: number; percent?: number };

export function pricing(artist: ArtistData, work: ArtistWork): Pricing | undefined {
  if (work.price === undefined) return undefined;
  let percent = work.salePercent;
  if (percent === undefined && artist.sale) {
    const { until } = artist.sale;
    // until-ის დღე ჩათვლით (24 საათი თარიღის დასაწყისიდან)
    const live = !until || Date.now() < Date.parse(until) + 24 * 60 * 60 * 1000;
    if (live) percent = artist.sale.percent;
  }
  if (!percent || percent <= 0 || percent >= 100) return { price: work.price };
  return { price: Math.round(work.price * (1 - percent / 100)), original: work.price, percent };
}

// ფასი, რასაც მყიდველი იხდის (ფასდაკლებით)
export function effectivePrice(artist: ArtistData, work: ArtistWork): number | undefined {
  return pricing(artist, work)?.price;
}
