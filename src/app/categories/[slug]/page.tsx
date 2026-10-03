import Link from "next/link";
import { notFound } from "next/navigation";
import ArtistCard from "@/components/ArtistCard";
import PageHeader from "@/components/PageHeader";
import { getLocalizedArtists } from "@/data/artists";
import {
  categories,
  getCategoryBySlug,
  localizeCategory,
} from "@/data/categories";
import { dictionary } from "@/lib/dictionary";
import { getLang } from "@/lib/i18n";

export function generateStaticParams() {
  return categories.map((category) => ({ slug: category.slug }));
}

export default function CategoryPage({ params }: { params: { slug: string } }) {
  const lang = getLang();
  const t = dictionary[lang].categories;
  const raw = getCategoryBySlug(params.slug);
  if (!raw) notFound();

  const category = localizeCategory(raw, lang);
  const items = getLocalizedArtists(lang).filter((artist) =>
    artist.categories.includes(category.slug),
  );

  return (
    <>
      <PageHeader title={category.name} text={category.description}>
        <Link
          href="/categories"
          className="inline-flex items-center gap-2 rounded-full border border-border bg-surface px-5 py-2 text-sm font-medium text-text transition duration-300 hover:-translate-y-0.5 hover:border-accent hover:text-accent"
        >
          {t.back}
        </Link>
      </PageHeader>
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-16">
        {items.length === 0 ? (
          <p className="rounded-[1.75rem] border border-dashed border-border bg-surface p-10 text-center text-muted">
            {t.empty}
          </p>
        ) : (
          <ul className="stagger grid grid-cols-2 gap-3 sm:gap-5 lg:grid-cols-3">
            {items.map((artist) => (
              <li key={artist.slug}>
                <ArtistCard artist={artist} />
              </li>
            ))}
          </ul>
        )}
      </div>
    </>
  );
}
