import Link from "next/link";
import NewYearCountdown from "@/components/NewYearCountdown";
import Photo from "@/components/Photo";
import { getTagBySlug, localizeTag, worksForTag } from "@/data/tags";
import { dictionary } from "@/lib/dictionary";
import { getLang } from "@/lib/i18n";

// მთავარზე საახალწლო ბანერი: ჩანს მხოლოდ სეზონში (src/data/tags.ts-ში new-year თაგის season) და სანამ თაგში ნამუშევარი არის
export default async function NewYearPromo() {
  const lang = await getLang();
  const t = dictionary[lang].home;
  const raw = getTagBySlug("new-year");
  if (!raw) return null;
  const entries = worksForTag(raw, lang);
  if (entries.length === 0) return null;
  const tag = localizeTag(raw, lang);

  // სამი ფოტო სამი სხვადასხვა ხელოვანისგან (თუ გვყავს), ახლები წინ
  const seen = new Set<string>();
  const photos = entries
    .filter(({ work, artist }) => {
      if (!work.image || seen.has(artist.slug)) return false;
      seen.add(artist.slug);
      return true;
    })
    .slice(0, 3);

  return (
    <section className="mx-auto max-w-7xl px-4 pt-3 sm:px-6 lg:px-10 sm:pt-4">
      <Link
        href={`/gifts/${tag.slug}`}
        className="group snow-bg grain relative isolate flex items-center justify-between gap-4 overflow-hidden rounded-[1.25rem] px-5 py-4 text-white shadow-md transition duration-300 hover:-translate-y-0.5 hover:shadow-xl sm:rounded-[1.5rem] sm:px-7 sm:py-5"
        style={{ background: "linear-gradient(150deg, #3f7d5c, #1f5a42 52%, #103b2c)" }}
      >
        <div className="relative z-10 min-w-0">
          <h2 className="text-lg font-semibold tracking-tight sm:text-2xl">
            <span aria-hidden className="mr-1.5">
              {tag.emoji}
            </span>
            {tag.name}
          </h2>
          <p className="mt-0.5 text-sm text-white/85 sm:text-base">{tag.description}</p>
          <NewYearCountdown />
          <span className="mt-3 inline-flex min-h-10 items-center gap-2 rounded-full bg-white px-5 text-sm font-medium text-black transition duration-300 group-hover:bg-accent group-hover:text-on-accent">
            {t.browse}
            <span className="arrow-slide" aria-hidden>
              →
            </span>
          </span>
        </div>
        {photos.length > 0 ? (
          <div aria-hidden className="relative z-10 hidden shrink-0 gap-2 sm:flex">
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
