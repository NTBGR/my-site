export type Category = {
  slug: string;
  name: string;
  description: string;
};

export const categories: Category[] = [
  {
    slug: "nakhatebi",
    name: "ნახატები",
    description: "ტილო, აკვარელი და გრაფიკა ორიგინალ ნამუშევრებად.",
  },
  {
    slug: "bechdebi",
    name: "ბეჭდები",
    description: "ხელნაკეთი ბეჭდები ვერცხლში, ოქროსა და ქვებით.",
  },
  {
    slug: "keramika",
    name: "კერამიკა და ჭურჭელი",
    description: "ხელნაკეთი თიხის თასები, ლანგრები და ვაზები.",
  },
  {
    slug: "skulptura",
    name: "სკულპტურა და ფიგურები",
    description: "ქვის, ხისა და ლითონის ფიგურები და კომპოზიციები.",
  },
  {
    slug: "samkauli",
    name: "სამკაული",
    description: "ხელნაკეთი სამკაული ვერცხლში, ოქროსა და სხვა მასალაში.",
  },
  {
    slug: "tekstili",
    name: "ტექსტილი",
    description: "შარფები, ხალიჩები, ნაქარგი და ქსოვილზე დაბეჭდილი ნივთები.",
  },
  {
    slug: "tyavi",
    name: "ტყავის ნაწარმი",
    description: "ხელნაკეთი ჩანთები, საფულეები და აქსესუარები.",
  },
  {
    slug: "khis-nakethobebi",
    name: "ხის ნაკეთობები",
    description: "კოვზები, დაფები, ყუთები და სხვა ხის ნივთები.",
  },
  {
    slug: "saxlis-dekori",
    name: "სახლის დეკორი",
    description: "სანთლები, ვაზები, ჩარჩოები და სხვა ინტერიერის ნივთები.",
  },
  {
    slug: "sachuqrebi",
    name: "საჩუქრები და ბარათები",
    description: "ხელნაკეთი ბარათები და პატარა საჩუქრები.",
  },
];

export function getCategoryBySlug(slug: string) {
  return categories.find((category) => category.slug === slug);
}
