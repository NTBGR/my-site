import Link from "next/link";
import { categories } from "@/data/categories";
import { artists } from "@/data/artists";

export const metadata = {
  title: "კატეგორიები",
};

export default function CategoriesPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 sm:py-16">
      <h1 className="text-3xl font-semibold text-[#2c2416] sm:text-4xl">
        კატეგორიები
      </h1>
      <p className="mt-3 max-w-2xl text-[#5c5348]">
        აირჩიე კატეგორია და ნახე ამ ტიპის ნივთების ავტორები.
      </p>

      <ul className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {categories.map((category) => {
          const count = artists.filter(
            (artist) => artist.categories.includes(category.slug),
          ).length;
          return (
            <li key={category.slug}>
              <Link
                href={`/categories/${category.slug}`}
                className="group block h-full rounded-2xl border border-[#eadfd3] bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:border-[#c45c3e]/40 hover:shadow-md"
              >
                <h2 className="text-lg font-semibold text-[#2c2416] group-hover:text-[#c45c3e]">
                  {category.name}
                </h2>
                <p className="mt-2 text-sm leading-relaxed text-[#5c5348]">
                  {category.description}
                </p>
                <p className="mt-4 text-sm text-[#6b6258]">
                  {count} ხელოვანი
                </p>
              </Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
