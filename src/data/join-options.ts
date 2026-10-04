import { categories } from "@/data/categories";

// განაცხადის ფორმაში ქალაქს და მიმართულებას ადამიანი ირჩევს და არ წერს, რომ უაზრო ტექსტი არ მოვიდეს.
// ქალაქის მნიშვნელობა (value) ყოველთვის ქართულია, რომ შეტყობინებებში ერთნაირად ჩანდეს.
export const cities: { value: string; en: string }[] = [
  { value: "თბილისი", en: "Tbilisi" },
  { value: "ბათუმი", en: "Batumi" },
  { value: "ქუთაისი", en: "Kutaisi" },
  { value: "რუსთავი", en: "Rustavi" },
  { value: "გორი", en: "Gori" },
  { value: "ზუგდიდი", en: "Zugdidi" },
  { value: "ფოთი", en: "Poti" },
  { value: "თელავი", en: "Telavi" },
  { value: "ახალციხე", en: "Akhaltsikhe" },
  { value: "სიღნაღი", en: "Sighnaghi" },
  { value: "სხვა ქალაქი", en: "Other city" },
];

// მიმართულების მნიშვნელობა: კატეგორიის slug ან "other"
export const OTHER_CATEGORY = "other";

// სერვერზე შესამოწმებლად და შეტყობინებებისთვის: slug → ქართული სახელი
export function categoryNameKa(value: string): string | undefined {
  if (value === OTHER_CATEGORY) return "სხვა";
  return categories.find((c) => c.slug === value)?.name;
}
