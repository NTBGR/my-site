"use client";

import { useMemo, useState } from "react";
import type { Artist } from "@/data/artists";
import ArtistCard from "@/components/ArtistCard";
import { useT } from "@/components/LangProvider";

export default function ArtistsFilter({
  artists,
  cities,
}: {
  artists: Artist[];
  cities: string[];
}) {
  const t = useT().artists;
  const [city, setCity] = useState("all");

  const filtered = useMemo(() => {
    if (city === "all") return artists;
    return artists.filter((artist) => artist.city === city);
  }, [artists, city]);

  return (
    <div>
      <div className="mb-8 flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => setCity("all")}
          className={`rounded-full px-5 py-2.5 text-sm font-medium transition duration-300 active:scale-95 ${
            city === "all"
              ? "bg-accent text-on-accent"
              : "bg-surface text-muted ring-1 ring-border hover:text-accent hover:ring-accent"
          }`}
        >
          {t.allCities}
        </button>
        {cities.map((item) => (
          <button
            type="button"
            key={item}
            onClick={() => setCity(item)}
            className={`rounded-full px-5 py-2.5 text-sm font-medium transition duration-300 active:scale-95 ${
              city === item
                ? "bg-accent text-on-accent"
                : "bg-surface text-muted ring-1 ring-border hover:text-accent hover:ring-accent"
            }`}
          >
            {item}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <p className="text-muted">{t.emptyCity}</p>
      ) : (
        <ul
          key={city}
          className="stagger grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3"
        >
          {filtered.map((artist) => (
            <li key={artist.slug}>
              <ArtistCard artist={artist} />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
