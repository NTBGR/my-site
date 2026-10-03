import Link from "next/link";
import type { Artist } from "@/data/artists";

export default function ArtistCard({ artist }: { artist: Artist }) {
  return (
    <Link
      href={`/artists/${artist.slug}`}
      className="group block overflow-hidden rounded-card border border-border bg-surface shadow-sm transition hover:-translate-y-0.5 hover:border-accent/40 hover:shadow-md"
    >
      <div
        className="h-28 w-full sm:h-32"
        style={{ backgroundColor: artist.works[0]?.color ?? "#c45c3e" }}
        aria-hidden
      />
      <div className="space-y-1 p-4">
        <h3 className="text-lg font-semibold text-text group-hover:text-accent">
          {artist.name}
        </h3>
        <p className="text-sm text-muted">
          {artist.city} · {artist.category}
        </p>
      </div>
    </Link>
  );
}
