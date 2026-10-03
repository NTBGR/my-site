import Link from "next/link";
import type { Artist } from "@/data/artists";
import ArtTile, { variantFor } from "@/components/ArtTile";

export default function ArtistCard({ artist }: { artist: Artist }) {
  return (
    <Link
      href={`/artists/${artist.slug}`}
      className="group block rounded-[1.75rem] border border-border bg-surface p-2.5 transition duration-300 hover:-translate-y-1.5 hover:border-accent hover:shadow-xl active:scale-[0.99]"
    >
      <ArtTile
        color={artist.works[0]?.color ?? "#c93f15"}
        variant={variantFor(artist.slug)}
        className="aspect-[4/3] rounded-[1.25rem]"
      >
        <span className="absolute left-3 top-3 rounded-full bg-black/35 px-3 py-1 text-xs font-medium text-white backdrop-blur-md">
          {artist.category}
        </span>
      </ArtTile>
      <div className="flex items-end justify-between gap-3 px-2.5 pb-2 pt-4">
        <div>
          <h3 className="text-lg font-semibold tracking-tight text-text">
            {artist.name}
          </h3>
          <p className="mt-0.5 text-sm text-muted">{artist.city}</p>
        </div>
        <span
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-accent-soft text-accent transition duration-300 group-hover:bg-accent group-hover:text-on-accent"
          aria-hidden
        >
          <span className="arrow-slide">→</span>
        </span>
      </div>
    </Link>
  );
}
