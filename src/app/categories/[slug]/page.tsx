import { notFound } from "next/navigation";
import ArtistCard from "@/components/ArtistCard";
import CategoryArt from "@/components/CategoryArt";
import { getLocalizedArtists } from "@/data/artists";
import {
  categories,
  categoryColor,
  getCategoryBySlug,
  localizeCategory,
} from "@/data/categories";
import { dictionary } from "@/lib/dictionary";
import { getLang } from "@/lib/i18n";

export function generateStaticParams() {
  return categories.map((category) => ({ slug: category.slug }));
}

export function generateMetadata({ params }: { params: { slug: string } }) {
  const raw = getCategoryBySlug(params.slug);
  if (!raw) return {};
  const category = localizeCategory(raw, getLang());
  return {
    title: category.name,
    description: category.description,
    openGraph: {
      title: category.name,
      description: category.description,
      images: ["/opengraph-image"],
    },
  };
}

export default function CategoryPage({ params }: { params: { slug: string } }) {
  const lang = getLang();
  const t = dictionary[lang];
  const raw = getCategoryBySlug(params.slug);
  if (!raw) notFound();

  const category = localizeCategory(raw, lang);
  const color = categoryColor(category.slug);
  const items = getLocalizedArtists(lang).filter((artist) =>
    artist.categories.includes(category.slug),
  );

  return (
    <div className="mx-auto max-w-7xl px-4 pb-16 pt-6 sm:px-6 sm:pb-24 sm:pt-10 lg:px-10">
      {/* დაბალი ბანერი კატეგორიის ილუსტრაციით */}
      <section
        className="relative isolate overflow-hidden rounded-[2rem] text-white shadow-lg lg:rounded-[2.5rem]"
        style={{
          background: `linear-gradient(135deg, color-mix(in srgb, ${color}, white 14%), ${color} 55%, color-mix(in srgb, ${color}, black 34%))`,
        }}
      >
        <div className="absolute inset-y-0 right-0 hidden w-3/5 [mask-image:linear-gradient(90deg,transparent,#000_30%)] sm:block">
          <CategoryArt
            slug={category.slug}
            color={color}
            className="absolute inset-0 h-full w-full"
          />
        </div>
        {/* მობილურზე: პატარა ილუსტრაცია კუთხეში, რომ ტექსტს არ ეფარებოდეს */}
        <div
          aria-hidden
          className="float absolute right-5 top-5 z-10 w-24 overflow-hidden rounded-2xl shadow-xl ring-2 ring-white/20 sm:hidden"
          style={{ ["--r" as string]: "5deg" }}
        >
          <CategoryArt slug={category.slug} color={color} className="aspect-[4/3]" />
        </div>
        <div
          aria-hidden
          className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-black/10 sm:bg-gradient-to-r sm:from-black/55 sm:via-black/10 sm:to-transparent"
        />
        <div className="relative z-10 flex min-h-[11rem] flex-col justify-end p-6 sm:min-h-[14rem] sm:justify-center sm:p-10">
          <p className="mb-3 inline-flex w-fit items-center rounded-full border border-white/30 bg-white/10 px-3 py-1 text-xs font-medium backdrop-blur-md sm:text-sm">
            {t.artists.count(items.length)}
          </p>
          <h1 className="max-w-lg text-balance text-3xl font-semibold leading-[1.1] tracking-tight sm:text-5xl">
            {category.name}
          </h1>
          <p className="mt-2 max-w-md text-sm text-white/85 sm:text-lg">
            {category.description}
          </p>
        </div>
      </section>

      {items.length === 0 ? (
        <p className="mt-8 rounded-[1.75rem] border border-dashed border-border bg-surface p-10 text-center text-muted">
          {t.categories.empty}
        </p>
      ) : (
        <ul className="stagger mt-6 grid grid-cols-2 gap-3 sm:mt-8 sm:grid-cols-3 sm:gap-4 lg:grid-cols-4 xl:grid-cols-5">
          {items.map((artist) => (
            <li key={artist.slug}>
              <ArtistCard
                artist={artist}
                worksLabel={t.artists.worksCount(artist.works.length)}
              />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
