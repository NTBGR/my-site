"use client";

import { useMemo, useState } from "react";
import type { Artist } from "@/data/artists";
import ArtistCard from "@/components/ArtistCard";
import Chip from "@/components/ui/Chip";

export default function ArtistsFilter({
  artists,
  cities,
  query = "",
}: {
  artists: Artist[];
  cities: string[];
  query?: string;
}) {
  const [city, setCity] = useState("all");

  const filtered = useMemo(() => {
    const q = query.trim().toLocaleLowerCase();
    return artists.filter((artist) => {
      if (city !== "all" && artist.city !== city) return false;
      if (!q) return true;
      return [artist.name, artist.city, artist.category].some((field) =>
        field.toLocaleLowerCase().includes(q),
      );
    });
  }, [artists, city, query]);

  return (
    <div>
      <div className="mb-8 flex flex-wrap gap-2">
        <Chip selected={city === "all"} onClick={() => setCity("all")}>
          ყველა ქალაქი
        </Chip>
        {cities.map((item) => (
          <Chip key={item} selected={city === item} onClick={() => setCity(item)}>
            {item}
          </Chip>
        ))}
      </div>

      {filtered.length === 0 ? (
        <p className="text-muted">
          {query.trim()
            ? `„${query.trim()}“ — ხელოვანი ვერ მოიძებნა.`
            : "ამ ქალაქში ხელოვანი ვერ მოიძებნა."}
        </p>
      ) : (
        <ul className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
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
