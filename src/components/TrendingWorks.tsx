import WorksGallery from "@/components/WorksGallery";
import { getWorkEntries, type WorkEntry } from "@/data/artists";
import { pickedWorks } from "@/data/featured";
import { dictionary } from "@/lib/dictionary";
import { topSavedWorks } from "@/lib/favoriteStats";
import { toGalleryWork } from "@/lib/galleryWork";
import { getLang } from "@/lib/i18n";

// მთავარზე ზოლი: თუ საკმარისი რეალური მონაცემია (ფავორიტები), „ამ თვის ყველაზე შენახული“; სხვა შემთხვევაში „რჩეული ნამუშევრები“ (ყოველი ხელოვანიდან რამდენიმე)
export default async function TrendingWorks() {
  const lang = await getLang();
  const t = dictionary[lang];
  const entries = getWorkEntries(lang);
  const byKey = new Map(entries.map((entry) => [`${entry.artist.slug}/${entry.id}`, entry]));

  const top = (await topSavedWorks(8))
    .map((x) => ({ entry: byKey.get(x.key), count: x.count }))
    .filter((x): x is { entry: WorkEntry; count: number } => Boolean(x.entry));
  const trending = top.length >= 4;

  const PICKED_COUNT = 10;
  let items: { entry: WorkEntry; count?: number }[];
  if (trending) {
    items = top.slice(0, 6);
  } else {
    // ჯერ ხელით არჩეული ნამუშევრები (src/data/featured.ts), დანარჩენი ავტომატურად
    items = pickedWorks.flatMap((key) => {
      const entry = byKey.get(key);
      return entry ? [{ entry }] : [];
    });
    // ხელოვანებს რიგრიგობით ვიღებთ, რომ ერთი ხელოვანი არ დაჯდეს მთელ ზოლზე
    const perArtist = new Map<string, WorkEntry[]>();
    for (const entry of entries) perArtist.set(entry.artist.slug, [...(perArtist.get(entry.artist.slug) ?? []), entry]);
    const lists = [...perArtist.values()];
    const taken = new Set(items.map(({ entry }) => entry.work.image));
    for (let i = 0; items.length < PICKED_COUNT && i < 12; i++) {
      for (const list of lists) {
        if (list[i] && items.length < PICKED_COUNT && !taken.has(list[i].work.image)) items.push({ entry: list[i] });
      }
    }
  }
  if (items.length === 0) return null;

  return (
    <section className="mx-auto max-w-7xl px-4 pt-14 sm:px-6 lg:px-10 sm:pt-20">
      <h2 className="mb-5 text-balance text-2xl font-semibold leading-tight tracking-tight text-text sm:mb-8 sm:text-3xl lg:text-4xl">
        {trending ? t.trending.title : t.trending.picked}
      </h2>
      <WorksGallery
        layout="row"
        columns={trending ? "sm:grid-cols-3 lg:grid-cols-6" : "sm:grid-cols-3 lg:grid-cols-5"}
        showSort={false}
        works={items.map(({ entry, count }) =>
          toGalleryWork(entry.artist, entry.work, entry.index, { showArtist: true, badge: count ? t.trending.saves(count) : undefined }),
        )}
      />
    </section>
  );
}
