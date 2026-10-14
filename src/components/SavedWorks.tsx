"use client";

import Link from "next/link";
import ArtTile from "@/components/ArtTile";
import HeartButton from "@/components/HeartButton";
import { useT } from "@/components/LangProvider";
import Photo from "@/components/Photo";
import { useFavorites } from "@/lib/favorites";

export type SavedCard = {
  key: string; // "ავტორი/ნამუშევარი"
  title: string;
  artistName: string;
  artistSlug: string;
  image?: string;
  color: string;
};

// შენახული ნამუშევრები (ბრაუზერიდან): ბარათზე დაჭერა ხელოვანის გვერდზე გადადის
export default function SavedWorks({ cards }: { cards: SavedCard[] }) {
  const t = useT().savedPage;
  const { list } = useFavorites();
  const saved = cards.filter((card) => list.includes(card.key));

  if (saved.length === 0) {
    return (
      <div className="mt-8 rounded-[1.75rem] border border-dashed border-border bg-surface p-8 text-center">
        <p className="mx-auto max-w-md text-muted">{t.empty}</p>
        <Link
          href="/artists"
          className="mt-5 inline-flex min-h-11 items-center rounded-full bg-accent px-6 text-sm font-medium text-on-accent transition duration-300 hover:bg-accent-hover"
        >
          {t.browse}
        </Link>
      </div>
    );
  }
  return (
    <>
      <ul className="mt-6 grid grid-cols-2 gap-x-3 gap-y-5 sm:grid-cols-3 sm:gap-x-4 sm:gap-y-6 lg:grid-cols-4 xl:grid-cols-5">
        {saved.map((card) => (
          <li key={card.key} className="group relative">
            <Link href={`/artists/${card.artistSlug}`} className="block">
              <span className="relative block aspect-[3/4] w-full overflow-hidden rounded-[1.25rem] bg-surface-2 shadow-sm">
                {card.image ? (
                  <Photo src={card.image} alt={`${card.title} - ${card.artistName}`} sizes="(min-width:1280px) 240px, (min-width:1024px) 23vw, (min-width:640px) 31vw, 46vw" hoverZoom />
                ) : (
                  <ArtTile color={card.color} variant={0} className="absolute inset-0 h-full w-full" />
                )}
              </span>
              <span className="mt-2 block line-clamp-3 h-[4.5em] sm:line-clamp-2 sm:h-[3em] px-1 text-sm font-medium leading-snug text-text sm:text-base">{card.title}</span>
              <span className="block truncate px-1 text-xs text-muted sm:text-sm">{card.artistName}</span>
            </Link>
            <HeartButton
              id={card.key}
              className="absolute right-2 top-2 z-10 h-9 w-9 bg-white/90 text-text shadow-sm backdrop-blur transition after:absolute after:-inset-1 after:content-[''] hover:text-accent"
            />
          </li>
        ))}
      </ul>
      <p className="mt-8 text-xs text-muted">{t.note}</p>
    </>
  );
}
