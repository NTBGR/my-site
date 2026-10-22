import WorksGallery from "@/components/WorksGallery";
import { getWorkEntries, type WorkEntry } from "@/data/artists";
import { pickedWorks } from "@/data/featured";
import { dictionary } from "@/lib/dictionary";
import { topSavedWorks } from "@/lib/favoriteStats";
import { toGalleryWork } from "@/lib/galleryWork";
import { getLang } from "@/lib/i18n";

const COUNT = 10;

// მთავარზე „რჩეული ნამუშევრები“, ყოველთვის 10: ჯერ ის ნამუშევრები, რომლებსაც გულები აქვს (რაც მეტი გული, მით წინ, ❤ რიცხვით),
// მერე ხელით არჩეულები (src/data/featured.ts), მერე ყოველი ხელოვანიდან რიგრიგობით, სანამ 10 არ შეივსება
export default async function TrendingWorks() {
  const lang = await getLang();
  const t = dictionary[lang];
  const entries = getWorkEntries(lang);
  const byKey = new Map(entries.map((entry) => [`${entry.artist.slug}/${entry.id}`, entry]));

  const items: { entry: WorkEntry; count?: number }[] = [];
  const taken = new Set<string>();
  const add = (entry: WorkEntry | undefined, count?: number) => {
    if (!entry || items.length >= COUNT) return;
    const id = `${entry.artist.slug}/${entry.id}`;
    if (taken.has(id)) return;
    taken.add(id);
    items.push({ entry, count });
  };

  for (const saved of await topSavedWorks(COUNT)) add(byKey.get(saved.key), saved.count);
  for (const key of pickedWorks) add(byKey.get(key));
  // ხელოვანებს რიგრიგობით ვიღებთ, რომ ერთი ხელოვანი არ დაჯდეს მთელ ზოლზე
  const perArtist = new Map<string, WorkEntry[]>();
  for (const entry of entries) perArtist.set(entry.artist.slug, [...(perArtist.get(entry.artist.slug) ?? []), entry]);
  const lists = [...perArtist.values()];
  for (let i = 0; items.length < COUNT && i < 12; i++) for (const list of lists) add(list[i]);
  if (items.length === 0) return null;

  return (
    // რბილი ზოლი მთელ სიგანეზე: „ახალი ნამუშევრების“ იდენტური რიგი რომ არ გაიმეოროს
    <section className="relative isolate mt-14 overflow-hidden bg-surface-2 sm:mt-20">
      <div aria-hidden className="pointer-events-none absolute -left-24 -top-24 -z-10 h-72 w-72 rounded-full bg-accent-soft blur-3xl" />
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-16 lg:px-10">
        <div className="mb-5 sm:mb-8">
          <p className="mb-2 inline-flex items-center gap-1.5 rounded-full bg-[#fde3e8] px-3 py-1 text-xs font-semibold text-[#be123c]">
            <span aria-hidden>❤</span>
            {t.trending.title}
          </p>
          <h2 className="title-mark text-balance text-2xl font-semibold leading-tight tracking-tight text-text sm:text-3xl lg:text-4xl">
            {t.trending.picked}
          </h2>
          <p className="mt-3 max-w-xl text-sm text-muted sm:text-base">{t.trending.text}</p>
        </div>
        <WorksGallery
          layout="row"
          columns="sm:grid-cols-3 lg:grid-cols-5"
          showSort={false}
          works={items.map(({ entry, count }) =>
            toGalleryWork(entry.artist, entry.work, entry.index, { showArtist: true, badge: count ? t.trending.saves(count) : undefined }),
          )}
        />
      </div>
    </section>
  );
}
