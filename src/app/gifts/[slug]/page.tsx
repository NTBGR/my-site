import Link from "next/link";
import BackLink from "@/components/BackLink";
import { notFound } from "next/navigation";
import JsonLd from "@/components/JsonLd";
import PageBanner from "@/components/PageBanner";
import Snowfall from "@/components/Snowfall";
import WorksGallery from "@/components/WorksGallery";
import { effectivePrice } from "@/data/artists";
import { newYearBanner } from "@/data/featured";
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

// კომპაქტური სეგმენტირებული არჩევანი (ბმულებით): მიმდინარე არჩევანი ივსება აქცენტით
function Segmented({ label, items }: { label: string; items: { key: string; label: string; href: string; active: boolean }[] }) {
  return (
    <div role="group" aria-label={label} className="inline-flex max-w-full overflow-x-auto rounded-full border border-border bg-surface p-1 text-[13px] font-medium [scrollbar-width:none] sm:text-sm [&::-webkit-scrollbar]:hidden">
      {items.map((item) => (
        <Link
          key={item.key}
          href={item.href}
          replace
          scroll={false}
          aria-current={item.active ? "true" : undefined}
          className={`inline-flex min-h-8 shrink-0 items-center whitespace-nowrap rounded-full px-3 transition ${
            item.active ? "bg-accent text-on-accent" : "text-muted hover:text-accent"
          }`}
        >
          {item.label}
        </Link>
      ))}
    </div>
  );
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
  // საახალწლო ბანერზე სამი რეალური ნამუშევარი სამი სხვადასხვა ხელოვანისგან (ახლები წინ)
  const festivePhotos = raw.festive
    ? [
        ...newYearBanner.flatMap((key) => all.filter((entry) => `${entry.artist.slug}/${entry.id}` === key)),
        ...all.filter((entry, i, list) => entry.work.image && list.findIndex((e) => e.artist.slug === entry.artist.slug) === i),
      ]
        .filter((entry, i, list) => entry.work.image && list.indexOf(entry) === i)
        .slice(0, 3)
        .map((entry) => ({ src: entry.work.image as string, alt: `${entry.work.title} - ${entry.artist.name}` }))
    : undefined;

  const crumbLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: t.nav.home, item: SITE_URL },
      { "@type": "ListItem", position: 2, name: tag.name, item: `${SITE_URL}/gifts/${tag.slug}` },
    ],
  };

  return (
    <div className="mx-auto max-w-7xl px-4 pb-16 pt-1 sm:px-6 sm:pb-24 sm:pt-3 lg:px-10">
      <BackLink href="/" home />
      <JsonLd data={crumbLd} />
      {raw.festive ? <Snowfall /> : null}
      <PageBanner
        title={`${tag.emoji} ${tag.name}`}
        text={tag.description}
        badge={t.artists.worksCount(all.length)}
        collage={tag.collage}
        festive={raw.festive}
        festivePhotos={festivePhotos}
      />

      {/* დალაგება და ფასის ფილტრი: კომპაქტური სეგმენტები, ტელეფონზე ერთ-ერთ რიგში გვერდზე გადასახვევი */}
      <div className="mt-5 flex flex-col gap-2 sm:flex-row sm:flex-wrap sm:items-center sm:gap-x-4">
        <Segmented
          label={t.sort.label}
          items={([["", t.sort.default], ["asc", t.sort.short.asc], ["desc", t.sort.short.desc]] as const).map(([value, label]) => ({
            key: value,
            label,
            href: hrefFor(value, max),
            active: sort === value,
          }))}
        />
        {buckets.length > 0 ? (
          <Segmented
            label={t.priceFilter.label}
            items={([[0, t.priceFilter.all], ...buckets.map((limit) => [limit, t.priceFilter.upTo(limit)] as const)] as const).map(([limit, label]) => ({
              key: String(limit),
              label,
              href: hrefFor(sort, limit),
              active: max === limit,
            }))}
          />
        ) : null}
        {max ? <span className="text-sm text-muted">{t.artists.worksCount(entries.length)}</span> : null}
      </div>
      <p className="mt-2 text-xs leading-relaxed text-muted sm:text-sm">{t.priceNote}</p>

      <div className="mt-6">
        <WorksGallery
          works={entries.map(({ artist, work, index }) => toGalleryWork(artist, work, index, { showArtist: true }))}
          showSort={false}
        />
      </div>
    </div>
  );
}
