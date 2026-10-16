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
        className="group grain relative isolate flex items-center justify-between gap-4 overflow-hidden rounded-[1.25rem] px-5 py-4 text-white shadow-md transition duration-300 hover:-translate-y-0.5 hover:shadow-xl sm:rounded-[1.5rem] sm:px-7 sm:py-5"
        style={{ background: "linear-gradient(150deg, #b97b58, #9d6044 52%, #5e3a2a)" }}
      >
        <div className="min-w-0">
          <h2 className="text-lg font-semibold tracking-tight sm:text-2xl">
            <span aria-hidden className="mr-1.5">🔥</span>
            {t.title(range)}
          </h2>
          <p className="mt-0.5 text-sm text-white/85 sm:text-base">{t.text(artistsText)}</p>
          <span className="mt-3 inline-flex min-h-10 items-center gap-2 rounded-full bg-white px-5 text-sm font-medium text-black transition duration-300 group-hover:bg-accent group-hover:text-on-accent">
            {t.cta}
            <span className="arrow-slide" aria-hidden>
              →
            </span>
          </span>
        </div>
        {photos.length > 0 ? (
          <div aria-hidden className="hidden shrink-0 gap-2 sm:flex">
            {photos.map(({ work, artist }, i) => (
              <span
                key={work.image}
                className="relative block h-20 w-16 overflow-hidden rounded-xl shadow-lg ring-2 ring-white/25 lg:h-24 lg:w-[4.5rem]"
                style={{ transform: `rotate(${[-4, 3, -2][i]}deg)` }}
              >
                <Photo src={work.image as string} alt={`${work.title} - ${artist.name}`} sizes="72px" />
              </span>
            ))}
          </div>
        ) : null}
      </Link>
    </section>
  );
}
