import Link from "next/link";
import Photo from "@/components/Photo";
import { pricing } from "@/data/artists";
import { getTagBySlug, worksForTag } from "@/data/tags";
import { dictionary } from "@/lib/dictionary";
import { getLang } from "@/lib/i18n";

// მთავარზე ფასდაკლების ბანერი: ჩანს მხოლოდ მაშინ, როცა ფასდაკლება ახლა მართლა მოქმედებს, მერე თავისით ქრება
export default async function SalePromo() {
  const lang = await getLang();
  const t = dictionary[lang].home.saleBanner;
  const tag = getTagBySlug("sale");
  if (!tag) return null;
  const entries = worksForTag(tag, lang);
  if (entries.length === 0) return null;

  const percents = entries.map(({ artist, work }) => pricing(artist, work)?.percent ?? 0).filter(Boolean);
  const min = Math.min(...percents);
  const max = Math.max(...percents);
  const range = min === max ? `-${max}%` : `-${min}% … -${max}%`;
  const names = Array.from(new Set(entries.map(({ artist }) => artist.name)));
  const artistsText = names.length > 2 ? `${names.slice(0, 2).join(", ")} +${names.length - 2}` : names.join(", ");
  const photos = entries.filter(({ work }) => work.image).slice(0, 3);

  return (
    <section className="mx-auto max-w-7xl px-4 pt-5 sm:px-6 lg:px-10 sm:pt-6">
      <Link
        href="/gifts/sale"
        className="group grain relative isolate flex items-center justify-between gap-4 overflow-hidden rounded-[1.25rem] px-5 py-5 text-white shadow-lg transition duration-300 hover:-translate-y-0.5 hover:shadow-2xl sm:rounded-[1.5rem] sm:px-8 sm:py-7"
        style={{ background: "linear-gradient(110deg, #5c2a0c, #94561a 58%, #bd7420)" }}
      >
        {/* მბზინავი გადავლება და რბილი შუქი */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 -z-10"
          style={{ background: "radial-gradient(45% 120% at 88% 0%, rgb(255 214 140 / 0.35), transparent 70%)" }}
        />
        <div aria-hidden className="pointer-events-none absolute inset-0 z-[2] overflow-hidden">
          <div className="shine-sweep h-full w-1/5 bg-gradient-to-r from-transparent via-white/20 to-transparent" />
        </div>
        {/* ტელეფონზე ერთი ფოტო კუთხეში (დესკტოპზე სამი ფოტო მარჯვნივ) */}
        {photos[0] ? (
          <span
            aria-hidden
            className="float-soft print print-sm absolute right-4 top-4 z-[3] block h-[4.75rem] w-[3.75rem] sm:hidden"
            style={{ ["--r" as string]: "5deg", ["--tone" as string]: "#94561a" }}
          >
            <span className="relative block h-full w-full">
              <Photo src={photos[0].work.image as string} alt="" sizes="60px" />
            </span>
          </span>
        ) : null}
        <div className={`min-w-0 ${photos[0] ? "pr-[4.5rem] sm:pr-0" : ""}`}>
          <h2 className="text-xl font-semibold tracking-tight sm:text-3xl">
            <span aria-hidden className="mr-1.5">🔥</span>
            {t.title(range)}
          </h2>
          <p className="mt-1 text-sm text-white/85 sm:text-base">{t.text(artistsText)}</p>
          <span className="btn btn-light mt-4 group-hover:bg-[#f6c453]">
            {t.cta}
            <span className="arrow-slide" aria-hidden>
              →
            </span>
          </span>
        </div>
        <div aria-hidden className="absolute bottom-4 right-4 z-[3] shrink-0 sm:relative sm:bottom-auto sm:right-auto sm:flex sm:items-center sm:gap-5">
          {photos.length > 0 ? (
            <div className="hidden gap-2.5 sm:flex">
              {photos.map(({ work, artist }, i) => (
                <span
                  key={work.image}
                  className="float-soft print print-sm block h-24 w-[4.5rem] lg:h-28 lg:w-[5.25rem]"
                  style={{ ["--r" as string]: `${[-4, 3, -2][i]}deg`, animationDelay: `-${i * 2.4}s`, ["--tone" as string]: "#94561a" }}
                >
                  <span className="relative block h-full w-full">
                    <Photo src={work.image as string} alt={`${work.title} - ${artist.name}`} sizes="84px" />
                  </span>
                </span>
              ))}
            </div>
          ) : null}
          <span
            className="float-soft flex h-14 w-14 items-center justify-center rounded-full bg-[#f6c453] font-serif text-base font-bold text-[#4a2508] shadow-xl ring-4 ring-white/30 sm:order-first sm:h-[4.75rem] sm:w-[4.75rem] sm:text-xl"
            style={{ ["--r" as string]: "8deg" }}
          >
            -{max}%
          </span>
        </div>
      </Link>
    </section>
  );
}
