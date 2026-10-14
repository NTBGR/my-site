import Image from "next/image";
import Link from "next/link";
import ArtTile from "@/components/ArtTile";
import type { WorkEntry } from "@/data/artists";

// ნამუშევრის ბარათი: ფოტო, სახელი და ავტორი; იხსნება ნამუშევრის საკუთარ გვერდზე
export default function WorkCard({ entry }: { entry: WorkEntry }) {
  const { artist, work, id } = entry;
  return (
    <Link href={`/works/${artist.slug}/${id}`} className="group block">
      <span className="relative block aspect-[3/4] w-full overflow-hidden rounded-[1.25rem] bg-surface shadow-sm transition duration-300 group-hover:-translate-y-1 group-hover:shadow-2xl sm:rounded-[1.5rem]">
        {work.image ? (
          <Image
            src={work.image}
            alt={work.title}
            fill
            sizes="(min-width: 1280px) 240px, (min-width: 1024px) 22vw, (min-width: 640px) 33vw, 50vw"
            className="object-cover transition duration-300 group-hover:scale-[1.04]"
          />
        ) : (
          <ArtTile color={work.color} variant={0} className="absolute inset-0 h-full w-full" />
        )}
      </span>
      <span className="mt-2 block px-1 text-sm font-medium leading-snug text-text transition-colors group-hover:text-accent sm:text-base">
        {work.title}
      </span>
      <span className="block px-1 text-xs text-muted sm:text-sm">{artist.name}</span>
    </Link>
  );
}
