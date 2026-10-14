import Photo from "@/components/Photo";
import Link from "next/link";
import type { Artist } from "@/data/artists";
import CategoryArt from "@/components/CategoryArt";
import { categoryColor } from "@/data/categories";

// ხელოვანის ბარათი: კატეგორიის ბარათის სტილში (ფოტო ზემოთ, თბილი მიწისფერი პანელი ქვემოთ, თეთრი ტექსტი).
// ხელოვანების ფოტოები ფერებით ძალიან განსხვავებულია (ვარდისფერი, ნაცრისფერი, მკვეთრი), ამიტომ მათ ოდნავ ერთიან თბილ ტონს ვაძლევთ.
export default function ArtistCard({
  artist,
  worksLabel,
  artClassName = "aspect-[4/5]",
}: {
  artist: Artist;
  worksLabel?: string;
  artClassName?: string;
}) {
  // გარე ფოტო (მაგ. ლოგო) > პირველი ნამუშევრის ფოტო > მთავარი კატეგორიის სურათი
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
      className="group flex h-full flex-col overflow-hidden rounded-[1.5rem] text-white will-change-transform [backface-visibility:hidden] transition duration-300 hover:-translate-y-1.5 hover:shadow-2xl active:scale-[0.99] sm:rounded-[1.75rem]"
      style={{ background: `color-mix(in srgb, ${categoryColor(main)}, black 34%)` }}
    >
      <div className={`relative overflow-hidden bg-surface-2 ${artClassName}`}>
        <div className="absolute inset-0" style={photo?.image ? { filter: "saturate(.88) sepia(.1)" } : undefined}>
          {photo?.image ? (
            <Photo src={photo.image} alt={`${artist.name} — ${photo.title}`} sizes="(min-width:1280px) 240px, (min-width:1024px) 23vw, (min-width:640px) 31vw, 46vw" hoverZoom />
          ) : (
            <CategoryArt slug={main} color={categoryColor(main)} still className="absolute inset-0 h-full w-full" />
          )}
        </div>
        <span className="absolute left-2 top-2 z-10 rounded-full bg-black/35 px-2.5 py-1 text-[11px] font-medium text-white backdrop-blur-md sm:left-3 sm:top-3 sm:px-3 sm:text-xs">
          {artist.category}
        </span>
      </div>
      <div className="flex flex-1 items-end justify-between gap-3 p-3.5 sm:p-4">
        <div className="min-w-0">
          <h3 className="text-[15px] font-semibold leading-snug tracking-tight [overflow-wrap:anywhere] sm:text-lg">
            {artist.name}
          </h3>
          {worksLabel ? <p className="mt-0.5 text-xs text-white/70 sm:text-sm">{worksLabel}</p> : null}
        </div>
        <span
          className="hidden h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white/15 text-white transition duration-300 group-hover:bg-white group-hover:text-black sm:flex"
          aria-hidden
        >
          <span className="arrow-slide">→</span>
        </span>
      </div>
    </Link>
  );
}
