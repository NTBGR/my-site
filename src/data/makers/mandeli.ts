import type { ArtistData } from "@/data/artists";

export const mandeli: ArtistData = {
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
    { title: "ხევსურული ნაქარგი პერანგი, ლურჯი", en: "Khevsur embroidered shirt, navy", color: "#2b3350", image: "/artists/mandeli/navy-tunic.jpg", width: 1080, height: 1620, price: 1700, tags: ["for-her"], added: "2026-10-27" },
    { title: "ხევსურული ნაქარგი პერანგი, შავი", en: "Khevsur embroidered shirt, black", color: "#2a2424", image: "/artists/mandeli/black-shirt.jpg", width: 900, height: 2000, focal: "50% 58%", price: 1200, tags: ["for-her"], added: "2026-10-27" },
    { title: "თეთრი ჩოხა ორნამენტით", en: "White chokha with ornament", color: "#e8e1d4", image: "/artists/mandeli/white-chokha.jpg", width: 900, height: 2000, price: 500, tags: ["for-her"], added: "2026-10-27" },
    { title: "შავი ჟილეტი ჯვრის ნაქარგით", en: "Black vest with embroidered cross", color: "#23252e", image: "/artists/mandeli/embroidered-vest.jpg", width: 900, height: 2000, price: 300, tags: ["for-her"], added: "2026-10-27" },
  ],
  en: {
    name: "Mandeli",
    city: "Akhmeta",
    bio: "I embroider Khevsur clothing with traditional ornaments and colours: shirts, vests and other embroidered pieces. I also sew chokhas. For orders, sizes and colours, message me on Instagram.",
  },
};
