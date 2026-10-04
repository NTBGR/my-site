"use client";

import { useMemo, useState } from "react";
import type { Artist } from "@/data/artists";
import ArtistCard from "@/components/ArtistCard";
import { useT } from "@/components/LangProvider";

// ამაზე ნაკლებ ხელოვანზე კატეგორიების ფილტრი დამალულია
const MIN_ARTISTS_FOR_FILTER = 6;

const chipBase =
  "inline-flex min-h-10 shrink-0 items-center whitespace-nowrap rounded-full border px-4 text-sm font-medium transition duration-300 active:scale-95";

export default function ArtistsFilter({
  artists,
  crafts,
  initialQuery = "",
}: {
  artists: Artist[];
  // ფილტრი საიტის კატეგორიებით (მხოლოდ ის, სადაც ხელოვანი არის)
  crafts: { slug: string; name: string }[];
  initialQuery?: string;
}) {
  const t = useT().artists;
  const [query, setQuery] = useState(initialQuery);
  const [craft, setCraft] = useState("all");

  const filtered = useMemo(() => {
    const needle = query.trim().toLowerCase();
    return artists.filter((artist) => {
      if (craft !== "all" && !artist.categories.includes(craft)) return false;
      return !needle || artist.name.toLowerCase().includes(needle);
    });
  }, [artists, craft, query]);

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

      {filtered.length === 0 ? (
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
      )}
    </div>
  );
}
