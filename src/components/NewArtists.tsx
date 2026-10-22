import Link from "next/link";
import Photo from "@/components/Photo";
import { getLocalizedArtists, isNewArtist, workAddedTime } from "@/data/artists";
import { dictionary } from "@/lib/dictionary";
import { getLang } from "@/lib/i18n";

// მთავარზე „ახალი ხელოვანი“: ახლად დამატებული ხელოვანი 14 დღით ცალკე ჩანს, რომ საიტი ცოცხალი იყოს (ღია ბარათი, ტერაკოტის აქცენტით).
// თუ ახალი ხელოვანი არ არის, ზოლი საერთოდ არ ჩანს.
export default async function NewArtists() {
  const lang = await getLang();
  const t = dictionary[lang];
  const fresh = getLocalizedArtists(lang)
    .filter((artist) => isNewArtist(artist))
    .slice(0, 2);
  if (fresh.length === 0) return null;

  return (
    <section className="mx-auto max-w-7xl px-4 pt-10 sm:px-6 lg:px-10 sm:pt-14">
      <ul className={`grid gap-3 sm:gap-4 ${fresh.length > 1 ? "lg:grid-cols-2" : ""}`}>
        {fresh.map((artist) => {
          // ახალი ხელოვანის ბარათზე ყველაზე ახლად დამატებული ნამუშევრების ფოტოები ჩანს (თანაბარი თარიღისას სიის რიგით)
          const photos = artist.works
            .filter((work) => work.image)
            .sort((a, b) => workAddedTime(b) - workAddedTime(a))
            .slice(0, 3);
          return (
            <li key={artist.slug}>
              <Link
                href={`/artists/${artist.slug}`}
                className="group flex h-full flex-col gap-4 rounded-[1.5rem] border border-border bg-surface p-4 shadow-[0_14px_30px_-24px_rgb(60_40_20/0.6)] transition duration-300 hover:-translate-y-1 hover:border-accent hover:shadow-xl sm:flex-row sm:items-center sm:gap-5 sm:rounded-[1.75rem] sm:p-5"
              >
                {photos.length > 0 ? (
                  <div className="grid shrink-0 grid-cols-3 gap-2 sm:w-60">
                    {photos.map((work) => (
                      <span key={work.image} className="print print-sm block">
                        <span className="relative block aspect-[3/4] bg-surface-2">
                          <Photo src={work.image as string} alt={`${work.title} - ${artist.name}`} sizes="(min-width:640px) 76px, 30vw" />
                        </span>
                      </span>
                    ))}
                  </div>
                ) : null}
                <div className="min-w-0">
                  <span className="inline-flex w-fit items-center rounded-full bg-accent px-3 py-1 text-xs font-semibold text-on-accent">
                    ✦ {t.home.newArtist}
                  </span>
                  <h2 className="mt-2 font-serif text-2xl font-semibold leading-tight tracking-tight text-text [overflow-wrap:anywhere] sm:text-3xl">
                    {artist.name}
                  </h2>
                  <p className="mt-1 text-sm text-muted">
                    {t.home.newArtistText} · {[artist.category, artist.city].filter(Boolean).join(" · ")} · {t.artists.worksCount(artist.works.length)}
                  </p>
                  <span className="btn btn-primary mt-3 min-h-10 px-5">
                    {t.weekArtist.cta}
                    <span className="arrow-slide" aria-hidden>
                      →
                    </span>
                  </span>
                </div>
              </Link>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
