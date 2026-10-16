import Link from "next/link";
import { notFound } from "next/navigation";
import ArtTile from "@/components/ArtTile";
import HeartButton from "@/components/HeartButton";
import JsonLd from "@/components/JsonLd";
import PageBanner from "@/components/PageBanner";
import Photo from "@/components/Photo";
import { getTagBySlug, localizeTag, worksForTag } from "@/data/tags";
import { isNewWork, workId } from "@/data/artists";
import { dictionary } from "@/lib/dictionary";
import { getLang } from "@/lib/i18n";
import { SITE_URL } from "@/lib/site";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const raw = getTagBySlug((await params).slug);
  if (!raw) return {};
  const tag = localizeTag(raw, await getLang());
  return {
    title: tag.name,
    description: tag.description,
    openGraph: { title: tag.name, description: tag.description, images: ["/opengraph-image"] },
  };
}

// საჩუქრის თაგი: ამ მიზეზის ყველა ნამუშევარი ხელოვანის მიხედვით
export default async function GiftPage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ sort?: string }>;
}) {
  const lang = await getLang();
  const t = dictionary[lang];
  const raw = getTagBySlug((await params).slug);
  if (!raw) notFound();
  const sortParam = (await searchParams).sort;
  const sort = sortParam === "asc" || sortParam === "desc" ? sortParam : "";
  const entries = worksForTag(raw, lang);
  if (sort) {
    entries.sort((a, b) => (sort === "asc" ? (a.work.price ?? Infinity) - (b.work.price ?? Infinity) : (b.work.price ?? -1) - (a.work.price ?? -1)));
  }
  if (entries.length === 0) notFound();
  const tag = localizeTag(raw, lang);

  const crumbLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: t.nav.home, item: SITE_URL },
      { "@type": "ListItem", position: 2, name: tag.name, item: `${SITE_URL}/gifts/${tag.slug}` },
    ],
  };

  return (
    <div className="mx-auto max-w-7xl px-4 pb-16 pt-6 sm:px-6 sm:pb-24 sm:pt-10 lg:px-10">
      <JsonLd data={crumbLd} />
      <PageBanner
        title={`${tag.emoji} ${tag.name}`}
        text={tag.description}
        badge={t.artists.worksCount(entries.length)}
        collage={tag.collage}
      />

      <div className="mt-6 flex flex-wrap items-center gap-2 text-sm">
        <span className="text-muted">{t.sort.label}:</span>
        {([["", t.sort.default], ["asc", t.sort.asc], ["desc", t.sort.desc]] as const).map(([value, label]) => (
          <Link
            key={value}
            href={`/gifts/${tag.slug}${value ? `?sort=${value}` : ""}`}
            replace
            scroll={false}
            aria-current={sort === value ? "true" : undefined}
            className={`inline-flex min-h-9 items-center rounded-full border px-3 font-medium transition ${
              sort === value ? "border-accent bg-accent text-on-accent" : "border-border bg-bg text-text hover:border-accent hover:text-accent"
            }`}
          >
            {label}
          </Link>
        ))}
      </div>
      <p className="mt-2 text-sm text-muted">{t.priceNote}</p>

      <ul className="mt-6 grid grid-cols-2 gap-x-3 gap-y-5 sm:grid-cols-3 sm:gap-x-4 sm:gap-y-6 lg:grid-cols-4 xl:grid-cols-5">
        {entries.map(({ artist, work, index }) => (
          <li key={`${artist.slug}/${index}`} className="group relative">
            <Link href={`/artists/${artist.slug}`} className="block">
              <span className="relative block aspect-[3/4] w-full overflow-hidden rounded-[1.25rem] bg-surface-2 shadow-sm">
                {isNewWork(work) ? <span className="absolute left-2 top-2 z-10 rounded-full bg-accent px-2.5 py-1 text-[11px] font-semibold text-on-accent shadow-sm">{t.newBadge}</span> : null}
                {work.image ? (
                  <Photo
                    src={work.image}
                    alt={`${work.title} - ${artist.name}`}
                    sizes="(min-width:1280px) 240px, (min-width:1024px) 23vw, (min-width:640px) 31vw, 46vw"
                    hoverZoom
                  />
                ) : (
                  <ArtTile color={work.color} variant={0} className="absolute inset-0 h-full w-full" />
                )}
              </span>
              <span className="mt-2 block line-clamp-3 h-[4.5em] sm:line-clamp-2 sm:h-[3em] px-1 text-sm font-medium leading-snug text-text sm:text-base">{work.title}</span>
              {work.price ? <span className="block px-1 text-sm font-semibold text-text sm:text-base">{work.price} ₾</span> : null}
              <span className="block truncate px-1 text-xs text-muted sm:text-sm">{artist.name}</span>
            </Link>
            <HeartButton
              id={`${artist.slug}/${workId(work, index)}`}
              className="absolute right-2 top-2 z-10 h-9 w-9 bg-white/90 text-text shadow-sm backdrop-blur transition after:absolute after:-inset-1 after:content-[''] hover:text-accent"
            />
          </li>
        ))}
      </ul>
    </div>
  );
}
