import type { ArtistData } from "@/data/artists";

export const natiartSpace: ArtistData = {
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
    { title: "საეკლესიო ნაკრები „ოვალური ლანგარი“", en: "Church set \"Oval Tray\"", color: "#d9c7b0", image: "/artists/natiart-space/set-oval-tray.jpg", width: 1086, height: 1448, price: 25, added: "2026-10-24" },
    { title: "საეკლესიო ნაკრები „ანგელოზები“", en: "Church set \"Angels\"", color: "#d8cfc2", image: "/artists/natiart-space/set-angels.jpg", width: 1200, height: 1600, price: 35, added: "2026-10-24" },
    { title: "საეკლესიო ნაკრები „ანგელოზი და ქილა“", en: "Church set \"Angel and Jar\"", color: "#d9d4cb", image: "/artists/natiart-space/set-angel-jar.jpg", width: 1200, height: 1600, price: 30, added: "2026-10-24" },
    { title: "საეკლესიო ნაკრები „გული“", en: "Church set \"Heart\"", color: "#e3d9cc", image: "/artists/natiart-space/set-heart.jpg", width: 1086, height: 1448, price: 40, added: "2026-10-24" },
    { title: "საეკლესიო ნაკრები „ოქროს ფანტელები“", en: "Church set \"Gold Flakes\"", color: "#d9b894", image: "/artists/natiart-space/set-gold-flakes.jpg", width: 1086, height: 1448, price: 45, added: "2026-10-24" },
    { title: "საეკლესიო ნაკრები „მძივებიანი ლანგარი“", en: "Church set \"Beaded Tray\"", color: "#e2d6c6", image: "/artists/natiart-space/set-beaded-tray.jpg", width: 843, height: 1124, price: 50, added: "2026-10-24" },
    { title: "საეკლესიო ნაკრები „დიდი ჯამი“", en: "Church set \"Large Bowl\"", color: "#e4dccf", image: "/artists/natiart-space/set-big-bowl.jpg", width: 843, height: 1124, price: 50, added: "2026-10-24" },
    { title: "საეკლესიო ნაკრები „ქილა სახურავით“", en: "Church set \"Lidded Jar\"", color: "#cdb9a2", image: "/artists/natiart-space/set-lidded-jar.jpg", width: 896, height: 1195, price: 45, added: "2026-10-24" },
  ],
  en: {
    name: "NatiArt Space",
    city: "Gori",
    bio: "I believe every home needs a corner where calm and light come from. That is why I make handmade plaster pieces, mostly church sets and refined decorations. I want you to feel in my work the warmth and care I put into making it. It is not just decor, it is a story made with heart for your family.",
  },
};
