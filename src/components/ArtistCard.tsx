import Photo from "@/components/Photo";
import Link from "next/link";
import type { Artist } from "@/data/artists";
import CategoryArt from "@/components/CategoryArt";
import VerifiedMark from "@/components/VerifiedMark";
import { categoryColor } from "@/data/categories";

// ხელოვანის ბარათი: ფოტო ზემოთ, კრემისფერი პანელი ქვემოთ; თიხისფერი მხოლოდ „გახდი პარტნიორი“ ბარათზეა, რომ ის გამოირჩეოდეს.
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

  const color = categoryColor(main);
  const cut = artist.name.lastIndexOf(" ") + 1;
  const nameHead = artist.name.slice(0, cut);
  const nameTail = artist.name.slice(cut);

  // იგივე ფორმა, რაც კატეგორიის ბარათს (CategoryCard): კრემისფერი ჩარჩო, ფოტო 4:5, ქვემოთ სახელი და ფერადი ისარი
  return (
    <Link
      href={`/artists/${artist.slug}`}
      className="group flex h-full flex-col rounded-[1.6rem] border border-border bg-surface p-2 text-text shadow-[0_14px_30px_-24px_rgb(60_40_20/0.6)] will-change-transform [backface-visibility:hidden] transition duration-300 hover:-translate-y-1.5 hover:border-[color:var(--c)] hover:shadow-[0_26px_40px_-24px_rgb(60_40_20/0.7)] active:scale-[0.99] sm:p-2.5"
      style={{ ["--c" as string]: color }}
    >
      <div className={`relative overflow-hidden rounded-[1.15rem] bg-surface-2 ${artClassName}`}>
        <div className="absolute inset-0" style={photo?.image ? { filter: "saturate(.88) sepia(.1)" } : undefined}>
          {photo?.image ? (
            <Photo src={photo.image} alt={`${artist.name} - ${photo.title}`} sizes="(min-width:1280px) 240px, (min-width:1024px) 23vw, (min-width:640px) 31vw, 46vw" hoverZoom />
          ) : (
            <CategoryArt slug={main} color={color} still className="absolute inset-0 h-full w-full" />
          )}
        </div>
        {/* კატეგორიის ნიშანი კატეგორიის საკუთარ ფერშია */}
        <span
          className="absolute left-2 top-2 z-10 rounded-full px-2.5 py-1 text-[11px] font-semibold text-white shadow-md sm:left-3 sm:top-3 sm:px-3 sm:text-xs"
          style={{ background: color }}
        >
          {artist.category}
        </span>
      </div>
      <div className="flex flex-1 items-start justify-between gap-3 px-1.5 pb-1 pt-3 sm:px-2 sm:pt-3.5">
        <div className="min-w-0">
          <h3 className="line-clamp-2 min-h-[2.75em] font-serif text-base font-semibold leading-snug tracking-tight [overflow-wrap:break-word] sm:text-lg">
            {/* ნიშანი სახელის ბოლო სიტყვასთან ერთად გადადის ახალ ხაზზე, მარტო არასდროს რჩება */}
            {artist.verified ? (
              <>
                {nameHead}
                <span className="whitespace-nowrap">
                  {nameTail}
                  <VerifiedMark className="ml-1 inline-block h-[0.95em] w-[0.95em] -translate-y-[0.15em] text-accent" />
                </span>
              </>
            ) : (
              artist.name
            )}
          </h3>
          {worksLabel ? (
            <p className="mt-1 flex items-center gap-1.5 whitespace-nowrap text-xs font-medium text-muted">
              <span aria-hidden className="h-2 w-2 shrink-0 rounded-full" style={{ background: color }} />
              {worksLabel}
            </p>
          ) : null}
        </div>
        {/* ისარი ქვემოთ, ღია ფერის: კარუსელის ფერად ისრებში არ ერევა */}
        <span
          aria-hidden
          className="hidden h-9 w-9 shrink-0 items-center justify-center self-end rounded-full border border-border bg-surface text-text transition duration-300 group-hover:border-[color:var(--c)] group-hover:bg-[color:var(--c)] group-hover:text-white sm:flex"
        >
          <span className="arrow-slide">→</span>
        </span>
      </div>
    </Link>
  );
}
