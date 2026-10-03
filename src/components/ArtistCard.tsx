import Link from "next/link";
import type { Artist } from "@/data/artists";
import ArtTile, { variantFor } from "@/components/ArtTile";

export default function ArtistCard({
  artist,
  worksLabel,
  artClassName = "aspect-[4/5]",
}: {
  artist: Artist;
  worksLabel?: string;
  artClassName?: string;
}) {
  return (
    <Link
      href={`/artists/${artist.slug}`}
      className="group block rounded-[1.5rem] border border-border bg-surface p-2 transition duration-300 hover:-translate-y-1.5 hover:border-accent hover:shadow-xl active:scale-[0.99] sm:rounded-[1.75rem] sm:p-2.5"
    >
      <ArtTile
        color={artist.works[0]?.color ?? "#c93f15"}
        variant={variantFor(artist.slug)}
        className={`${artClassName} rounded-[1.1rem] sm:rounded-[1.25rem]`}
      >
        <span className="absolute left-2 top-2 rounded-full bg-black/35 px-2.5 py-1 text-[11px] font-medium text-white backdrop-blur-md sm:left-3 sm:top-3 sm:px-3 sm:text-xs">
          {artist.category}
        </span>
      </ArtTile>
      <div className="flex items-end justify-between gap-3 px-1.5 pb-1.5 pt-3 sm:px-2.5 sm:pb-2 sm:pt-4">
        <div className="min-w-0">
          <h3 className="text-[15px] font-semibold leading-snug tracking-tight text-text sm:text-lg">
            {artist.name}
          </h3>
          {worksLabel ? (
            <p className="mt-0.5 text-xs text-muted sm:text-sm">{worksLabel}</p>
          ) : null}
        </div>
        <span
          className="hidden h-9 w-9 shrink-0 items-center justify-center rounded-full bg-accent-soft text-accent transition duration-300 group-hover:bg-accent group-hover:text-on-accent sm:flex"
          aria-hidden
        >
          <span className="arrow-slide">→</span>
        </span>
      </div>
    </Link>
  );
}
