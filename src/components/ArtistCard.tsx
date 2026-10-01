import Link from "next/link";
import type { Artist } from "@/data/artists";

export default function ArtistCard({ artist }: { artist: Artist }) {
  return (
    <Link
      href={`/artists/${artist.slug}`}
      className="group block overflow-hidden rounded-2xl border border-[#eadfd3] bg-white shadow-sm transition hover:-translate-y-0.5 hover:border-[#c45c3e]/40 hover:shadow-md"
    >
      <div
        className="h-28 w-full sm:h-32"
        style={{ backgroundColor: artist.works[0]?.color ?? "#c45c3e" }}
        aria-hidden
      />
      <div className="space-y-1 p-4">
        <h3 className="text-lg font-semibold text-[#2c2416] group-hover:text-[#c45c3e]">
          {artist.name}
        </h3>
        <p className="text-sm text-[#6b6258]">
          {artist.city} · {artist.category}
        </p>
      </div>
    </Link>
  );
}
