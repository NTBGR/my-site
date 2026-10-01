"use client";

import { useMemo, useState } from "react";
import type { Artist } from "@/data/artists";
import ArtistCard from "@/components/ArtistCard";

export default function ArtistsFilter({
  artists,
  cities,
}: {
  artists: Artist[];
  cities: string[];
}) {
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
          className={`rounded-full px-4 py-2 text-sm transition ${
            city === "all"
              ? "bg-[#c45c3e] text-white"
              : "bg-white text-[#4a4033] ring-1 ring-[#eadfd3] hover:ring-[#c45c3e]/50"
          }`}
        >
          ყველა ქალაქი
        </button>
        {cities.map((item) => (
          <button
            type="button"
            key={item}
            onClick={() => setCity(item)}
            className={`rounded-full px-4 py-2 text-sm transition ${
              city === item
                ? "bg-[#c45c3e] text-white"
                : "bg-white text-[#4a4033] ring-1 ring-[#eadfd3] hover:ring-[#c45c3e]/50"
            }`}
          >
            {item}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <p className="text-[#5c5348]">ამ ქალაქში ხელოვანი ვერ მოიძებნა.</p>
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
