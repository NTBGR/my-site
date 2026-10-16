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
    .slice(0, 6);
  if (fresh.length === 0) return null;

  return (
    <section className="mx-auto max-w-7xl px-4 pt-14 sm:px-6 lg:px-10 sm:pt-20">
      <h2 className="mb-5 text-balance text-2xl font-semibold leading-tight tracking-tight text-text sm:mb-8 sm:text-3xl lg:text-4xl">
        {t.newWorks}
      </h2>
      <WorksGallery
        layout="row"
        columns="sm:grid-cols-3 lg:grid-cols-6"
        showSort={false}
        works={fresh.map(({ artist, work, index }) => toGalleryWork(artist, work, index, { showArtist: true }))}
      />
    </section>
  );
}
