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

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const raw = getCategoryBySlug(slug);
  if (!raw) return {};
  const category = localizeCategory(raw, await getLang());
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

export default async function CategoryPage({ params }: { params: Promise<{ slug: string }> }) {
  const lang = await getLang();
  const t = dictionary[lang];
  const { slug } = await params;
  const raw = getCategoryBySlug(slug);
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
        className="relative isolate overflow-hidden rounded-[1.5rem] text-white shadow-lg lg:rounded-[2rem]"
        style={{
          background: `linear-gradient(135deg, color-mix(in srgb, ${color}, white 14%), ${color} 55%, color-mix(in srgb, ${color}, black 34%))`,
        }}
      >
        {/* დესკტოპი/პლანშეტი: მცურავი ფილა მარჯვნივ, მთლიანად ჩანს */}
        <div aria-hidden className="absolute right-[6%] top-1/2 hidden w-[24%] max-w-[15rem] -translate-y-1/2 sm:block">
          <div
            className="float overflow-hidden rounded-[1.25rem] shadow-2xl ring-4 ring-white/15"
            style={{ ["--r" as string]: "4deg" }}
          >
            <CategoryArt slug={category.slug} color={color} className="aspect-[4/3]" />
          </div>
        </div>
        {/* მობილურზე: პატარა ილუსტრაცია კუთხეში, რომ ტექსტს არ ეფარებოდეს */}
        <div
          aria-hidden
          className="float absolute right-4 top-4 z-10 w-[4.5rem] overflow-hidden rounded-xl shadow-xl ring-2 ring-white/20 sm:hidden"
          style={{ ["--r" as string]: "5deg" }}
        >
          <CategoryArt slug={category.slug} color={color} className="aspect-[4/3]" />
        </div>
        <div
          aria-hidden
          className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-black/10 sm:bg-gradient-to-r sm:from-black/55 sm:via-black/10 sm:to-transparent"
        />
        <div className="relative z-10 flex min-h-[11rem] flex-col justify-center p-5 pr-24 sm:min-h-[15rem] sm:max-w-[64%] sm:px-10 sm:py-8">
          <p className="mb-2 inline-flex w-fit items-center rounded-full border border-white/30 bg-white/10 px-3 py-0.5 text-xs font-medium backdrop-blur-md">
            {t.artists.count(items.length)}
          </p>
          <h1 className="max-w-lg text-balance text-[min(1.625rem,6.4vw)] font-semibold leading-[1.1] tracking-tight sm:text-3xl lg:text-4xl xl:text-5xl">
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
