import Image from "next/image";
import Link from "next/link";
import ArtTile from "@/components/ArtTile";
import HeartButton from "@/components/HeartButton";
import type { WorkEntry } from "@/data/artists";

// ბარათისთვის საჭირო მინიმალური მონაცემი (კლიენტის გვერდებზე ზედმეტი ტექსტი არ გადავიდეს)
export type WorkCardData = {
  key: string; // "ავტორი/ნამუშევარი": შენახვისთვის
  href: string;
  title: string;
  artistName: string;
  image?: string;
  color: string;
};

export function toWorkCard(entry: WorkEntry): WorkCardData {
  return {
    key: `${entry.artist.slug}/${entry.id}`,
    href: `/works/${entry.artist.slug}/${entry.id}`,
    title: entry.work.title,
    artistName: entry.artist.name,
    image: entry.work.image,
    color: entry.work.color,
  };
}

// ნამუშევრის ბარათი: ფოტო, სახელი და ავტორი; იხსნება ნამუშევრის საკუთარ გვერდზე, ზემოთ გულის ღილაკი
export default function WorkCard({ card }: { card: WorkCardData }) {
  return (
    <div className="group relative">
      <Link href={card.href} className="block">
        <span className="relative block aspect-[3/4] w-full overflow-hidden rounded-[1.25rem] bg-surface shadow-sm transition duration-300 group-hover:-translate-y-1 group-hover:shadow-2xl sm:rounded-[1.5rem]">
          {card.image ? (
            <Image
              src={card.image}
              alt={card.title}
              fill
              sizes="(min-width: 1280px) 240px, (min-width: 1024px) 22vw, (min-width: 640px) 33vw, 50vw"
              className="object-cover transition duration-300 group-hover:scale-[1.04]"
            />
          ) : (
            <ArtTile color={card.color} variant={0} className="absolute inset-0 h-full w-full" />
          )}
        </span>
        <span className="mt-2 block px-1 text-sm font-medium leading-snug text-text transition-colors group-hover:text-accent sm:text-base">
          {card.title}
        </span>
        <span className="block px-1 text-xs text-muted sm:text-sm">{card.artistName}</span>
      </Link>
      <HeartButton
        id={card.key}
        className="absolute right-2 top-2 z-10 h-9 w-9 bg-white/85 text-text shadow-sm backdrop-blur transition hover:text-accent"
      />
    </div>
  );
}
