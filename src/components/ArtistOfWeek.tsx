import Link from "next/link";
import Photo from "@/components/Photo";
import { getLocalizedArtists } from "@/data/artists";
import { dictionary } from "@/lib/dictionary";
import { getLang } from "@/lib/i18n";

// „ხელოვანი კვირისა“: ყოველ კვირას ახალი ხელოვანი (რიგრიგობით), მოკლე ისტორიით და ნამუშევრებით
export default async function ArtistOfWeek() {
  const lang = await getLang();
  const t = dictionary[lang];
  const artists = getLocalizedArtists(lang);
  if (artists.length === 0) return null;
  const week = Math.floor(Date.now() / (7 * 24 * 60 * 60 * 1000));
  const artist = artists[week % artists.length];
  const photos = artist.works.filter((work) => work.image).slice(0, 4);
  const hero = artist.cover ?? photos[0]?.image;
  const frame = "border-[1.5px] border-[color-mix(in_srgb,var(--text)_18%,transparent)]";

  return (
    <section className="mx-auto max-w-7xl px-4 pt-14 sm:px-6 lg:px-10 sm:pt-20">
      <Link
        href={`/artists/${artist.slug}`}
        className={`group grid overflow-hidden rounded-[1.5rem] bg-bg transition duration-300 hover:border-accent hover:shadow-xl sm:grid-cols-[minmax(0,5fr)_minmax(0,6fr)] sm:rounded-[1.75rem] ${frame}`}
      >
        <div className="relative aspect-[4/3] overflow-hidden bg-surface-2 sm:aspect-auto sm:min-h-[22rem]">
          {hero ? (
            <div className="absolute inset-0" style={{ filter: "saturate(.88) sepia(.1)" }}>
              <Photo src={hero} alt={artist.name} sizes="(min-width:640px) 45vw, 100vw" hoverZoom />
            </div>
          ) : null}
        </div>
        <div className="flex flex-col justify-center gap-3 p-5 sm:p-8">
          <span className="inline-flex w-fit items-center rounded-full bg-accent px-3 py-1 text-xs font-semibold text-on-accent">
            {t.weekArtist.label}
          </span>
          <h2 className="font-serif text-3xl font-semibold leading-tight tracking-tight text-text sm:text-4xl">{artist.name}</h2>
          <p className="text-sm text-muted">
            {[artist.category, artist.city].filter(Boolean).join(" · ")} · {t.artists.worksCount(artist.works.length)}
          </p>
          <p className="line-clamp-4 text-base leading-relaxed text-text sm:text-lg">{artist.bio}</p>
          {photos.length > 1 ? (
            <div className="mt-1 flex gap-2" aria-hidden>
              {photos.map((work) => (
                <span key={work.image} className="relative block h-14 w-14 overflow-hidden rounded-xl bg-surface-2 sm:h-16 sm:w-16">
                  <Photo src={work.image as string} alt="" sizes="64px" />
                </span>
              ))}
            </div>
          ) : null}
          <span className="mt-2 inline-flex min-h-11 w-fit items-center gap-2 rounded-full bg-accent px-5 text-sm font-medium text-on-accent transition duration-300 group-hover:bg-accent-hover">
            {t.weekArtist.cta}
            <span className="arrow-slide" aria-hidden>
              →
            </span>
          </span>
        </div>
      </Link>
    </section>
  );
}
