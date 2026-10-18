import Link from "next/link";
import WorksGallery from "@/components/WorksGallery";
import { getWorkEntries, isNewWork } from "@/data/artists";
import { dictionary } from "@/lib/dictionary";
import { toGalleryWork } from "@/lib/galleryWork";
import { getLang } from "@/lib/i18n";

// მთავარზე „ახალი ნამუშევრები“: ბოლო 30 დღეში დამატებული (src/data/artists.ts-ში `added` თარიღით), ახლები პირველი.
// თუ ახალი ნამუშევარი არ არის, ზოლი საერთოდ არ ჩანს.
export default async function NewWorks() {
  const lang = await getLang();
  const t = dictionary[lang].home;
  const fresh = getWorkEntries(lang)
    .filter(({ work }) => isNewWork(work))
    .sort((a, b) => Date.parse(b.work.added!) - Date.parse(a.work.added!))
    .slice(0, 10);
  if (fresh.length === 0) return null;

  return (
    <section className="mx-auto max-w-7xl px-4 pt-14 sm:px-6 lg:px-10 sm:pt-20">
      <div className="mb-5 flex items-end justify-between gap-4 sm:mb-8">
        <h2 className="text-balance text-2xl font-semibold leading-tight tracking-tight text-text sm:text-3xl lg:text-4xl">
          {t.newWorks}
        </h2>
        <Link
          href="/new"
          className="group hidden min-h-10 shrink-0 items-center gap-2 rounded-full border border-border bg-surface px-5 text-sm font-medium text-text transition duration-300 hover:border-accent hover:text-accent sm:inline-flex"
        >
          {t.allNewWorks}
          <span className="arrow-slide" aria-hidden>
            →
          </span>
        </Link>
      </div>
      <WorksGallery
        layout="row"
        columns="sm:grid-cols-3 lg:grid-cols-5"
        showSort={false}
        works={fresh.map(({ artist, work, index }) => toGalleryWork(artist, work, index, { showArtist: true }))}
      />
    </section>
  );
}
