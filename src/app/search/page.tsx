import Link from "next/link";
import ArtistCard from "@/components/ArtistCard";
import WorkCard from "@/components/WorkCard";
import { getLocalizedArtists, getWorkEntries } from "@/data/artists";
import { categories, localizeCategory } from "@/data/categories";
import { dictionary } from "@/lib/dictionary";
import { getLang } from "@/lib/i18n";

export async function generateMetadata() {
  return { title: dictionary[await getLang()].searchPage.title, robots: { index: false } };
}

const norm = (text: string) => text.toLowerCase().trim();

export default async function SearchPage({ searchParams }: { searchParams: Promise<{ q?: string | string[] }> }) {
  const lang = await getLang();
  const t = dictionary[lang];
  const { q: rawQ } = await searchParams;
  const q = (Array.isArray(rawQ) ? rawQ[0] : rawQ ?? "").slice(0, 80).trim();
  const needle = norm(q);

  // ძებნა ორივე ენაზე: ქართულად დაწერილი სიტყვა ინგლისურ ვერსიაზეც იპოვის და პირიქით
  const ka = getWorkEntries("ka");
  const en = getWorkEntries("en");
  const categoryText = (slugs: string[]) =>
    slugs.map((slug) => categories.find((c) => c.slug === slug)).filter((c) => !!c).map((c) => `${c.name} ${c.en.name} ${c.maker} ${c.en.maker}`).join(" ");

  const works = getWorkEntries(lang).filter((entry, i) => {
    if (!needle) return true;
    const hay = norm(`${ka[i].work.title} ${en[i].work.title} ${ka[i].artist.name} ${categoryText(entry.artist.categories)}`);
    return hay.includes(needle);
  });

  const artists = needle
    ? getLocalizedArtists(lang).filter((artist) =>
        norm(`${artist.name} ${artist.city} ${categoryText(artist.categories)}`).includes(needle),
      )
    : [];

  return (
    <div className="mx-auto max-w-7xl px-4 pb-16 pt-6 sm:px-6 sm:pb-24 sm:pt-10 lg:px-10">
      <h1 className="text-3xl font-semibold tracking-tight text-text sm:text-4xl">
        {q ? t.searchPage.resultsFor(q) : t.searchPage.allWorks}
      </h1>

      <form action="/search" method="get" role="search" className="mt-5 flex max-w-2xl gap-2">
        <input
          type="search"
          name="q"
          defaultValue={q}
          placeholder={t.searchPage.placeholder}
          aria-label={t.searchPage.placeholder}
          maxLength={80}
          className="h-12 min-w-0 flex-1 rounded-full border border-border bg-surface px-5 text-base text-text placeholder:text-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
        />
        <button
          type="submit"
          className="inline-flex h-12 shrink-0 items-center rounded-full bg-accent px-6 text-sm font-medium text-on-accent transition duration-300 hover:bg-accent-hover"
        >
          {t.searchPage.button}
        </button>
      </form>

      {works.length === 0 && artists.length === 0 ? (
        <div className="mt-8 rounded-[1.75rem] border border-dashed border-border bg-surface p-8 text-center">
          <p className="text-muted">{t.searchPage.none}</p>
          <div className="mt-4 flex flex-wrap justify-center gap-2">
            {categories.map((c) => (
              <Link
                key={c.slug}
                href={`/categories/${c.slug}`}
                className="inline-flex min-h-10 items-center rounded-full border border-border bg-bg px-4 text-sm font-medium text-text transition hover:border-accent hover:text-accent"
              >
                {localizeCategory(c, lang).name}
              </Link>
            ))}
          </div>
        </div>
      ) : null}

      {works.length > 0 ? (
        <section className="mt-8">
          <h2 className="text-xl font-semibold tracking-tight text-text">
            {t.searchPage.works} <span className="text-sm font-normal text-muted">· {t.searchPage.count(works.length)}</span>
          </h2>
          <ul className="mt-4 grid grid-cols-2 gap-x-3 gap-y-5 sm:grid-cols-3 sm:gap-x-4 sm:gap-y-6 lg:grid-cols-4 xl:grid-cols-5">
            {works.map((entry) => (
              <li key={`${entry.artist.slug}-${entry.id}`}>
                <WorkCard entry={entry} />
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      {artists.length > 0 ? (
        <section className="mt-12">
          <h2 className="text-xl font-semibold tracking-tight text-text">{t.searchPage.artists}</h2>
          <ul className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-4 xl:grid-cols-5">
            {artists.map((artist) => (
              <li key={artist.slug}>
                <ArtistCard artist={artist} worksLabel={t.artists.worksCount(artist.works.length)} />
              </li>
            ))}
          </ul>
        </section>
      ) : null}
    </div>
  );
}
