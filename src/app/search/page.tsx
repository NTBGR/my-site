import Link from "next/link";
import ArtistCard from "@/components/ArtistCard";
import WorksBrowser from "@/components/WorksBrowser";
import { toWorkCards } from "@/lib/workCard";
import { getLocalizedArtists, getWorkEntries } from "@/data/artists";
import { categories, localizeCategory } from "@/data/categories";
import { dictionary } from "@/lib/dictionary";
import { getLang } from "@/lib/i18n";

export async function generateMetadata() {
  return { title: dictionary[await getLang()].searchPage.title, robots: { index: false } };
}

const norm = (text: string) => text.toLowerCase().trim();

export default async function SearchPage({ searchParams }: { searchParams: Promise<{ q?: string | string[]; cat?: string | string[]; f?: string | string[] }> }) {
  const lang = await getLang();
  const t = dictionary[lang];
  const { q: rawQ, cat: rawCat, f: rawF } = await searchParams;
  const f = (Array.isArray(rawF) ? rawF[0] : rawF) ?? "";
  const q = (Array.isArray(rawQ) ? rawQ[0] : rawQ ?? "").slice(0, 80).trim();
  const needle = norm(q);
  const catParam = (Array.isArray(rawCat) ? rawCat[0] : rawCat) ?? "";
  const cat = categories.some((c) => c.slug === catParam) ? catParam : "";

  // ძებნა ორივე ენაზე: ქართულად დაწერილი სიტყვა ინგლისურ ვერსიაზეც იპოვის და პირიქით
  const ka = getWorkEntries("ka");
  const en = getWorkEntries("en");
  const categoryText = (slugs: string[]) =>
    slugs.map((slug) => categories.find((c) => c.slug === slug)).filter((c) => !!c).map((c) => `${c.name} ${c.en.name} ${c.maker} ${c.en.maker}`).join(" ");

  const matched = getWorkEntries(lang).filter((entry, i) => {
    if (!needle) return true;
    const hay = norm(`${ka[i].work.title} ${en[i].work.title} ${ka[i].artist.name} ${categoryText(entry.artist.categories)}`);
    return hay.includes(needle);
  });
  const quickTitle: Record<string, string> = { new: t.ui.newWorks, under50: t.ui.collectionUnder50, unique: t.ui.collectionUnique, mto: t.ui.collectionMadeToOrder };
  // კატეგორიის ჩიპები: მხოლოდ ისინი, სადაც შედეგი არის (რაოდენობით)
  const chips = categories
    .map((c) => ({ slug: c.slug, name: localizeCategory(c, lang).name, count: matched.filter((e) => e.artist.categories.includes(c.slug)).length }))
    .filter((c) => c.count > 0);
  const byCat = cat ? matched.filter((e) => e.artist.categories.includes(cat)) : matched;
  const works = byCat.filter((e) => {
    if (f === "under50") return (e.work.price ?? Infinity) < 50;
    if (f === "unique") return !!e.work.unique;
    if (f === "mto") return !!e.work.madeToOrder;
    return true;
  });
  const chipHref = (slug: string) => {
    const params = new URLSearchParams();
    if (q) params.set("q", q);
    if (slug) params.set("cat", slug);
    const qs = params.toString();
    return qs ? `/search?${qs}` : "/search";
  };

  const order = new Map(getWorkEntries(lang).map((e, i) => [`${e.artist.slug}/${e.id}`, i]));
  const cards = toWorkCards(works).map((c) => ({ ...c, order: order.get(c.key) ?? 0 }));
  const artists = needle
    ? getLocalizedArtists(lang).filter((artist) =>
        norm(`${artist.name} ${artist.city} ${categoryText(artist.categories)}`).includes(needle),
      )
    : [];

  return (
    <div className="mx-auto max-w-7xl px-4 pb-16 pt-6 sm:px-6 sm:pb-24 sm:pt-10 lg:px-10">
      <h1 className="text-3xl font-semibold tracking-tight text-text sm:text-4xl">
        {q ? t.searchPage.resultsFor(q) : quickTitle[f] ?? t.searchPage.allWorks}
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

      {chips.length > 1 ? (
        <div className="-mx-4 mt-5 flex gap-2 overflow-x-auto px-4 pb-1 [scrollbar-width:none] sm:mx-0 sm:flex-wrap sm:px-0 [&::-webkit-scrollbar]:hidden" role="group">
          {[{ slug: "", name: t.searchFilters.all, count: matched.length }, ...chips].map((chip) => {
            const active = chip.slug === cat;
            return (
              <Link
                key={chip.slug || "all"}
                href={chipHref(chip.slug)}
                aria-current={active ? "true" : undefined}
                className={`inline-flex min-h-10 shrink-0 items-center whitespace-nowrap rounded-full border px-4 text-sm font-medium transition duration-300 ${
                  active ? "border-transparent bg-accent text-on-accent" : "border-border bg-surface text-text hover:border-accent hover:text-accent"
                }`}
              >
                {chip.name} <span className="ml-1.5 opacity-60">{chip.count}</span>
              </Link>
            );
          })}
        </div>
      ) : null}

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
        <section className="mt-2">
          <WorksBrowser cards={cards} emptyHint={t.searchPage.none} initialSort={f === "new" ? "new" : "relevant"} />
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
