import Link from "next/link";
import BannerOrnament from "@/components/BannerOrnament";
import Photo from "@/components/Photo";
import { getLocalizedArtists, workAddedTime } from "@/data/artists";
import { artistOfWeekOverride } from "@/data/featured";
import { dictionary } from "@/lib/dictionary";
import { getLang } from "@/lib/i18n";
import { currentWeek } from "@/lib/week";

// „ხელოვანი კვირისა“: ყოველ კვირას ახალი ხელოვანი (რიგრიგობით), მოკლე ისტორიით და ნამუშევრებით
export default async function ArtistOfWeek() {
  const lang = await getLang();
  const t = dictionary[lang];
  const artists = getLocalizedArtists(lang);
  if (artists.length === 0) return null;
  const week = currentWeek();
  // ხელით დაფიქსირებული ხელოვანი (src/data/featured.ts) ან კვირის მიხედვით რიგრიგობით
  const artist = artists.find((a) => a.slug === artistOfWeekOverride) ?? artists[week % artists.length];
  const withImages = artist.works.filter((work) => work.image);
  // ორი ვერტიკალური ფოტო გვერდიგვერდ (ნამუშევრის ფოტოები 3:4-ია, ამიტომ თითქმის არაფერი იჭრება): ამ ხელოვანის ორი ყველაზე ახლად დამატებული ნამუშევარი
  // (თარიღის გარეშე ნამუშევრებისას სიის პირველი ორი); sort სტაბილურია
  const photos = [...withImages].sort((a, b) => workAddedTime(b) - workAddedTime(a)).slice(0, 2);
  const grid = photos.length >= 2;
  const hero = artist.cover ?? photos[0]?.image;
  const frame = "border-[1.5px] border-white/25";

  return (
    // ფერადი ზოლი მთელ სიგანეზე: მთავარის რიტმში ერთი გამორჩეული ადგილი
    <section
      className="relative isolate mt-14 overflow-hidden sm:mt-20"
      style={{ background: "linear-gradient(135deg, #8a3b57, #5e2a3e 58%, #3d1a29)" }}
    >
      <BannerOrnament kind="sparkles" className="-z-10" />
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 sm:py-14 lg:px-10">
      <Link
        href={`/artists/${artist.slug}`}
        className={`group grid overflow-hidden rounded-[1.5rem] bg-bg transition duration-300 hover:border-accent hover:shadow-xl sm:grid-cols-[minmax(0,5fr)_minmax(0,6fr)] sm:rounded-[1.75rem] ${frame}`}
      >
        {grid ? (
          <div className="grid grid-cols-2 gap-0.5 bg-surface-2" style={{ filter: "saturate(.88) sepia(.1)" }}>
            {photos.map((work) => (
              <span key={work.image} className="relative block aspect-[3/4] overflow-hidden">
                <Photo src={work.image as string} alt={`${work.title} - ${artist.name}`} sizes="(min-width:640px) 24vw, 50vw" hoverZoom />
              </span>
            ))}
          </div>
        ) : (
          <div className="relative aspect-[4/3] overflow-hidden bg-surface-2 sm:aspect-auto sm:min-h-[22rem]">
            {hero ? (
              <div className="absolute inset-0" style={{ filter: "saturate(.88) sepia(.1)" }}>
                <Photo src={hero} alt={artist.name} sizes="(min-width:640px) 45vw, 100vw" hoverZoom />
              </div>
            ) : null}
          </div>
        )}
        <div className="flex flex-col justify-center gap-3 p-5 sm:p-8">
          <span className="inline-flex w-fit items-center rounded-full bg-accent px-3 py-1 text-xs font-semibold text-on-accent">
            {t.weekArtist.label}
          </span>
          <h2 className="font-serif text-3xl font-semibold leading-tight tracking-tight text-text sm:text-4xl">{artist.name}</h2>
          <p className="text-sm text-muted">
            {[artist.category, artist.city].filter(Boolean).join(" · ")} · {t.artists.worksCount(artist.works.length)}
          </p>
          <p className="line-clamp-4 text-base leading-relaxed text-text sm:text-lg">{artist.bio}</p>
          <span className="mt-2 inline-flex min-h-11 w-fit items-center gap-2 rounded-full bg-accent px-5 text-sm font-medium text-on-accent transition duration-300 group-hover:bg-accent-hover">
            {t.weekArtist.cta}
            <span className="arrow-slide" aria-hidden>
              →
            </span>
          </span>
        </div>
      </Link>
      </div>
    </section>
  );
}
