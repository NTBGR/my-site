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
    <section className="mx-auto max-w-7xl px-4 pt-14 sm:px-6 lg:px-10 sm:pt-20">
      <h2 className="mb-5 text-balance text-2xl font-semibold leading-tight tracking-tight text-text sm:mb-8 sm:text-3xl lg:text-4xl">
        {t.trending.picked}
      </h2>
      <WorksGallery
        layout="row"
        columns="sm:grid-cols-3 lg:grid-cols-5"
        showSort={false}
        works={items.map(({ entry, count }) =>
          toGalleryWork(entry.artist, entry.work, entry.index, { showArtist: true, badge: count ? t.trending.saves(count) : undefined }),
        )}
      />
    </section>
  );
}
