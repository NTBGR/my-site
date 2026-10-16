import Link from "next/link";
import { notFound } from "next/navigation";
import JsonLd from "@/components/JsonLd";
import PageBanner from "@/components/PageBanner";
import WorksGallery from "@/components/WorksGallery";
import { effectivePrice } from "@/data/artists";
import { getTagBySlug, localizeTag, worksForTag } from "@/data/tags";
import { dictionary } from "@/lib/dictionary";
import { toGalleryWork } from "@/lib/galleryWork";
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
  searchParams: Promise<{ sort?: string; max?: string }>;
}) {
  const lang = await getLang();
  const t = dictionary[lang];
  const raw = getTagBySlug((await params).slug);
  if (!raw) notFound();
  const query = await searchParams;
  const sortParam = query.sort;
  const sort = sortParam === "asc" || sortParam === "desc" ? sortParam : "";
  const all = worksForTag(raw, lang);
  if (all.length === 0) notFound();
  // ფასის ფილტრი: მხოლოდ ის საფეხურები, რომლებიც ამ სიას რეალურად ყოფს (ყველა ნამუშევარი 100-მდეა: „100-მდე“ აზრს არ ატარებს)
  const prices = all.map((entry) => effectivePrice(entry.artist, entry.work)).filter((price): price is number => price !== undefined);
  const buckets = [50, 100, 150, 200, 300].filter((limit) => prices.some((p) => p <= limit) && prices.some((p) => p > limit));
  const maxParam = Number(query.max);
  const max = buckets.includes(maxParam) ? maxParam : 0;
  const entries = max ? all.filter((entry) => {
        const price = effectivePrice(entry.artist, entry.work);
        return price !== undefined && price <= max;
      }) : all;
  const hrefFor = (sortValue: string, maxValue: number) => {
    const params = new URLSearchParams();
    if (sortValue) params.set("sort", sortValue);
    if (maxValue) params.set("max", String(maxValue));
    const qs = params.toString();
    return `/gifts/${raw.slug}${qs ? `?${qs}` : ""}`;
  };
  if (sort) {
    entries.sort((a, b) => (sort === "asc" ? (effectivePrice(a.artist, a.work) ?? Infinity) - (effectivePrice(b.artist, b.work) ?? Infinity) : (effectivePrice(b.artist, b.work) ?? -1) - (effectivePrice(a.artist, a.work) ?? -1)));
  }
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
        badge={t.artists.worksCount(all.length)}
        collage={tag.collage}
      />

      <div className="mt-6 flex flex-wrap items-center gap-2 text-sm">
        <span className="text-muted">{t.sort.label}:</span>
        {([["", t.sort.default], ["asc", t.sort.asc], ["desc", t.sort.desc]] as const).map(([value, label]) => (
          <Link
            key={value}
            href={hrefFor(value, max)}
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
      {buckets.length > 0 ? (
        <div className="mt-3 flex flex-wrap items-center gap-2 text-sm">
          <span className="text-muted">{t.priceFilter.label}:</span>
          {([[0, t.priceFilter.all], ...buckets.map((limit) => [limit, t.priceFilter.upTo(limit)] as const)] as const).map(([limit, label]) => (
            <Link
              key={limit}
              href={hrefFor(sort, limit)}
              replace
              scroll={false}
              aria-current={max === limit ? "true" : undefined}
              className={`inline-flex min-h-9 items-center rounded-full border px-3 font-medium transition ${
                max === limit ? "border-accent bg-accent text-on-accent" : "border-border bg-bg text-text hover:border-accent hover:text-accent"
              }`}
            >
              {label}
            </Link>
          ))}
          {max ? <span className="text-muted">· {t.artists.worksCount(entries.length)}</span> : null}
        </div>
      ) : null}
      <p className="mt-2 text-sm text-muted">{t.priceNote}</p>

      <div className="mt-6">
        <WorksGallery
          works={entries.map(({ artist, work, index }) => toGalleryWork(artist, work, index, { showArtist: true }))}
          showSort={false}
        />
      </div>
    </div>
  );
}
