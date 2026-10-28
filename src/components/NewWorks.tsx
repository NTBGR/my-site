import Link from "next/link";
import WorksGallery from "@/components/WorksGallery";
import { getWorkEntries, hasCardQualityPhoto, isNewWork } from "@/data/artists";
import { newWorksFeatured } from "@/data/featured";
import { dictionary } from "@/lib/dictionary";
import { saveCounts } from "@/lib/favoriteStats";
import { toGalleryWork } from "@/lib/galleryWork";
import { getLang } from "@/lib/i18n";

// მთავარზე „ახალი ნამუშევრები“: ბოლო 30 დღეში დამატებული (src/data/artists.ts-ში `added` თარიღით), შემთხვევითი რიგით, მხოლოდ კარგი ხარისხის ფოტოებით (hasCardQualityPhoto).
// უახლესი დიდ ბარათზეა, დანარჩენი ექვსი გვერდით (ბადე ორ სავსე რიგად). თუ ახალი ნამუშევარი არ არის, ზოლი საერთოდ არ ჩანს.
export default async function NewWorks() {
  const lang = await getLang();
  const t = dictionary[lang].home;
  const saves = await saveCounts();
  // ყოველ ჩატვირთვაზე შემთხვევითი რიგი: თითო ხელოვანის ნამუშევრები არეულია და ხელოვანები რიგრიგობით გამოდიან (ყველა ახალი ხელოვანი ჩანს, ერთი ბევრით არ გადაფარავს სხვებს)
  const shuffle = <T,>(list: T[]) => {
    const copy = [...list];
    for (let i = copy.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [copy[i], copy[j]] = [copy[j], copy[i]];
    }
    return copy;
  };
  const all = getWorkEntries(lang);
  const featured = newWorksFeatured ? all.find((entry) => `${entry.artist.slug}/${entry.id}` === newWorksFeatured) : undefined;
  const byArtist = new Map<string, ReturnType<typeof getWorkEntries>>();
  for (const entry of all.filter((e) => e !== featured && isNewWork(e.work) && hasCardQualityPhoto(e.work))) {
    byArtist.set(entry.artist.slug, [...(byArtist.get(entry.artist.slug) ?? []), entry]);
  }
  const queues = shuffle([...byArtist.values()].map((list) => shuffle(list)));
  const fresh: ReturnType<typeof getWorkEntries> = featured ? [featured] : [];
  while (fresh.length < 7 && queues.some((q) => q.length > 0)) {
    for (const queue of queues) {
      const next = queue.shift();
      if (next && fresh.length < 7) fresh.push(next);
    }
  }
  if (fresh.length === 0) return null;
  const allLink = (
    <>
      {t.allNewWorks}
      <span className="arrow-slide" aria-hidden>
        →
      </span>
    </>
  );

  return (
    <section className="mx-auto max-w-7xl px-4 pt-14 sm:px-6 lg:px-10 sm:pt-20">
      <div className="mb-5 flex items-end justify-between gap-4 sm:mb-8">
        <div>
          <p className="mb-2 inline-flex items-center gap-1.5 rounded-full bg-accent-soft px-3 py-1 text-xs font-semibold text-accent">
            <span className="pulse-dot h-1.5 w-1.5 rounded-full bg-accent" aria-hidden />
            {dictionary[lang].newBadge}
          </p>
          <h2 className="title-mark text-balance text-2xl font-semibold leading-tight tracking-tight text-text sm:text-3xl lg:text-4xl">
            {t.newWorks}
          </h2>
          <p className="mt-3 max-w-xl text-sm text-muted sm:text-base">{t.newWorksText}</p>
        </div>
        <Link href="/new" className="group btn btn-outline hidden min-h-10 shrink-0 px-5 sm:inline-flex">
          {allLink}
        </Link>
      </div>
      <WorksGallery
        layout="row"
        columns="sm:grid-cols-4 lg:grid-cols-5"
        showSort={false}
        featureFirst={fresh.length >= 5}
        seeAll={{ href: "/new", label: t.allNewWorks }}
        works={fresh.map(({ artist, work, index }) => toGalleryWork(artist, work, index, { showArtist: true, saves }))}
      />
    </section>
  );
}
