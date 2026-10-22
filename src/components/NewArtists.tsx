import Link from "next/link";
import Photo from "@/components/Photo";
import { categoryColor } from "@/data/categories";
import { getLocalizedArtists, isNewArtist, workAddedTime } from "@/data/artists";
import { dictionary } from "@/lib/dictionary";
import { getLang } from "@/lib/i18n";
import { toneGradient } from "@/lib/tones";

// მთავარზე „ახალი ხელოვანი“: ახლად დამატებული ხელოვანი 14 დღით ცალკე ჩანს, რომ საიტი ცოცხალი იყოს.
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
          // ბარათი ხელოვანის მთავარი კატეგორიის ფერშია
          const color = categoryColor(artist.categories[0] ?? "nakhatebi");
          return (
            <li key={artist.slug}>
              <Link
                href={`/artists/${artist.slug}`}
                className="group grain relative isolate flex h-full flex-col gap-4 overflow-hidden rounded-[1.5rem] p-4 text-white shadow-lg transition duration-300 hover:-translate-y-1 hover:shadow-2xl sm:flex-row sm:items-center sm:gap-5 sm:rounded-[1.75rem] sm:p-5"
                style={{ background: toneGradient(color), ["--tone" as string]: color }}
              >
                {photos.length > 0 ? (
                  <div className="relative z-[2] grid shrink-0 grid-cols-3 gap-2 sm:w-60">
                    {photos.map((work) => (
                      <span key={work.image} className="print print-sm block">
                        <span className="relative block aspect-[3/4] bg-surface-2">
                          <Photo src={work.image as string} alt={`${work.title} - ${artist.name}`} sizes="(min-width:640px) 76px, 30vw" />
                        </span>
                      </span>
                    ))}
                  </div>
                ) : null}
                <div className="relative z-[2] min-w-0">
                  <span className="inline-flex w-fit items-center rounded-full bg-[#f6c453] px-3 py-1 text-xs font-bold text-[#4a2508]">
                    ✦ {t.home.newArtist}
                  </span>
                  <h2 className="mt-2 font-serif text-2xl font-semibold leading-tight tracking-tight [overflow-wrap:anywhere] sm:text-3xl">
                    {artist.name}
                  </h2>
                  <p className="mt-1 text-sm text-white/85">
                    {t.home.newArtistText} · {[artist.category, artist.city].filter(Boolean).join(" · ")} · {t.artists.worksCount(artist.works.length)}
                  </p>
                  <span className="btn btn-light mt-3 min-h-10 px-5">
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
