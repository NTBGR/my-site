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
  // ბარათზე ფოტოს რომელი წერტილი დარჩეს ცენტრში, როცა ფოტო 3:4-ში იჭრება: „x% y%“ (მაგ. "80% 50%": მარჯვნივ). ნაგულისხმევი "50% 50%".
  // სრულეკრანიან ნახვაში ფოტო მთლიანად ჩანს, ამიტომ მხოლოდ ბარათზე მოქმედებს
  focal?: string;
  // true: ფოტო ბუნდოვანია ან დაბალი ხარისხისაა (ორიგინალი): მთავარის „ახალ ნამუშევრებში“ არ ჩანს, ხელოვანის გვერდზე კი ჩანს
  lowQuality?: boolean;
  // "contain": ბარათზე ფოტო მთლიანად ჩანს, ცენტრში, ფონზე (ჰორიზონტალური ან პატარა ფოტოსთვის, რომ არ დაიჭრას და არ გაბუნდოვანდეს)
  fit?: "contain";
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
  // უფასო პერიოდი თვეებში, `joined`-იდან (ნაგულისხმევი 2). ვადები და დარჩენილი დღეები ჩანს /stats-ზე, გაფრთხილება მოდის ტელეგრამში
  freeMonths?: number;
  // მუდმივად უფასო (ვადა არ აქვს, გაფრთხილება არ მოდის): პირველი ხელოვანები
  freeForever?: boolean;
  // გამოწერა გადახდილია ამ დღემდე (YYYY-MM-DD): ყოველი გადახდის შემდეგ გადაწიე. თუ არ არის, მოქმედებს მხოლოდ უფასო პერიოდი
  paidUntil?: string;
  // რაზე დაეთანხმა ხელოვანი /join ფორმაში (ტელეგრამის შეტყობინებიდან): პირობებისა და კონფიდენციალურობის ვერსიები, დრო (თბილისის) და ფორმაში ნაჩვენები შეთავაზება.
  // /stats-ზე ჩანს. თუ არ არის, ხელით დაემატა და თანხმობის ჩანაწერი არ არსებობს
  consent?: { terms: string; privacy: string; at: string; offer: string };
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
    freeForever: true,
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
    freeForever: true,
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
    freeForever: true,
    verified: true,
    name: "Tamus Shop",
    // ქალაქი ჯერ უცნობია: ცარიელზე საიტი უბრალოდ არ აჩვენებს
    city: "",
    categories: ["naqsovi", "tekstili", "sachuqrebi"],
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
  {
    slug: "natiart-space",
    joined: "2026-10-24",
    // 3 თვე უფასოდ (შეთანხმება 2026-10-24: ფორმაში 2 თვე ეწერა, პირველ ხელოვანებს 3 თვე ეძლევათ)
    freeMonths: 3,
    consent: { terms: "2026-10-19", privacy: "2026-10-19", at: "2026-10-24 12:45", offer: "უფასო 2 თვის შემდეგ 20 ₾ თვეში" },
    name: "NatiArt Space",
    city: "გორი",
    categories: ["saxlis-dekori", "skulptura"],
    cover: "/artists/natiart-space/set-gold-flakes.jpg",
    banner: "/artists/natiart-space/set-gold-flakes.jpg",
    bio: "მჯერა, რომ ყველა სახლს სჭირდება კუთხე, საიდანაც სიმშვიდე და სინათლე გამოდის. სწორედ ამიტომ ვქმნი თაბაშირის ხელნაკეთ ნივთებს, უმეტესად საეკლესიო ნაკრებებსა და დახვეწილ დეკორაციებს. მინდა, ჩემს ნამუშევრებში ის სითბო და ზრუნვა იგრძნოთ, რაც მათ შექმნაში ჩავდე. ეს არ არის უბრალოდ დეკორი, ეს არის გულით შექმნილი ისტორია თქვენი ოჯახისთვის.",
    instagram: "https://www.instagram.com/natiartspace/",
    facebook: "https://www.facebook.com/share/1H6GxAyitb/",
    works: [
      { title: "საეკლესიო ნაკრები „ოვალური ლანგარი“", color: "#d9c7b0", image: "/artists/natiart-space/set-oval-tray.jpg", width: 1086, height: 1448, price: 25, added: "2026-10-24" },
      { title: "საეკლესიო ნაკრები „ანგელოზები“", color: "#d8cfc2", image: "/artists/natiart-space/set-angels.jpg", width: 1200, height: 1600, price: 35, added: "2026-10-24" },
      { title: "საეკლესიო ნაკრები „ანგელოზი და ქილა“", color: "#d9d4cb", image: "/artists/natiart-space/set-angel-jar.jpg", width: 1200, height: 1600, price: 30, added: "2026-10-24" },
      { title: "საეკლესიო ნაკრები „გული“", color: "#e3d9cc", image: "/artists/natiart-space/set-heart.jpg", width: 1086, height: 1448, price: 40, added: "2026-10-24" },
      { title: "საეკლესიო ნაკრები „ოქროს ფანტელები“", color: "#d9b894", image: "/artists/natiart-space/set-gold-flakes.jpg", width: 1086, height: 1448, price: 45, added: "2026-10-24" },
      { title: "საეკლესიო ნაკრები „მძივებიანი ლანგარი“", color: "#e2d6c6", image: "/artists/natiart-space/set-beaded-tray.jpg", width: 843, height: 1124, price: 50, added: "2026-10-24" },
      { title: "საეკლესიო ნაკრები „დიდი ჯამი“", color: "#e4dccf", image: "/artists/natiart-space/set-big-bowl.jpg", width: 843, height: 1124, price: 50, added: "2026-10-24" },
      { title: "საეკლესიო ნაკრები „ქილა სახურავით“", color: "#cdb9a2", image: "/artists/natiart-space/set-lidded-jar.jpg", width: 896, height: 1195, price: 45, added: "2026-10-24" },
    ],
    en: {
      name: "NatiArt Space",
      city: "Gori",
      bio: "I believe every home needs a corner where calm and light come from. That is why I make handmade plaster pieces, mostly church sets and refined decorations. I want you to feel in my work the warmth and care I put into making it. It is not just decor, it is a story made with heart for your family.",
      workTitles: [
        "Church set \"Oval Tray\"",
        "Church set \"Angels\"",
        "Church set \"Angel and Jar\"",
        "Church set \"Heart\"",
        "Church set \"Gold Flakes\"",
        "Church set \"Beaded Tray\"",
        "Church set \"Large Bowl\"",
        "Church set \"Lidded Jar\"",
      ],
    },
  },
  {
    slug: "glontinini",
    joined: "2026-10-25",
    // 3 თვე უფასოდ (შეთანხმება 2026-10-25: ფორმაში 2 თვე ეწერა, პირველ ხელოვანებს 3 თვე ეძლევათ)
    freeMonths: 3,
    consent: { terms: "2026-10-19", privacy: "2026-10-19", at: "2026-10-25 18:10", offer: "უფასო 2 თვის შემდეგ 20 ₾ თვეში" },
    name: "Glontinini",
    city: "თბილისი",
    categories: ["posterebi"],
    cover: "/artists/glontinini/orig-4.jpg",
    banner: "/artists/glontinini/orig-4.jpg",
    bio: "მე ვარ ნინი ღლონტი, ქართველი მხატვარი, ილუსტრატორი და გრაფიკული დიზაინერი. მონაწილეობა მაქვს მიღებული პერსონალურ და ჯგუფურ გამოფენებში, მათ შორის „No Matter What“ (2025), „Tomorrow Is Near“ (2023) და „Showroom“ (2026). ფერწერის პარალელურად ვქმნი საავტორო ილუსტრაციებსა და პოსტერებს, რომლებშიც ხელით შესრულებულ ილუსტრაციებს თანამედროვე გრაფიკულ დიზაინთან ვაერთიანებ. ჩემი პოსტერები შექმნილია ორიგინალური ილუსტრაციების საფუძველზე და დაბეჭდილია მაღალი ხარისხის აკვარელის ქაღალდზე, რაც ნამუშევრებს განსაკუთრებულ ტექსტურასა და ვიზუალურ სიღრმეს ანიჭებს.",
    instagram: "https://www.instagram.com/glontinini_/",
    facebook: "",
    works: [
      { title: "პოსტერი „A Tale of Two Times“", color: "#c9a98a", image: "/artists/glontinini/orig-4.jpg", width: 1080, height: 1620, focal: "50% 100%", added: "2026-10-25" },
      { title: "პოსტერი „Winged or Fallen“", color: "#c9a98a", image: "/artists/glontinini/orig-1.jpg", width: 1080, height: 720, focal: "79% 50%", lowQuality: true, added: "2026-10-25" },
      { title: "პოსტერი „ნიღაბი და ცხენი“", color: "#c9a98a", image: "/artists/glontinini/orig-2.jpg", width: 1080, height: 720, focal: "50% 50%", lowQuality: true, added: "2026-10-25" },
      { title: "Glontinini · პოსტერების კოლექცია I", color: "#c9a98a", image: "/artists/glontinini/orig-3.jpg", width: 1080, height: 720, focal: "60% 50%", lowQuality: true, added: "2026-10-25" },
      { title: "Glontinini · პოსტერების კოლექცია II", color: "#c9a98a", image: "/artists/glontinini/orig-5.jpg", width: 1080, height: 720, focal: "54% 50%", lowQuality: true, added: "2026-10-25" },
      { title: "Glontinini · პოსტერების კოლექცია III", color: "#c9a98a", image: "/artists/glontinini/orig-6.jpg", width: 1080, height: 720, focal: "50% 50%", lowQuality: true, added: "2026-10-25" },
      { title: "Glontinini · პოსტერების კოლექცია IV", color: "#c9a98a", image: "/artists/glontinini/orig-7.jpg", width: 1080, height: 720, focal: "56% 50%", lowQuality: true, added: "2026-10-25" },
      { title: "პოსტერები „A Tale of Two Times“ და „Winged or Fallen“", color: "#c9a98a", image: "/artists/glontinini/orig-9.jpg", width: 1080, height: 720, focal: "4% 50%", lowQuality: true, added: "2026-10-25" },
    ],
    en: {
      name: "Glontinini",
      city: "Tbilisi",
      bio: "I am Nini Glonti, a Georgian painter, illustrator and graphic designer. I have taken part in solo and group exhibitions, including No Matter What (2025), Tomorrow Is Near (2023) and Showroom (2026). Alongside painting, I create original illustrations and posters that combine hand-made illustration with contemporary graphic design. My posters are based on original illustrations and printed on high-quality watercolour paper, which gives the work a special texture and visual depth.",
      workTitles: [
        "Poster \"A Tale of Two Times\"",
        "Poster \"Winged or Fallen\"",
        "Poster \"Mask and Horse\"",
        "Glontinini · Poster collection I",
        "Glontinini · Poster collection II",
        "Glontinini · Poster collection III",
        "Glontinini · Poster collection IV",
        "Posters \"A Tale of Two Times\" and \"Winged or Fallen\"",
      ],
    },
  },
  {
    slug: "mandeli",
    joined: "2026-10-27",
    freeMonths: 3,
    consent: { terms: "2026-10-25", privacy: "2026-10-19", at: "2026-10-27 21:57", offer: "პირველი 3 თვე უფასო, შემდეგ 20 ₾ თვეში" },
    name: "მანდელი",
    city: "ახმეტა",
    categories: ["tekstili"],
    cover: "/artists/mandeli/navy-tunic.jpg",
    banner: "/artists/mandeli/navy-tunic.jpg",
    bio: "ვქარგავ ხევსურულ სამოსს ტრადიციული ორნამენტებითა და ფერებით: პერანგებს, ჟილეტებს და სხვა ნაქარგ ნივთებს. ასევე ვკერავ ჩოხებს. შეკვეთის, ზომისა და ფერის შესახებ მომწერეთ ინსტაგრამზე.",
    instagram: "https://www.instagram.com/rusudani7843/",
    facebook: "",
    works: [
      { title: "ხევსურული ნაქარგი პერანგი, ლურჯი", color: "#2b3350", image: "/artists/mandeli/navy-tunic.jpg", width: 1080, height: 1620, price: 1700, tags: ["for-her"], added: "2026-10-27" },
      { title: "ხევსურული ნაქარგი პერანგი, შავი", color: "#2a2424", image: "/artists/mandeli/black-shirt.jpg", width: 900, height: 2000, focal: "50% 58%", price: 1200, tags: ["for-her"], added: "2026-10-27" },
      { title: "თეთრი ჩოხა ორნამენტით", color: "#e8e1d4", image: "/artists/mandeli/white-chokha.jpg", width: 900, height: 2000, price: 500, tags: ["for-her"], added: "2026-10-27" },
      { title: "შავი ჟილეტი ჯვრის ნაქარგით", color: "#23252e", image: "/artists/mandeli/embroidered-vest.jpg", width: 900, height: 2000, price: 300, tags: ["for-her"], added: "2026-10-27" },
    ],
    en: {
      name: "Mandeli",
      city: "Akhmeta",
      bio: "I embroider Khevsur clothing with traditional ornaments and colours: shirts, vests and other embroidered pieces. I also sew chokhas. For orders, sizes and colours, message me on Instagram.",
      workTitles: [
        "Khevsur embroidered shirt, navy",
        "Khevsur embroidered shirt, black",
        "White chokha with ornament",
        "Black vest with embroidered cross",
      ],
    },
  },
  {
    slug: "salita",
    joined: "2026-10-27",
    freeMonths: 3,
    consent: { terms: "2026-10-27", privacy: "2026-10-19", at: "2026-10-27 22:29", offer: "რეგისტრაცია და განთავსება სრულიად უფასოა" },
    name: "სალიტა",
    city: "ბოლნისი",
    categories: ["chantebi", "samkauli", "saxlis-dekori"],
    cover: "/artists/salita/phone-strap-pearl.jpg",
    banner: "/artists/salita/phone-strap-pearl.jpg",
    bio: "ვამზადებ ხელნაკეთ ჩანთებს, ზარდახშებს და აქსესუარებს თეთრი და ბროლის მძივებით. თითოეული ნივთი მძივ-მძივ, ხელით იწყობა. შეკვეთის შესახებ მომწერეთ ინსტაგრამზე.",
    instagram: "https://www.instagram.com/sali.handmade.bags/",
    facebook: "",
    works: [
      { title: "ტელეფონის საკიდი მძივებით", color: "#e9dccb", image: "/artists/salita/phone-strap-pearl.jpg", width: 1080, height: 1440, price: 20, tags: ["for-her"], added: "2026-10-27" },
      { title: "ტელეფონის ჩანთა მძივებით", color: "#c9d1bd", image: "/artists/salita/phone-pouch-pearl.jpg", width: 1080, height: 1440, price: 60, tags: ["for-her"], added: "2026-10-27" },
      { title: "ზარდახშა სარკით, მძივებით", color: "#e6ddd2", image: "/artists/salita/pearl-mirror-box.jpg", width: 900, height: 1600, focal: "50% 62%", price: 150, tags: ["for-her"], added: "2026-10-27" },
      { title: "ზარდახშა მძივებით", color: "#e4d9cf", image: "/artists/salita/pearl-box.jpg", width: 1080, height: 1440, price: 80, tags: ["for-her"], added: "2026-10-27" },
      { title: "წელის ჩანთა, ვერცხლისფერი", color: "#d9d9d6", image: "/artists/salita/waist-bag-silver-34.jpg", width: 1080, height: 1440, price: 70, tags: ["for-her"], added: "2026-10-27" },
      { title: "წელის ჩანთა, შავი", color: "#c9d6dc", image: "/artists/salita/waist-bag-black.jpg", width: 1080, height: 1440, price: 70, tags: ["for-her"], added: "2026-10-27" },
      { title: "საბარათე საფულე, შავი", color: "#e8e6e2", image: "/artists/salita/card-wallet-black-34.jpg", width: 1080, height: 1440, price: 35, tags: ["for-her"], added: "2026-10-27" },
      { title: "ყელსაბამი თეთრი მძივებით", color: "#d8473a", image: "/artists/salita/pearl-collar-34.jpg", width: 1080, height: 1440, price: 40, tags: ["for-her"], added: "2026-10-27" },
      { title: "ბრელოკი „პატარა ჩანთა“", color: "#e6e2df", image: "/artists/salita/keychain-mini-bags-34.jpg", width: 1080, height: 1440, price: 15, tags: ["for-her"], added: "2026-10-27" },
    ],
    en: {
      name: "Salita",
      city: "Bolnisi",
      bio: "I make handmade bags, jewellery boxes and accessories with white and crystal beads. Every piece is put together by hand, bead by bead. For orders, message me on Instagram.",
      workTitles: [
        "Beaded phone strap",
        "Beaded phone pouch",
        "Beaded jewellery box with mirror",
        "Beaded jewellery box",
        "Waist bag, silver",
        "Waist bag, black",
        "Card wallet, black",
        "White beaded collar necklace",
        "Keychain \"Mini bag\"",
      ],
    },
  },
  {
    slug: "saflora",
    joined: "2026-10-27",
    freeMonths: 3,
    consent: { terms: "2026-10-27", privacy: "2026-10-19", at: "2026-10-27 22:41", offer: "რეგისტრაცია და განთავსება სრულიად უფასოა" },
    name: "Saflora",
    city: "წალენჯიხა",
    categories: ["tekstili", "saxlis-dekori"],
    cover: "/artists/saflora/clock-embroidered.jpg",
    banner: "/artists/saflora/scene-clock-terrarium.jpg",
    bio: "Sa-flora არის ხელნაკეთი ნივთების პატარა, სიყვარულით შექმნილი სივრცე, სადაც ბუნება, ხელოვნება და ხელსაქმე ერთმანეთს ერწყმის. 🌿 აქ იქმნება სუკულენტები, ნაქარგი ტანსაცმელი, დეკორატიული საათები, ზარდახშები და სხვა უნიკალური ნივთები: თითოეული ხელით და განსაკუთრებული სითბოთი. 🤍 მყავს პატარა ბიჭი და მასთან ერთად ამ საქმის კეთება ჩემთვის ერთგვარი გამოწვევაცაა და თერაპიაც.",
    instagram: "https://www.instagram.com/chanturiasalo/",
    facebook: "https://www.facebook.com/profile.php?id=61585035908187",
    works: [
      { title: "ნაქარგი საათი", color: "#a9bccb", image: "/artists/saflora/clock-embroidered.jpg", width: 1057, height: 1397, price: 55, tags: ["for-her"], added: "2026-10-27" },
      { title: "ზარდახშა ნაქარგი სახურავით", color: "#d9c3a5", image: "/artists/saflora/jewelry-box-34.jpg", width: 1080, height: 1440, price: 40, tags: ["for-her"], added: "2026-10-27" },
      { title: "სუკულენტები შუშის ბურთში", color: "#b9cfdc", image: "/artists/saflora/terrariums-34.jpg", width: 1080, height: 1440, price: 40, added: "2026-10-27" },
      { title: "სუკულენტები წიგნის ფორმის ქოთანში", color: "#cfe0c6", image: "/artists/saflora/succulents-book-pot.jpg", width: 1074, height: 1433, price: 50, added: "2026-10-27" },
      { title: "ნაკრები: საათი და სუკულენტები", color: "#b7c9dc", image: "/artists/saflora/scene-composition-34.jpg", width: 1080, height: 1440, tags: ["for-her"], added: "2026-10-27" },
      { title: "ნაქარგი მაისური, ლურჯი წარწერით", color: "#e9ece8", image: "/artists/saflora/tshirt-blue.jpg", width: 1080, height: 1440, price: 40, tags: ["for-her"], added: "2026-10-27" },
      { title: "ნაქარგი მაისური, ფერადი წარწერით", color: "#eef0ec", image: "/artists/saflora/tshirt-colour.jpg", width: 1080, height: 1399, price: 40, tags: ["for-her"], added: "2026-10-27" },
      { title: "ნაკრები: წიგნის ქოთნები და შუშის ბურთები", color: "#cdbfae", image: "/artists/saflora/succulents-books-globes-34.jpg", width: 1080, height: 1440, added: "2026-10-28" },
      { title: "ნაკრები: სუკულენტები ფიგურულ ქოთნებში", color: "#c9b08a", image: "/artists/saflora/succulents-animal-pots-34.jpg", width: 1080, height: 1440, added: "2026-10-28" },
    ],
    en: {
      name: "Saflora",
      city: "Tsalenjikha",
      bio: "Sa-flora is a small space of handmade things, created with love, where nature, art and handicraft blend together. 🌿 Here we make succulents, embroidered clothing, decorative clocks, jewellery boxes and other unique pieces: each by hand and with special warmth. 🤍 I have a little boy, and doing this work together with him is both a challenge and a kind of therapy for me.",
      workTitles: [
        "Embroidered clock",
        "Jewellery box with embroidered lid",
        "Succulents in a glass globe",
        "Succulents in a book-shaped pot",
        "Set: clock and succulents",
        "Embroidered T-shirt, blue lettering",
        "Embroidered T-shirt, colourful lettering",
        "Set: succulents in book pots and glass globes",
        "Set: succulents in figure-shaped pots",
      ],
    },
  },
  {
    slug: "cozy-lights",
    joined: "2026-10-28",
    freeMonths: 3,
    consent: { terms: "2026-10-27", privacy: "2026-10-19", at: "2026-10-27 22:44", offer: "რეგისტრაცია და განთავსება სრულიად უფასოა" },
    name: "Cozy lights",
    city: "თბილისი",
    categories: ["saxlis-dekori", "sachuqrebi"],
    cover: "/artists/cozy-lights/bouquet-box-burgundy.jpg",
    banner: "/artists/cozy-lights/bouquet-box-burgundy.jpg",
    bio: "„თბილი ნათება“: ხელნაკეთი დეკორატიული სურნელოვანი სანთლები, რომლებსაც დიდი სიყვარულით ვქმნით. თაიგულები, ბროწეულები და სასაჩუქრე ნაკრებები. შეკვეთისთვის მომწერეთ ინსტაგრამზე.",
    instagram: "https://www.instagram.com/cozylights54/",
    facebook: "https://www.facebook.com/share/1ERzRwRE29/",
    works: [
      { title: "სანთლების თაიგული ყუთში, ბორდო", color: "#c8798a", image: "/artists/cozy-lights/bouquet-box-burgundy.jpg", width: 896, height: 1121, price: 45, tags: ["for-her"], added: "2026-10-28" },
      { title: "სანთლების თაიგული ჩანთაში", color: "#e2d3c3", image: "/artists/cozy-lights/bouquet-bag-brown-34.jpg", width: 1080, height: 1440, price: 60, tags: ["for-her"], added: "2026-10-28" },
      { title: "ბროწეულის სანთლები", color: "#e6dcd5", image: "/artists/cozy-lights/pomegranates.jpg", width: 840, height: 1050, price: 20, tags: ["for-her"], added: "2026-10-28" },
      { title: "ტიტების თაიგულის სანთელი", color: "#e8e4de", image: "/artists/cozy-lights/tulip-bouquets.jpg", width: 1080, height: 1351, price: 12, tags: ["for-her"], added: "2026-10-28" },
      { title: "ნაკრები: ყვავილის სანთლები ყუთებში", color: "#ece4dc", image: "/artists/cozy-lights/peony-boxes.jpg", width: 1184, height: 1578, price: 10, tags: ["for-her"], added: "2026-10-28" },
      { title: "ნაკრები: სანთლები სასაჩუქრე ყუთში", color: "#eadccf", image: "/artists/cozy-lights/gift-set-box-34.jpg", width: 1080, height: 1440, price: 25, tags: ["for-her"], added: "2026-10-28" },
    ],
    en: {
      name: "Cozy lights",
      city: "Tbilisi",
      bio: "Cozy lights (“Tbili natheba”): handmade decorative scented candles, made with a lot of love. Bouquets, pomegranates and gift sets. For orders, message me on Instagram.",
      workTitles: [
        "Candle bouquet in a box, burgundy",
        "Candle bouquet in a bag",
        "Pomegranate candles",
        "Tulip bouquet candle",
        "Set: flower candles in boxes",
        "Set: candles in a gift box",
      ],
    },
  },
  {
    slug: "nino-handmade",
    joined: "2026-10-28",
    freeMonths: 3,
    consent: { terms: "2026-10-27", privacy: "2026-10-19", at: "2026-10-27 22:46", offer: "რეგისტრაცია და განთავსება სრულიად უფასოა" },
    name: "Nino handmade",
    city: "თბილისი",
    categories: ["naqsovi"],
    cover: "/artists/nino-handmade/bunny-rattle-pink-34.jpg",
    banner: "/artists/nino-handmade/bunny-rattle-pink-34.jpg",
    bio: "მე ვარ ნინო. ვქსოვ სათამაშოებს და თითქმის ყველაფერს: კურდღლებს, ჟირაფებს, იხვებს, საწოვარას სამაგრებსა და ჩხარუნებს. შეკვეთისთვის მომწერეთ ინსტაგრამზე.",
    instagram: "https://www.instagram.com/niniko1003/",
    facebook: "",
    works: [
      { title: "ნაკრები: იხვის წყვილი", color: "#e3d3c2", image: "/artists/nino-handmade/ducks-pair.jpg", width: 720, height: 1280, focal: "50% 35%", price: 150, tags: ["for-kids"], added: "2026-10-28" },
      { title: "ნაკრები: ჟირაფები, ჩხარუნები და სამაგრები", color: "#d9d0c0", image: "/artists/nino-handmade/giraffes-set.jpg", width: 720, height: 960, price: 120, tags: ["for-kids"], added: "2026-10-28" },
      { title: "ნაქსოვი თოჯინა წითელი თმით", color: "#5f7d52", image: "/artists/nino-handmade/red-hair-doll.jpg", width: 720, height: 960, price: 140, tags: ["for-kids"], added: "2026-10-28" },
      { title: "ნაკრები: კურდღელი, სამაგრი და ჩხარუნა, ვარდისფერი", color: "#efd9de", image: "/artists/nino-handmade/bunny-set-pink-34.jpg", width: 1080, height: 1440, price: 120, tags: ["for-kids"], added: "2026-10-28" },
      { title: "ნაკრები: კურდღელი, სამაგრი და ჩხარუნა, იისფერი", color: "#e6dbef", image: "/artists/nino-handmade/bunny-set-purple.jpg", width: 720, height: 960, price: 120, tags: ["for-kids"], added: "2026-10-28" },
      { title: "კურდღელი თეთრ კაბაში", color: "#f0e4e4", image: "/artists/nino-handmade/bunny-white-dress-34.jpg", width: 1080, height: 1440, price: 70, tags: ["for-kids"], added: "2026-10-28" },
      { title: "ნაკრები: კურდღელი და ჩხარუნა", color: "#efd0d7", image: "/artists/nino-handmade/bunny-rattle-pink-34.jpg", width: 1080, height: 1440, price: 120, tags: ["for-kids"], added: "2026-10-28" },
      { title: "ჟირაფი: გოგო ან ბიჭი", color: "#e8cf7a", image: "/artists/nino-handmade/giraffes-plush-pair.jpg", width: 720, height: 960, price: 150, tags: ["for-kids"], added: "2026-10-28" },
      { title: "იხვი ვარდისფერი ბაფთით", color: "#d9a35a", image: "/artists/nino-handmade/duck-bow.jpg", width: 720, height: 960, price: 70, tags: ["for-kids"], added: "2026-10-28" },
    ],
    en: {
      name: "Nino handmade",
      city: "Tbilisi",
      bio: "I am Nino. I crochet toys and almost anything: bunnies, giraffes, ducks, pacifier clips and rattles. For orders, message me on Instagram.",
      workTitles: [
        "Set: a pair of ducks",
        "Set: giraffes, rattles and clips",
        "Crocheted doll with red hair",
        "Set: bunny, clip and rattle, pink",
        "Set: bunny, clip and rattle, purple",
        "Bunny in a white dress",
        "Set: bunny and rattle",
        "Giraffe: girl or boy",
        "Duck with a pink bow",
      ],
    },
  },
  {
    slug: "nene-leather-craft",
    joined: "2026-10-28",
    freeMonths: 3,
    consent: { terms: "2026-10-27", privacy: "2026-10-19", at: "2026-10-27 22:52", offer: "რეგისტრაცია და განთავსება სრულიად უფასოა" },
    name: "NeNe Leather Craft",
    city: "თბილისი",
    categories: ["tyavi", "chantebi"],
    cover: "/artists/nene-leather-craft/bag-red-with-wallet.jpg",
    banner: "/artists/nene-leather-craft/bag-red-with-wallet.jpg",
    bio: "NeNe Leather Craft ამზადებს ნატურალური ტყავის ჩანთებსა და საფულეებს მხოლოდ ხელით. შეკვეთისთვის მომწერეთ ინსტაგრამზე.",
    instagram: "https://www.instagram.com/neneleather/",
    facebook: "https://www.facebook.com/share/1KFbZwPezD/",
    works: [
      { title: "მოზრდილი საფულე ფოთლებით, ორი განყოფილებით", color: "#8a5a34", image: "/artists/nene-leather-craft/wallet-leaves.jpg", width: 1080, height: 1440, price: 60, tags: ["for-her"], added: "2026-10-28" },
      { title: "მოზრდილი საფულე ყვითელი ფოთლებით, ორი განყოფილებით", color: "#8a5a34", image: "/artists/nene-leather-craft/wallet-yellow-leaf.jpg", width: 1080, height: 1441, price: 60, tags: ["for-her"], added: "2026-10-28" },
      { title: "მოზრდილი საფულე გოგრით, ორი განყოფილებით", color: "#b5402c", image: "/artists/nene-leather-craft/wallet-pumpkin.jpg", width: 1080, height: 1420, price: 60, tags: ["for-her"], added: "2026-10-28" },
      { title: "2 განყოფილებიანი საბარათე გვირილებით", color: "#2f5a52", image: "/artists/nene-leather-craft/cardholder-daisies.jpg", width: 1080, height: 1440, price: 30, tags: ["for-her"], added: "2026-10-28" },
      { title: "2 განყოფილებიანი საბარათე ბროწეულით", color: "#53503c", image: "/artists/nene-leather-craft/cardholder-pomegranate.jpg", width: 1080, height: 1329, price: 30, tags: ["for-her"], added: "2026-10-28" },
      { title: "ჩანთა წითელი ტყავის, მოდელი 1", color: "#b02a24", image: "/artists/nene-leather-craft/bag-red-with-wallet.jpg", width: 1080, height: 1767, focal: "50% 55%", price: 139, tags: ["for-her"], added: "2026-10-28" },
      { title: "ნაკრები: ჩანთა და საფულეები", color: "#9a2f35", image: "/artists/nene-leather-craft/set-bag-wallets-34.jpg", width: 1080, height: 1440, tags: ["for-her"], added: "2026-10-28" },
      { title: "ჩანთა ჯაჭვით, წითელი ტყავის", color: "#7f1d2a", image: "/artists/nene-leather-craft/bag-red-chain.jpg", width: 1080, height: 1826, focal: "50% 62%", price: 139, tags: ["for-her"], added: "2026-10-28" },
      { title: "ჩანთა წითელი ტყავის, მოდელი 2", color: "#8a2a22", image: "/artists/nene-leather-craft/bag-red-flowers.jpg", width: 1080, height: 1874, focal: "50% 70%", price: 139, tags: ["for-her"], added: "2026-10-28" },
      { title: "ტყავის ქისა", color: "#a5521f", image: "/artists/nene-leather-craft/pouch-croc.jpg", width: 1080, height: 1441, price: 60, tags: ["for-her"], added: "2026-10-28" },
    ],
    en: {
      name: "NeNe Leather Craft",
      city: "Tbilisi",
      bio: "NeNe Leather Craft makes natural leather bags and wallets by hand only. For orders, message me on Instagram.",
      workTitles: [
        "Large two-compartment wallet with leaves",
        "Large two-compartment wallet with yellow leaves",
        "Large two-compartment wallet with a pumpkin",
        "Two-compartment card holder with daisies",
        "Two-compartment card holder with pomegranates",
        "Red leather bag, model 1",
        "Set: bag and wallets",
        "Red leather bag with a chain",
        "Red leather bag, model 2",
        "Leather drawstring pouch",
      ],
    },
  },
  {
    slug: "ivlisi",
    joined: "2026-10-28",
    freeMonths: 3,
    consent: { terms: "2026-10-27", privacy: "2026-10-19", at: "2026-10-27 22:33", offer: "რეგისტრაცია და განთავსება სრულიად უფასოა" },
    name: "Ivlisi",
    city: "თბილისი",
    categories: ["saxlis-dekori", "skulptura"],
    cover: "/artists/ivlisi/pomegranate-lemons-34.jpg",
    banner: "/artists/ivlisi/pomegranate-lemons-34.jpg",
    bio: "მე ვარ ნათია ზაქარაძე, მარიამის დედა, განათლებით მათემატიკოსი, ყოფილი საბანკო ანალიტიკოსი 20 წლიანი სტაჟით. ახლა ვაკეთებ ხელნაკეთ დეკორაციებსა და სანთლებს: სრულიად ხელნაკეთი სასანთლეები სურნელოვანი სოიოს სანთლის შიგთავსით, სასაჩუქრე შეფუთვით. ჩემთვის მთავარია ხარისხი, კრეატივი და ინდივიდუალიზმი. შეკვეთისთვის მომწერეთ ინსტაგრამზე. „ივლისი“ არის სივრცე, სადაც ხელნაკეთი დეკორაცია, სანთლები და სინათლე ერთიანდება, რათა ყოველდღიურობას მეტი სითბო და სილამაზე შემატოს.",
    instagram: "https://www.instagram.com/ivlisi_/",
    facebook: "https://www.facebook.com/share/19PGx34q7R/",
    works: [
      { title: "ნაკრები: ბროწეულის სანთლები ყვავილებით, ცისფერი", color: "#6cc3c6", image: "/artists/ivlisi/pomegranate-turquoise-flowers-34.jpg", width: 1080, height: 1440, price: 97, tags: ["for-her"], added: "2026-10-28" },
      { title: "ნაკრები: ბროწეულის სანთლები ყვავილებით, მწვანე", color: "#5f9a63", image: "/artists/ivlisi/pomegranate-green-flowers-34.jpg", width: 1080, height: 1440, price: 97, tags: ["for-her"], added: "2026-10-28" },
      { title: "ნაკრები: ბროწეულის სანთლები ორნამენტით, იისფერი", color: "#a367c4", image: "/artists/ivlisi/pomegranate-purple-34.jpg", width: 1080, height: 1440, price: 97, tags: ["for-her"], added: "2026-10-28" },
      { title: "ნაკრები: ბროწეულის სანთლები ორნამენტით, მრავალფერი", color: "#b88a3a", image: "/artists/ivlisi/pomegranate-ornament-34.jpg", width: 1080, height: 1440, price: 97, tags: ["for-her"], added: "2026-10-28" },
      { title: "ნაკრები: ბროწეულის სანთლები ლიმონებით", color: "#5c8a3c", image: "/artists/ivlisi/pomegranate-lemons-34.jpg", width: 1080, height: 1440, price: 97, tags: ["for-her"], added: "2026-10-28" },
      { title: "ნაკრები: ბროწეულის სანთლები ოქროსფერი ფოთლებით, წითელი", color: "#c8281f", image: "/artists/ivlisi/pomegranate-gold-leaves-34.jpg", width: 1080, height: 1440, price: 77, tags: ["for-her"], added: "2026-10-28" },
      { title: "ნაკრები: ბროწეულის სანთლები ოქროსფერი წერტილებით", color: "#c8281f", image: "/artists/ivlisi/pomegranate-gold-dots-34.jpg", width: 1080, height: 1440, price: 77, tags: ["for-her"], added: "2026-10-28" },
      { title: "ნაკრები: ბროწეულის სანთლები ოქროსფერი ზოლით, წითელი", color: "#c8281f", image: "/artists/ivlisi/pomegranate-gold-band-34.jpg", width: 1080, height: 1440, price: 77, tags: ["for-her"], added: "2026-10-28" },
      { title: "ნაკრები: ბროწეულის სანთლები ოქროსფერი ფოთლებით, თეთრი", color: "#efe6dc", image: "/artists/ivlisi/pomegranate-white-gold-34.jpg", width: 1080, height: 1440, price: 77, tags: ["for-her"], added: "2026-10-28" },
      { title: "ნაკრები: ლიმონის ფორმის სანთლები, ყვითელი", color: "#d9c63a", image: "/artists/ivlisi/lemon-yellow-34.jpg", width: 1080, height: 1440, price: 77, tags: ["for-her"], added: "2026-10-28" },
      { title: "ნაკრები: ლაიმის ფორმის სანთლები, მწვანე", color: "#7f9a3f", image: "/artists/ivlisi/lime-green-34.jpg", width: 1080, height: 1440, price: 77, tags: ["for-her"], added: "2026-10-28" },
      { title: "ნაკრები: მანდარინის ფორმის სანთლები, ნარინჯისფერი", color: "#e2682c", image: "/artists/ivlisi/tangerine-orange-34.jpg", width: 1080, height: 1440, price: 77, tags: ["for-her"], added: "2026-10-28" },
      { title: "ნაკრები: ხილის ფორმის სანთლები, წითელი", color: "#c8281f", image: "/artists/ivlisi/lemon-red-34.jpg", width: 1080, height: 1440, price: 77, tags: ["for-her"], added: "2026-10-28" },
      { title: "ნაკრები: სანთლები მზის ორნამენტით, ნაცრისფერ-მწვანე", color: "#8fa79a", image: "/artists/ivlisi/sun-sage.jpg", width: 941, height: 1672, price: 77, tags: ["for-her"], added: "2026-10-28" },
      { title: "ნაკრები: სანთლები მზის ორნამენტით, თეთრი", color: "#efe9de", image: "/artists/ivlisi/sun-white.jpg", width: 1283, height: 2000, price: 77, tags: ["for-her"], added: "2026-10-28" },
      { title: "ნაკრები: სანთლები მზის ორნამენტით, ღია მწვანე", color: "#9acb2f", image: "/artists/ivlisi/sun-green-set-34.jpg", width: 1080, height: 1440, price: 77, tags: ["for-her"], added: "2026-10-28" },
    ],
    en: {
      name: "Ivlisi",
      city: "Tbilisi",
      bio: "I am Natia Zakaradze, Mariam's mother, a mathematician by education and a former banking analyst with 20 years of experience. Now I make handmade decorations and candles: fully handmade candle holders with scented soy candles inside, in gift packaging. What matters most to me is quality, creativity and individuality. For orders, message me on Instagram. “Ivlisi” is a space where handmade decor, candles and light come together to bring more warmth and beauty to everyday life.",
      workTitles: [
        "Set: pomegranate candles with flowers, turquoise",
        "Set: pomegranate candles with flowers, green",
        "Set: pomegranate candles with ornament, purple",
        "Set: pomegranate candles with ornament, multicolour",
        "Set: pomegranate candles with lemons",
        "Set: pomegranate candles with gold leaves, red",
        "Set: pomegranate candles with gold dots",
        "Set: pomegranate candles with a gold band, red",
        "Set: pomegranate candles with gold leaves, white",
        "Set: lemon-shaped candles, yellow",
        "Set: lime-shaped candles, green",
        "Set: tangerine-shaped candles, orange",
        "Set: fruit-shaped candles, red",
        "Set: candles with a sun ornament, grey-green",
        "Set: candles with a sun ornament, white",
        "Set: candles with a sun ornament, light green",
      ],
    },
  },
  {
    slug: "la-arte",
    joined: "2026-10-28",
    freeMonths: 3,
    consent: { terms: "2026-10-28", privacy: "2026-10-19", at: "2026-10-28", offer: "რეგისტრაცია და განთავსება სრულიად უფასოა" },
    name: "La Arté",
    city: "ქუთაისი",
    categories: ["samkauli", "chantebi"],
    cover: "/artists/la-arte/necklace-winged-heart.jpg",
    banner: "/artists/la-arte/necklace-winged-heart.jpg",
    bio: "მე ვარ ლალა თხელიძე, ხელნაკეთი საავტორო ნივთების ბრენდის La Arté-ს დამფუძნებელი. პოლიმერული თიხისგან ვაკეთებ საყურეებს, აქსესუარებსა და ბრელოკებს, ბუნებრივი მინერალებისგან კი საავტორო სამკაულებს. ვმონაწილეობ იმერეთის რეწვის ასოციაციის გამოფენა-გაყიდვებში. შეკვეთისთვის მომწერეთ ინსტაგრამზე.",
    instagram: "https://www.instagram.com/la_arte_jewellery",
    facebook: "https://www.facebook.com/share/18uz7tVed6/",
    works: [
      { title: "ყელსაბამი მარგალიტით, ფრთიანი გული", color: "#e8c7c0", image: "/artists/la-arte/necklace-winged-heart.jpg", width: 1080, height: 1440, tags: ["for-her"], added: "2026-10-28" },
      { title: "ყელსაბამი ლეოპარდის თავით, თეთრი და შავი", color: "#d9cdb8", image: "/artists/la-arte/necklace-leopard.jpg", width: 1080, height: 1439, tags: ["for-her"], added: "2026-10-28" },
      { title: "ყელსაბამი ვარდისფერი მძივებით, მზე", color: "#e6d2c4", image: "/artists/la-arte/necklace-pink-sun.jpg", width: 1080, height: 1439, tags: ["for-her"], added: "2026-10-28" },
      { title: "ყელსაბამი ვარდისფერი მძივებითა და მარგალიტით, გული", color: "#eadbc6", image: "/artists/la-arte/necklace-rose-heart.jpg", width: 1080, height: 1441, tags: ["for-her"], added: "2026-10-28" },
      { title: "ყელსაბამი სადაფის გულებით", color: "#e8d8bb", image: "/artists/la-arte/necklace-pearl-hearts.jpg", width: 1080, height: 1439, tags: ["for-her"], added: "2026-10-28" },
      { title: "ყელსაბამი ამეთვისტოთი და მარგალიტით", color: "#d6c3a7", image: "/artists/la-arte/necklace-amethyst.jpg", width: 1080, height: 1439, tags: ["for-her"], added: "2026-10-28" },
      { title: "ყელსაბამი ბროლისებური მძივებითა და გულით", color: "#6a4a3e", image: "/artists/la-arte/necklace-crystal-heart.jpg", width: 1080, height: 1411, tags: ["for-her"], added: "2026-10-28" },
      { title: "ყელსაბამი ლურჯი ქვებითა და მარგალიტით, „სიცოცხლის ხე“", color: "#8fc3d6", image: "/artists/la-arte/necklace-blue-tree-34.jpg", width: 1080, height: 1440, tags: ["for-her"], added: "2026-10-28" },
      { title: "ყელსაბამი მწვანე ქვებით, გული", color: "#6fa890", image: "/artists/la-arte/necklace-green-heart-34.jpg", width: 1080, height: 1440, tags: ["for-her"], added: "2026-10-28" },
      { title: "ყელსაბამი ვარდისფერ-ნაცრისფერი ქვებით, მზე", color: "#d9b6a4", image: "/artists/la-arte/necklace-sun-beads-34.jpg", width: 1080, height: 1440, tags: ["for-her"], added: "2026-10-28" },
      { title: "საყურეები ლურჯი, ტალღოვანი", color: "#9fb2cf", image: "/artists/la-arte/earrings-blue-ruffle-34.jpg", width: 1080, height: 1440, tags: ["for-her"], added: "2026-10-28" },
      { title: "საყურეები „თაღი“, იისფერი", color: "#cba6d6", image: "/artists/la-arte/earrings-lilac-arch.jpg", width: 1080, height: 1439, tags: ["for-her"], added: "2026-10-28" },
      { title: "საყურეები „მარაო“, შავი, მარგალიტით", color: "#d8c9a8", image: "/artists/la-arte/earrings-black-fan-pearl.jpg", width: 1080, height: 1439, tags: ["for-her"], added: "2026-10-28" },
      { title: "საყურეები ვარდისფერი, ბზინვარებით", color: "#e2b8d4", image: "/artists/la-arte/earrings-pink-draped.jpg", width: 1080, height: 1439, tags: ["for-her"], added: "2026-10-28" },
      { title: "საყურეები „ნახევარმარაო“, შავი", color: "#d9c9a0", image: "/artists/la-arte/earrings-black-half-fan.jpg", width: 1080, height: 1439, tags: ["for-her"], added: "2026-10-28" },
      { title: "საყურეები „გველი“, მწვანე", color: "#bdb184", image: "/artists/la-arte/earrings-snake.jpg", width: 1080, height: 1439, tags: ["for-her"], added: "2026-10-28" },
      { title: "ბრელოკი „ხაჭაპური“", color: "#ece8df", image: "/artists/la-arte/keychain-khachapuri.jpg", width: 1080, height: 1439, tags: ["for-her"], added: "2026-10-28" },
      { title: "ბრელოკი „მანდარინი“, მოდელი 1", color: "#e8e0d4", image: "/artists/la-arte/keychains-tangerine-1.jpg", width: 1080, height: 1439, tags: ["for-her"], added: "2026-10-28" },
      { title: "ბრელოკი „მანდარინი“, მოდელი 2", color: "#e8dfd2", image: "/artists/la-arte/keychains-tangerine-2.jpg", width: 1080, height: 1439, tags: ["for-her"], added: "2026-10-28" },
    ],
    en: {
      name: "La Arté",
      city: "Kutaisi",
      bio: "I am Lala Tkhelidze, founder of La Arté, a brand of handmade original pieces. I make earrings, accessories and keychains from polymer clay and original jewellery from natural minerals. I take part in the exhibitions and sales of the Imereti Crafts Association. For orders, message me on Instagram.",
      workTitles: [
        "Necklace with pearls and a winged heart",
        "Necklace with a leopard head, white and black",
        "Necklace with pink beads and a sun",
        "Necklace with pink beads, pearls and a heart",
        "Necklace with mother-of-pearl hearts",
        "Necklace with amethyst and pearls",
        "Necklace with crystal beads and a heart",
        "Necklace with blue stones and pearls, “tree of life”",
        "Necklace with green stones and a heart",
        "Necklace with pink and grey stones and a sun",
        "Earrings, blue, wavy",
        "Earrings “arch”, lilac",
        "Earrings “fan”, black, with a pearl",
        "Earrings, pink, with shimmer",
        "Earrings “half fan”, black",
        "Earrings “snake”, green",
        "Keychain “khachapuri”",
        "Keychain “tangerine”, model 1",
        "Keychain “tangerine”, model 2",
      ],
    },
  },
  {
    slug: "m-art",
    joined: "2026-10-28",
    freeMonths: 3,
    consent: { terms: "2026-10-28", privacy: "2026-10-19", at: "2026-10-28", offer: "რეგისტრაცია და განთავსება სრულიად უფასოა" },
    name: "m.art",
    city: "თბილისი",
    categories: ["saxlis-dekori"],
    cover: "/artists/m-art/christmas-box.jpg",
    banner: "/artists/m-art/christmas-box.jpg",
    bio: "მე ვარ მარიამ კვიტატიანი, m.art-ის ავტორი. ვაკეთებ ხელნაკეთ სურნელოვან სანთლებს ბუნებრივი სოიოს ცვილისგან, სიმყუდროვისა და სასიამოვნო მომენტებისთვის. ფერს, სურნელსა და დიზაინს თქვენი სურვილით ვარჩევ. შეკვეთისთვის მომწერეთ ინსტაგრამზე.",
    instagram: "https://www.instagram.com/mart.kits",
    facebook: "",
    works: [
      { title: "სანთელი „დათუნია“ ჭიქაში, 200 მლ", color: "#e5b7bd", image: "/artists/m-art/bear-in-glass.jpg", width: 1080, height: 1536, price: 18, tags: ["for-her"], added: "2026-10-28" },
      { title: "სანთელი „ზღვის ვარსკვლავი“", color: "#e8d8bc", image: "/artists/m-art/starfish-candle.jpg", width: 1080, height: 1407, price: 25, tags: ["for-her"], added: "2026-10-28" },
      { title: "სანთელი „ნიჟარა“", color: "#e8d7ba", image: "/artists/m-art/shell-candle.jpg", width: 1080, height: 1391, price: 20, tags: ["for-her"], added: "2026-10-28" },
      { title: "სანთელი „დათუნია“, 6 სმ, ერთი ცალი", color: "#e3a977", image: "/artists/m-art/bears-candles-34.jpg", width: 1080, height: 1440, price: 10, tags: ["for-her"], added: "2026-10-28" },
      { title: "სანთელი „გული“, 5 სმ, ერთი ცალი", color: "#eab98f", image: "/artists/m-art/hearts-candles-34.jpg", width: 1080, height: 1440, price: 5, tags: ["for-her"], added: "2026-10-28" },
      { title: "ნაკრები: საახალწლო სანთლების ყუთი", color: "#c8262c", image: "/artists/m-art/christmas-box.jpg", width: 1080, height: 1365, price: 35, tags: ["for-her"], added: "2026-10-28" },
      { title: "სანთელი „ფიფქი“", color: "#e6d3b8", image: "/artists/m-art/snowflake-candle.jpg", width: 632, height: 803, price: 7, tags: ["for-her"], added: "2026-10-28" },
      { title: "სანთელი „გნომი“", color: "#e8dcc2", image: "/artists/m-art/gnome-candle.jpg", width: 1080, height: 1377, price: 10, tags: ["for-her"], added: "2026-10-29" },
    ],
    en: {
      name: "m.art",
      city: "Tbilisi",
      bio: "I am Mariam Kvitatiani, the maker behind m.art. I make handmade scented candles from natural soy wax, for cosiness and pleasant moments. I choose colour, scent and design to your wishes. For orders, message me on Instagram.",
      workTitles: [
        "Candle “teddy bear” in a glass, 200 ml",
        "Candle “starfish”",
        "Candle “seashell”",
        "Candle “teddy bear”, 6 cm, each",
        "Candle “heart”, 5 cm, each",
        "Set: New Year candle gift box",
        "Candle “snowflake”",
        "Candle “gnome”",
      ],
    },
  },
  {
    slug: "mokazmuli",
    joined: "2026-10-28",
    freeMonths: 3,
    consent: { terms: "2026-10-28", privacy: "2026-10-19", at: "2026-10-28", offer: "რეგისტრაცია და განთავსება სრულიად უფასოა" },
    name: "მოკაზმული",
    city: "გორი",
    categories: ["naqsovi", "chantebi"],
    cover: "/artists/mokazmuli/backpack-granny-yellow-blue.jpg",
    banner: "/artists/mokazmuli/backpack-granny-yellow-blue.jpg",
    bio: "„მოკაზმული“ გორში ნაქსოვი ტანისამოსისა და აქსესუარების მაღაზიაა: ჩანთები, ქუდები, მოსაცმელები და სხვა ნაქსოვი ნივთები. მიწოდება საქართველოს მასშტაბით უფასოა. „მოკაზმული“ - თბილი შეხება, რომელსაც გრძნობ. შეკვეთისთვის მოგვწერეთ ინსტაგრამზე.",
    instagram: "https://www.instagram.com/mokazmuli.crochet",
    facebook: "https://www.facebook.com/share/1EwQ4vabx6/",
    works: [
      { title: "ნაქსოვი ზურგჩანთა, ყვითელ-ლურჯი", color: "#e8c34a", image: "/artists/mokazmuli/backpack-granny-yellow-blue.jpg", width: 1080, height: 1355, price: 89, tags: ["for-her"], added: "2026-10-28" },
      { title: "ნაქსოვი ჩანთა ბორდოსა და ვარდისფერში", color: "#a8324a", image: "/artists/mokazmuli/hobo-burgundy-pink.jpg", width: 1080, height: 1240, price: 99, tags: ["for-her"], added: "2026-10-28" },
      { title: "ნაქსოვი ჩანთა ყვითელ-ნაცრისფერი", color: "#d9a62a", image: "/artists/mokazmuli/hobo-yellow-grey.jpg", width: 1080, height: 1440, price: 99, tags: ["for-her"], added: "2026-10-28" },
      { title: "ნაქსოვი ჩანთა წითელ-ვარდისფერი კვადრატებით", color: "#c9442a", image: "/artists/mokazmuli/tote-granny-red-pink.jpg", width: 1080, height: 1311, price: 120, tags: ["for-her"], added: "2026-10-28" },
      { title: "ნაქსოვი ჩანთა წითელი, ფოჩით", color: "#d4492c", image: "/artists/mokazmuli/bag-red-tassel.jpg", width: 1080, height: 1461, price: 55, tags: ["for-her"], added: "2026-10-28" },
      { title: "ნაქსოვი ჩანთა ხის სახელურით და ბაფთით", color: "#b89a7a", image: "/artists/mokazmuli/bag-wood-handle-bow.jpg", width: 896, height: 1195, price: 59, tags: ["for-her"], added: "2026-10-28" },
      { title: "ნაქსოვი ჩანთა ფოჩებით, ვარდისფერი", color: "#e0a090", image: "/artists/mokazmuli/bag-fringe-pink.jpg", width: 896, height: 1195, price: 55, tags: ["for-her"], added: "2026-10-28" },
      { title: "ბავშვის ნაქსოვი კონვერტი", color: "#eadfc9", image: "/artists/mokazmuli/baby-wrap-star.jpg", width: 864, height: 1152, price: 69, tags: ["for-kids"], added: "2026-10-28" },
      { title: "ნაკრები: ქუდი და თავსაფარი, ბორდო", color: "#8a2a36", image: "/artists/mokazmuli/set-burgundy.jpg", width: 896, height: 1195, price: 55, tags: ["for-her"], added: "2026-10-28" },
      { title: "ნაკრები: ქუდი და თავსაკრავი, მწვანე", color: "#2f5a3f", image: "/artists/mokazmuli/set-green.jpg", width: 896, height: 1195, price: 35, tags: ["for-her"], added: "2026-10-28" },
      { title: "თავსაკრავები, ხუთი ფერი", color: "#a8452f", image: "/artists/mokazmuli/headbands-five-34.jpg", width: 1080, height: 1440, tags: ["for-her"], added: "2026-10-28" },
      { title: "ნაქსოვი ქუდი მძივებით, კრემისფერი", color: "#e8d9bd", image: "/artists/mokazmuli/hat-cream-pearls.jpg", width: 896, height: 1195, tags: ["for-her"], added: "2026-10-28" },
      { title: "ნაქსოვი ქუდი მძივებით, ხორბლისფერი", color: "#c8a46a", image: "/artists/mokazmuli/hat-tan-pearls.jpg", width: 896, height: 1195, price: 35, tags: ["for-her"], added: "2026-10-28" },
      { title: "ნაკრები: ნაქსოვი ქუდები, ვარდისფერი", color: "#e86b9a", image: "/artists/mokazmuli/hats-pink-trio.jpg", width: 720, height: 960, price: 23, tags: ["for-her"], added: "2026-10-28" },
      { title: "ნაკრები: ნაქსოვი ქუდები, ფერადი", color: "#e0a82c", image: "/artists/mokazmuli/hats-bright-four.jpg", width: 738, height: 960, price: 23, tags: ["for-her"], added: "2026-10-28" },
      { title: "ნაკრები: ნაქსოვი ქუდები, თეთრი, ბეჟი, მდოგვისფერი", color: "#c98a2a", image: "/artists/mokazmuli/hats-white-beige-mustard.jpg", width: 1080, height: 1440, price: 23, tags: ["for-her"], added: "2026-10-28" },
      { title: "ნაკრები: ნაქსოვი ქუდები, ბორდო და ვარდისფერი", color: "#a8324a", image: "/artists/mokazmuli/hats-burgundy-pink.jpg", width: 1080, height: 1440, price: 23, tags: ["for-her"], added: "2026-10-28" },
      { title: "ნაკრები: ჩანგლისა და დანის ჩასადებები, 6 ცალი", color: "#c8202a", image: "/artists/mokazmuli/cutlery-set-6-red-white.jpg", width: 1080, height: 1441, price: 34, added: "2026-10-28" },
      { title: "ნაკრები: ჩანგლისა და დანის ჩასადებები, 12 ცალი", color: "#d9d2c4", image: "/artists/mokazmuli/cutlery-set-12-white-bows.jpg", width: 1080, height: 1441, price: 55, added: "2026-10-28" },
      { title: "ჩანგლისა და დანის ჩასადებები, მწვანე ბაფთა, 6 ცალი", color: "#c8202a", image: "/artists/mokazmuli/cutlery-green-bow.jpg", width: 1080, height: 1440, price: 34, added: "2026-10-28" },
      { title: "ჩანგლისა და დანის ჩასადებები, წითელი ბაფთა, 6 ცალი", color: "#d9d2c4", image: "/artists/mokazmuli/cutlery-red-bow.jpg", width: 1080, height: 1441, price: 34, added: "2026-10-28" },
      { title: "ჩანგლისა და დანის ჩასადებები, ნაძვის ხე, 6 ცალი", color: "#c8202a", image: "/artists/mokazmuli/cutlery-tree.jpg", width: 1080, height: 1440, price: 34, added: "2026-10-28" },
      { title: "ჩანგლისა და დანის ჩასადებები, ელფი, 6 ცალი", color: "#7a9a3a", image: "/artists/mokazmuli/cutlery-elf.jpg", width: 1080, height: 1441, price: 34, added: "2026-10-28" },
      { title: "ჩანგლისა და დანის ჩასადებები, ვარდისფერი ღილებით, 6 ცალი", color: "#c99aa6", image: "/artists/mokazmuli/cutlery-gingerbread.jpg", width: 1080, height: 1441, price: 34, added: "2026-10-28" },
      { title: "ჩანგლისა და დანის ჩასადებები, ირემი, 6 ცალი", color: "#c9a97c", image: "/artists/mokazmuli/cutlery-reindeer.jpg", width: 1080, height: 1441, price: 34, added: "2026-10-28" },
      { title: "ნაქსოვი ჟაკეტი გვირილებით, მწვანე (140 ₾-დან)", color: "#7a9a2c", image: "/artists/mokazmuli/cardigan-green-daisies-34.jpg", width: 1080, height: 1440, price: 140, tags: ["for-her"], added: "2026-10-28" },
      { title: "ნაქსოვი ჟაკეტი წითელი ბაფთებით (140 ₾-დან)", color: "#c8202a", image: "/artists/mokazmuli/cardigan-cream-red-bows-34.jpg", width: 1080, height: 1440, price: 140, tags: ["for-her"], added: "2026-10-28" },
      { title: "ნაქსოვი ქუდი მძივებით, იისფერი", color: "#a36fd0", image: "/artists/mokazmuli/hat-purple-pearls-34.jpg", width: 1080, height: 1440, price: 10, tags: ["for-her"], added: "2026-10-28" },
      { title: "ნაქსოვი ჟაკეტი ყვავილებით, ბეჟი", color: "#c9a98a", image: "/artists/mokazmuli/cardigan-flowers-beige.jpg", width: 1080, height: 1398, tags: ["for-her"], added: "2026-10-28" },
    ],
    en: {
      name: "Mokazmuli",
      city: "Gori",
      bio: "Mokazmuli is a shop of knitted clothing and accessories in Gori: bags, hats, wraps and other crocheted pieces. Delivery across Georgia is free. “Mokazmuli” - a warm touch you can feel. For orders, message us on Instagram.",
      workTitles: [
        "Crocheted backpack, yellow and blue",
        "Crocheted bag in burgundy and pink",
        "Crocheted bag, yellow and grey",
        "Crocheted bag with red and pink squares",
        "Crocheted red bag with tassels",
        "Crocheted bag with a wooden handle and a bow",
        "Crocheted pink bag with fringe",
        "Crocheted baby wrap",
        "Set: hat and bandana, burgundy",
        "Set: hat and headband, green",
        "Headbands, five colours",
        "Crocheted hat with beads, cream",
        "Crocheted hat with beads, tan",
        "Set: knitted hats, pink",
        "Set: knitted hats, bright colours",
        "Set: knitted hats, white, beige, mustard",
        "Set: knitted hats, burgundy and pink",
        "Set: cutlery holders, 6 pieces",
        "Set: cutlery holders, 12 pieces",
        "Cutlery holders, green bow, 6 pieces",
        "Cutlery holders, red bow, 6 pieces",
        "Cutlery holders, fir tree, 6 pieces",
        "Cutlery holders, elf, 6 pieces",
        "Cutlery holders, pink with buttons, 6 pieces",
        "Cutlery holders, reindeer, 6 pieces",
        "Knitted cardigan with daisies, green (from 140 GEL)",
        "Knitted cardigan with red bows (from 140 GEL)",
        "Crocheted hat with beads, purple",
        "Knitted cardigan with flowers, beige",
      ],
    },
  },
  {
    slug: "wood-more",
    joined: "2026-10-29",
    freeMonths: 3,
    consent: { terms: "2026-10-27", privacy: "2026-10-19", at: "2026-10-28 10:14", offer: "რეგისტრაცია და განთავსება სრულიად უფასოა" },
    name: "Wood more",
    city: "თბილისი",
    categories: ["khis-nakethobebi"],
    cover: "/artists/wood-more/nardi-portrait.jpg",
    banner: "/artists/wood-more/nardi-portrait.jpg",
    bio: "ყველა დეტალს ხელით ვხატავ და შემდეგ ვკვეთავ ხეზე ❤️ ვაკეთებ ნარდს, ხატის კიოტებს, კვეთილ ტრიბუნებსა და კარებს. შეკვეთისთვის მომწერეთ ფეისბუქზე.",
    instagram: "",
    facebook: "https://www.facebook.com/share/1A3dTdxL7p/",
    works: [
      { title: "ხატის კიოტი, წმინდა ნინო", color: "#c99a35", image: "/artists/wood-more/icon-frame-nino.jpg", width: 720, height: 960, added: "2026-10-29" },
      { title: "ხატის კიოტი, იოანე ნათლისმცემელი", color: "#c9a035", image: "/artists/wood-more/icon-frame-john.jpg", width: 770, height: 960, added: "2026-10-29" },
      { title: "ხატის კიოტები, სამი", color: "#c9972e", image: "/artists/wood-more/icon-frames-three-34.jpg", width: 1080, height: 1440, added: "2026-10-29" },
      { title: "კვეთილი კარი ხატებით და ორნამენტით", color: "#b8683f", image: "/artists/wood-more/royal-doors.jpg", width: 1080, height: 1323, added: "2026-10-29" },
      { title: "კვეთილი ტრიბუნა, ვაზის ორნამენტით", color: "#b9714a", image: "/artists/wood-more/lectern-grapes.jpg", width: 1080, height: 1440, added: "2026-10-29" },
      { title: "ნარდი, მგელი", color: "#7a5a3c", image: "/artists/wood-more/nardi-wolf.jpg", width: 920, height: 1440, price: 800, tags: ["for-him"], added: "2026-10-29" },
      { title: "ნარდი, პორტრეტი და წარწერა", color: "#6f4f33", image: "/artists/wood-more/nardi-portrait.jpg", width: 1080, height: 1440, price: 800, tags: ["for-him"], added: "2026-10-29" },
      { title: "ნარდი, ვაზის კომპოზიცია", color: "#7a5236", image: "/artists/wood-more/nardi-grapes-ornament.jpg", width: 1080, height: 1440, price: 800, tags: ["for-him"], added: "2026-10-29" },
      { title: "ნარდი, ვაზი და ყურძენი", color: "#7b4f32", image: "/artists/wood-more/nardi-grapes-vine-34.jpg", width: 1080, height: 1440, price: 800, tags: ["for-him"], added: "2026-10-29" },
      { title: "ნარდი, ღია ფერის ორნამენტით", color: "#c9b078", image: "/artists/wood-more/nardi-light-ornament.jpg", width: 1080, height: 1440, price: 800, tags: ["for-him"], added: "2026-10-29" },
      { title: "ნარდი, ვარსკვლავითა და ტიტებით", color: "#b07a3a", image: "/artists/wood-more/nardi-star-tulips.jpg", width: 1080, height: 1440, price: 800, tags: ["for-him"], added: "2026-10-29" },
      { title: "ნარდი, ტიტების ორნამენტი", color: "#a0622d", image: "/artists/wood-more/nardi-tulips-checkers.jpg", width: 1080, height: 1440, price: 800, tags: ["for-him"], added: "2026-10-29" },
      { title: "დამის დაფა კვეთით", color: "#8a5a34", image: "/artists/wood-more/dama-board-34.jpg", width: 1080, height: 1440, added: "2026-10-29" },
    ],
    en: {
      name: "Wood more",
      city: "Tbilisi",
      bio: "I draw every detail by hand and then carve it into wood ❤️ I make backgammon sets, icon frames, carved lecterns and doors. For orders, message me on Facebook.",
      workTitles: [
        "Icon frame, Saint Nino",
        "Icon frame, John the Baptist",
        "Icon frames, set of three",
        "Carved door with icons and ornament",
        "Carved lectern with a vine ornament",
        "Backgammon set, wolf",
        "Backgammon set, portrait and inscription",
        "Backgammon set, vine composition",
        "Backgammon set, vine and grapes",
        "Backgammon set, light wood with ornament",
        "Backgammon set, star and tulips",
        "Backgammon set, tulip ornament",
        "Carved draughts board",
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

// ხელოვანის სიებში საჩვენებლად: ყველაზე ახლად დამატებული პირველი (მარცხნივ).
// თარიღი: `joined`, თორემ ყველაზე ადრეული ნამუშევრის `added`; თანაბარისას ფაილში უფრო ქვემოთ ჩაწერილი პირველი
export function newestArtistsFirst<T extends ArtistData>(list: T[]): T[] {
  const time = (artist: T) => {
    if (artist.joined) return Date.parse(artist.joined) || 0;
    const dates = artist.works.map(workAddedTime).filter((n) => n > 0);
    return dates.length ? Math.min(...dates) : 0;
  };
  return list
    .map((artist, i) => ({ artist, i, t: time(artist) }))
    .sort((a, b) => b.t - a.t || b.i - a.i)
    .map((x) => x.artist);
}

// ფოტო ბარათზე (3:4) ბუნდოვანი არ გამოვა: ჰორიზონტალური ან პატარა ფოტო ბარათზე იჭრება და იზრდება, ამიტომ მთავარის „ახალ ნამუშევრებში“ მხოლოდ ასეთი ფოტოები ჩანს.
// წესი: თანაფარდობა 0.4–0.9 და ბარათზე მოხვედრილი ნაწილი სულ მცირე 780 პიქსელი სიგანეში
export function hasCardQualityPhoto(work: ArtistWork): boolean {
  if (work.lowQuality || !work.image || !work.width || !work.height) return false;
  const ratio = work.width / work.height;
  if (ratio < 0.4 || ratio > 0.9) return false;
  const visibleWidth = ratio >= 0.75 ? work.height * 0.75 : work.width;
  return visibleWidth >= 780;
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
