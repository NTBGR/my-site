"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import type { Artist } from "@/data/artists";
import ArtistCard from "@/components/ArtistCard";
import WorksGallery, { type GalleryWork } from "@/components/WorksGallery";
import type { SearchItem } from "@/lib/searchIndex";
import { useT } from "@/components/LangProvider";
import { scoreText } from "@/lib/searchMatch";

// ამაზე ნაკლებ ხელოვანზე კატეგორიების ფილტრი დამალულია
const MIN_ARTISTS_FOR_FILTER = 6;

const chipBase =
  "inline-flex min-h-10 shrink-0 items-center whitespace-nowrap rounded-full border px-4 text-sm font-medium transition duration-300 active:scale-95";

export default function ArtistsFilter({
  artists,
  crafts,
  initialQuery = "",
  searchTexts = {},
  workSearch = [],
  gifts = [],
}: {
  artists: Artist[];
  // ფილტრი საიტის კატეგორიებით (მხოლოდ ის, სადაც ხელოვანი არის)
  crafts: { slug: string; name: string }[];
  initialQuery?: string;
  // ძებნის ტექსტი თითო ხელოვანზე: სახელი, ქალაქი, კატეგორია, ნამუშევრების სახელები (ორივე ენაზე)
  searchTexts?: Record<string, string>;
  // ნამუშევრები ძებნისთვის: ტექსტი (სახელი ორივე ენაზე + ავტორი), კატეგორიები და ბარათი
  workSearch?: { text: string; categories: string[]; gallery: GalleryWork }[];
  // საჩუქრის თაგები (ძებნის სიტყვებით): ძებნაზე „დედისთვის“, „ბავშვი“ და ა.შ. შესაბამისი საჩუქრის გვერდი ჩანს
  gifts?: SearchItem[];
}) {
  const all = useT();
  const t = all.artists;
  const [query, setQuery] = useState(initialQuery);
  const [craft, setCraft] = useState("all");

  // ძებნა: ტრანსლიტერაციით („zhu“, „bechedi“) და ნამუშევრის სახელითაც; საუკეთესო დამთხვევა ზემოთ
  const filtered = useMemo(() => {
    const needle = query.trim();
    const list = artists.filter((artist) => craft === "all" || artist.categories.includes(craft));
    if (!needle) return list;
    return list
      .map((artist) => ({ artist, score: scoreText(searchTexts[artist.slug] ?? artist.name, needle) }))
      .filter((x) => x.score > 0)
      .sort((a, b) => b.score - a.score)
      .map((x) => x.artist);
  }, [artists, craft, query, searchTexts]);

  // ნამუშევრები, რომლებიც ძებნას ემთხვევა (საუკეთესო დამთხვევა პირველი); ძებნის გარეშე არაფერი ჩანს
  const matchedWorks = useMemo(() => {
    const needle = query.trim();
    if (!needle) return [];
    return workSearch
      .filter((item) => craft === "all" || item.categories.includes(craft))
      .map((item) => ({ item, score: scoreText(item.text, needle) }))
      .filter((x) => x.score > 0)
      .sort((a, b) => b.score - a.score)
      .map((x) => x.item.gallery);
  }, [workSearch, craft, query]);

  const giftHits = useMemo(() => {
    const needle = query.trim();
    if (needle.length < 2) return [];
    return gifts.filter((gift) => scoreText(gift.text, needle) > 0).slice(0, 3);
  }, [gifts, query]);

  const filtersActive = craft !== "all" || query.trim() !== "";

  function reset() {
    setCraft("all");
    setQuery("");
  }

  return (
    <div>
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative w-full sm:max-w-xs">
          <svg
            viewBox="0 0 24 24"
            className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            aria-hidden
          >
            <circle cx="11" cy="11" r="6.5" />
            <path strokeLinecap="round" d="M16.5 16.5 20 20" />
          </svg>
          <input
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder={t.searchPlaceholder}
            aria-label={t.searchPlaceholder}
            className="h-11 w-full rounded-full border border-border bg-surface pl-11 pr-4 text-base text-text transition-shadow placeholder:text-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent sm:text-sm"
          />
        </div>
        <p className="text-sm text-muted" aria-live="polite">
          {t.count(filtered.length)}
        </p>
      </div>

      {/* მიმართულების ღილაკები: მხოლოდ მაშინ, როცა ხელოვანები საკმარისად ბევრია (ორ-სამ ხელოვანზე ფილტრი უსარგებლოა) */}
      {artists.length >= MIN_ARTISTS_FOR_FILTER ? (
      <div
        className="-mx-4 mt-4 flex gap-2 overflow-x-auto px-4 pb-1 [scrollbar-width:none] sm:mx-0 sm:flex-wrap sm:overflow-visible sm:px-0 [&::-webkit-scrollbar]:hidden"
        role="group"
      >
        {[{ slug: "all", name: t.allCrafts }, ...crafts].map((item) => {
          const active = craft === item.slug;
          return (
            <button
              key={item.slug}
              type="button"
              aria-pressed={active}
              onClick={() => setCraft(item.slug)}
              className={`${chipBase} ${
                active
                  ? "border-transparent bg-accent text-on-accent"
                  : "border-border bg-surface text-text hover:border-accent hover:text-accent"
              }`}
            >
              {item.name}
            </button>
          );
        })}
      </div>
      ) : null}

      {giftHits.length > 0 ? (
        <div className="mt-5 flex flex-wrap items-center gap-2">
          <span className="text-sm text-muted">{all.artists.giftIdeas}:</span>
          {giftHits.map((gift) => (
            <Link
              key={gift.href}
              href={gift.href}
              className="inline-flex min-h-10 items-center rounded-full border border-border bg-surface px-4 text-sm font-medium text-text transition hover:border-accent hover:text-accent"
            >
              {gift.label}
            </Link>
          ))}
        </div>
      ) : null}

      {filtered.length === 0 && matchedWorks.length === 0 && giftHits.length === 0 ? (
        <div className="mt-8 rounded-[1.75rem] border border-dashed border-border bg-surface p-10 text-center">
          <p className="text-muted">{t.empty}</p>
          {filtersActive ? (
            <button
              type="button"
              onClick={reset}
              className="mt-4 inline-flex min-h-10 items-center rounded-full border border-border bg-surface px-5 text-sm font-medium text-text transition hover:border-accent hover:text-accent active:scale-95"
            >
              {t.reset}
            </button>
          ) : null}
        </div>
      ) : (
        <>
        {filtered.length > 0 ? (
        <>
        {matchedWorks.length > 0 ? (
          <h2 className="mt-8 text-xl font-semibold tracking-tight text-text sm:text-2xl">{all.nav.artists}</h2>
        ) : null}
        <ul
          key={`${craft}-${query}`}
          className="stagger mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-4 xl:grid-cols-5"
        >
          {filtered.map((artist) => (
            <li key={artist.slug}>
              <ArtistCard
                artist={artist}
                worksLabel={t.worksCount(artist.works.length)}
              />
            </li>
          ))}
        </ul>
        </>
        ) : null}
        {matchedWorks.length > 0 ? (
          <section className="mt-10">
            <h2 className="text-xl font-semibold tracking-tight text-text sm:text-2xl">{all.artist.works}</h2>
            <div className="mt-4">
              <WorksGallery works={matchedWorks} showSort={false} />
            </div>
          </section>
        ) : null}
        </>
      )}
    </div>
  );
}
