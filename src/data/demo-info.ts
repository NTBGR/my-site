// DEMO: ფასები და ნიშნულები ნიმუშია (არა ნამდვილი ინფორმაცია), მხოლოდ ეთსის ტიპის გვერდების სანახავად.
// ნამდვილი მონაცემი (artists.ts-ში ნამუშევარზე price, madeToOrder...) ამას გადაფარავს. გამოქვეყნებამდე ეს ფაილი უნდა წაიშალოს.
import type { ArtistWork } from "@/data/artists";

type Info = Pick<ArtistWork, "price" | "size" | "materials" | "madeToOrder" | "isNew" | "unique" | "note">;

export function demoInfo(artistSlug: string, index: number): Info {
  if (artistSlug === "zhuzha-ceramics") {
    const necklace = index < 4;
    return {
      price: necklace ? 85 + index * 10 : 55,
      materials: necklace ? "კერამიკა, ფერადი მძივები, ძაფი" : "კერამიკა, მინანქარი",
      size: necklace ? "სიგრძე ~45 სმ" : "რეგულირებადი ზომა",
      unique: !necklace,
      isNew: index % 3 === 0,
    };
  }
  return {
    price: 35,
    materials: "ხარისხიანი ქაღალდი, ბეჭდვა",
    size: "A3 (29.7 × 42 სმ)",
    madeToOrder: true,
    isNew: index < 3,
  };
}
