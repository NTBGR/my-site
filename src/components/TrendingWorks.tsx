import Link from "next/link";
import ArtTile from "@/components/ArtTile";
import HeartButton from "@/components/HeartButton";
import Photo from "@/components/Photo";
import { getWorkEntries, isNewWork, type WorkEntry } from "@/data/artists";
import { dictionary } from "@/lib/dictionary";
import { topSavedWorks } from "@/lib/favoriteStats";
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

  let items: { entry: WorkEntry; count?: number }[];
  if (trending) {
    items = top.slice(0, 6);
  } else {
    // ხელოვანებს რიგრიგობით ვიღებთ, რომ ერთი ხელოვანი არ დაჯდეს მთელ ზოლზე
    const perArtist = new Map<string, WorkEntry[]>();
    for (const entry of entries) perArtist.set(entry.artist.slug, [...(perArtist.get(entry.artist.slug) ?? []), entry]);
    const lists = [...perArtist.values()];
    items = [];
    for (let i = 0; items.length < 6 && i < 12; i++) {
      for (const list of lists) if (list[i] && items.length < 6) items.push({ entry: list[i] });
    }
  }
  if (items.length === 0) return null;

  return (
    <section className="mx-auto max-w-7xl px-4 pt-14 sm:px-6 lg:px-10 sm:pt-20">
      <h2 className="mb-5 text-balance text-2xl font-semibold leading-tight tracking-tight text-text sm:mb-8 sm:text-3xl lg:text-4xl">
        {trending ? t.trending.title : t.trending.picked}
      </h2>
      <ul className="-mx-4 flex snap-x snap-mandatory gap-3 overflow-x-auto px-4 pb-2 [scrollbar-width:none] sm:mx-0 sm:grid sm:grid-cols-3 sm:gap-4 sm:overflow-visible sm:px-0 lg:grid-cols-6 [&::-webkit-scrollbar]:hidden">
        {items.map(({ entry, count }) => {
          const { artist, work, id } = entry;
          return (
            <li key={`${artist.slug}/${id}`} className="group relative w-[44%] shrink-0 snap-start sm:w-auto">
              <Link href={`/artists/${artist.slug}`} className="block">
                <span className="relative block aspect-[3/4] w-full overflow-hidden rounded-[1.25rem] bg-surface-2 shadow-sm">
                  {isNewWork(work) ? (
                    <span className="absolute left-2 top-2 z-10 rounded-full bg-accent px-2.5 py-1 text-[11px] font-semibold text-on-accent shadow-sm">
                      {t.newBadge}
                    </span>
                  ) : null}
                  {work.image ? (
                    <Photo
                      src={work.image}
                      alt={`${work.title} - ${artist.name}`}
                      sizes="(min-width:1024px) 190px, (min-width:640px) 31vw, 44vw"
                      hoverZoom
                    />
                  ) : (
                    <ArtTile color={work.color} variant={0} className="absolute inset-0 h-full w-full" />
                  )}
                  {count ? (
                    <span className="absolute bottom-2 left-2 z-10 rounded-full bg-black/45 px-2.5 py-1 text-xs font-semibold text-white backdrop-blur-md">
                      {t.trending.saves(count)}
                    </span>
                  ) : null}
                </span>
                <span className="mt-2 block line-clamp-3 h-[4.5em] px-1 text-sm font-medium leading-snug text-text sm:line-clamp-2 sm:h-[3em]">
                  {work.title}
                </span>
                {work.price ? <span className="block px-1 text-sm font-semibold text-text">{work.price} ₾</span> : null}
                <span className="block truncate px-1 text-xs text-muted">{artist.name}</span>
              </Link>
              <HeartButton
                id={`${artist.slug}/${id}`}
                className="absolute right-2 top-2 z-10 h-9 w-9 bg-white/90 text-text shadow-sm backdrop-blur transition after:absolute after:-inset-1 after:content-[''] hover:text-accent"
              />
            </li>
          );
        })}
      </ul>
    </section>
  );
}
