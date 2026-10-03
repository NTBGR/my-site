import Link from "next/link";
import type { Artist } from "@/data/artists";
import ArtTile, { variantFor } from "@/components/ArtTile";

export default function ArtistCard({ artist }: { artist: Artist }) {
  return (
    <Link
      href={`/artists/${artist.slug}`}
      className="group block rounded-[1.5rem] border border-border bg-surface p-2 transition sm:rounded-[1.75rem] sm:p-2.5 duration-300 hover:-translate-y-1.5 hover:border-accent hover:shadow-xl active:scale-[0.99]"
    >
      <ArtTile
        color={artist.works[0]?.color ?? "#c93f15"}
        variant={variantFor(artist.slug)}
        className="aspect-[4/5] rounded-[1.1rem] sm:aspect-[4/3] sm:rounded-[1.25rem]"
      >
        <span className="absolute left-2 top-2 rounded-full bg-black/35 px-2.5 py-1 text-[11px] font-medium sm:left-3 sm:top-3 sm:px-3 sm:text-xs text-white backdrop-blur-md">
          {artist.category}
        </span>
      </ArtTile>
      <div className="flex items-end justify-between gap-3 px-1.5 pb-1.5 pt-3 sm:px-2.5 sm:pb-2 sm:pt-4">
        <div>
          <h3 className="text-[15px] font-semibold leading-snug tracking-tight text-text sm:text-lg">
            {artist.name}
          </h3>
          <p className="mt-0.5 text-sm text-muted">{artist.city}</p>
        </div>
        <span
          className="hidden h-9 w-9 shrink-0 items-center justify-center rounded-full bg-accent-soft sm:flex text-accent transition duration-300 group-hover:bg-accent group-hover:text-on-accent"
          aria-hidden
        >
          <span className="arrow-slide">→</span>
        </span>
      </div>
    </Link>
  );
}
