import Link from "next/link";
import { notFound } from "next/navigation";
import ArtistCard from "@/components/ArtistCard";
import { artists } from "@/data/artists";
import { categories, getCategoryBySlug } from "@/data/categories";

export function generateStaticParams() {
  return categories.map((category) => ({ slug: category.slug }));
}

export default function CategoryPage({ params }: { params: { slug: string } }) {
  const category = getCategoryBySlug(params.slug);
  if (!category) notFound();

  const items = artists.filter((artist) => artist.category === category.name);

  return (
    <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 sm:py-16">
      <Link href="/categories" className="text-sm text-[#c45c3e] hover:underline">
        ← ყველა კატეგორია
      </Link>
      <h1 className="mt-4 text-3xl font-semibold text-[#2c2416] sm:text-4xl">
        {category.name}
      </h1>
      <p className="mt-3 max-w-2xl text-[#5c5348]">{category.description}</p>

      {items.length === 0 ? (
        <p className="mt-8 text-[#5c5348]">ამ კატეგორიაში ხელოვანი ჯერ არ არის.</p>
      ) : (
        <ul className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((artist) => (
            <li key={artist.slug}>
              <ArtistCard artist={artist} />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
