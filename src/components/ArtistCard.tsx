import Image from "next/image";
import Link from "next/link";
import type { Artist } from "@/data/artists";
import CategoryArt from "@/components/CategoryArt";
import { categoryColor } from "@/data/categories";

export default function ArtistCard({
  artist,
  worksLabel,
  artClassName = "aspect-[4/5]",
}: {
  artist: Artist;
  worksLabel?: string;
  artClassName?: string;
}) {
  // გარე ფოტო (მაგ. ლოგო) > პირველი ნამუშევრის ფოტო > მთავარი კატეგორიის ილუსტრაცია
  const firstWork = artist.works.find((work) => work.image);
  const photo = artist.cover
    ? { image: artist.cover, title: artist.name }
    : firstWork?.image
      ? { image: firstWork.image, title: firstWork.title }
      : undefined;
  const main = artist.categories[0] ?? "nakhatebi";

  return (
    <Link
      href={`/artists/${artist.slug}`}
      className="group block h-full rounded-[1.5rem] border border-border bg-surface p-2 will-change-transform [backface-visibility:hidden] transition duration-300 hover:-translate-y-1.5 hover:border-accent hover:shadow-xl active:scale-[0.99] sm:rounded-[1.75rem] sm:p-2.5"
    >
      <div className={`relative overflow-hidden rounded-[1.1rem] bg-surface-2 sm:rounded-[1.25rem] ${artClassName}`}>
        {photo?.image ? (
          <Image
            src={photo.image}
            alt={photo.title}
            fill
            sizes="(min-width: 1280px) 20vw, (min-width: 640px) 33vw, 50vw"
            className="zoom-on-hover will-change-transform object-cover"
          />
        ) : (
          <CategoryArt
            slug={main}
            color={categoryColor(main)}
            fit="contain"
            className="absolute inset-0 h-full w-full"
          />
        )}
        <span className="absolute left-2 top-2 z-10 rounded-full bg-black/35 px-2.5 py-1 text-[11px] font-medium text-white backdrop-blur-md sm:left-3 sm:top-3 sm:px-3 sm:text-xs">
          {artist.category}
        </span>
      </div>
      <div className="flex items-end justify-between gap-3 px-1.5 pb-1.5 pt-3 sm:px-2.5 sm:pb-2 sm:pt-4">
        <div className="min-w-0">
          <h3 className="text-[15px] font-semibold leading-snug tracking-tight text-text [overflow-wrap:anywhere] sm:text-lg">
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
