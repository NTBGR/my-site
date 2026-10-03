export type Category = {
  slug: string;
  name: string;
  description: string;
};

export const categories: Category[] = [
  {
    slug: "mkhatvari",
    name: "მხატვარი",
    description: "ფერწერა, გრაფიკა და სხვა სახვითი ხელოვნება.",
  },
  {
    slug: "potografi",
    name: "ფოტოგრაფი",
    description: "პორტრეტი, პეიზაჟი და დოკუმენტური ფოტო.",
  },
  {
    slug: "ilustratori",
    name: "ილუსტრატორი",
    description: "წიგნის, პრესისა და ციფრული ილუსტრაცია.",
  },
  {
    slug: "keramikosi",
    name: "კერამიკოსი",
    description: "ხელნაკეთი თიხის ნაკეთობები და ჭურჭელი.",
  },
  {
    slug: "mokandake",
    name: "მოქანდაკე",
    description: "სკულპტურა ქვაში, ხეში და ლითონში.",
  },
];

export function getCategoryBySlug(slug: string) {
  return categories.find((category) => category.slug === slug);
}
