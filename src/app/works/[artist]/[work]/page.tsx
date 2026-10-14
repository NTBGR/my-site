import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import ArtTile from "@/components/ArtTile";
import CopyLink from "@/components/CopyLink";
import HeartButton from "@/components/HeartButton";
import ShareButton from "@/components/ShareButton";
import WorkCard from "@/components/WorkCard";
import WorkGallery from "@/components/WorkGallery";
import { socialVariant } from "@/components/ui/socialStyles";
import { getWorkEntries, getWorkEntry } from "@/data/artists";
import { getCategoryBySlug, localizeCategory } from "@/data/categories";
import { BLUR_DATA_URL } from "@/lib/blur";
import { dictionary } from "@/lib/dictionary";
import { getLang } from "@/lib/i18n";
import { formatPrice } from "@/lib/price";
import { toWorkCard } from "@/lib/workCard";

type Params = Promise<{ artist: string; work: string }>;

export async function generateMetadata({ params }: { params: Params }) {
  const { artist, work } = await params;
  const entry = getWorkEntry(await getLang(), artist, work);
  if (!entry) return {};
  const title = `${entry.work.title} — ${entry.artist.name}`;
  const description = `${entry.work.title}: ${entry.artist.bio}`;
  return {
    title,
    description,
    alternates: { canonical: `/works/${entry.artist.slug}/${entry.id}` },
    openGraph: { title, description, type: "website", images: entry.work.image ? [entry.work.image] : ["/opengraph-image"] },
  };
}

const accordion = "group rounded-[1.25rem] border border-border bg-surface px-5 py-4";
const summary = "flex min-h-8 cursor-pointer list-none items-center justify-between gap-3 text-base font-semibold text-text [&::-webkit-details-marker]:hidden";

export default async function WorkPage({ params }: { params: Params }) {
  const { artist: artistSlug, work: workIdParam } = await params;
  const lang = await getLang();
  const t = dictionary[lang];
  const entry = getWorkEntry(lang, artistSlug, workIdParam);
  if (!entry) notFound();

  const { artist, work, index } = entry;
  const category = getCategoryBySlug(artist.categories[0] ?? "");
  const categoryName = category ? localizeCategory(category, lang).name : undefined;
  const network = /facebook\.com|fb\.com|fb\.me/i.test(work.url || artist.instagram || artist.facebook) ? "facebook" : "instagram";
  const canMessage = Boolean(work.url || artist.instagram || artist.facebook);
  const more = getWorkEntries(lang)
    .filter((e) => e.artist.slug === artist.slug && e.id !== entry.id)
    .slice(0, 6);
  const similar = getWorkEntries(lang)
    .filter((e) => e.artist.slug !== artist.slug && e.artist.categories.some((c) => artist.categories.includes(c)))
    .slice(0, 6);
  const avatar = artist.cover || artist.works.find((w) => w.image)?.image;
  const photos = [
    ...(work.image ? [{ src: work.image, width: work.width, height: work.height }] : []),
    ...(work.images ?? []).map((src) => ({ src })),
  ];
  const cta = canMessage ? (
    <CopyLink
      href={`/go/${artist.slug}/w${index}`}
      message={t.artist.dmMessage(work.title)}
      className={`inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-full border px-6 text-base font-medium transition duration-300 hover:-translate-y-0.5 active:scale-95 ${socialVariant[network]}`}
    >
      {network === "facebook" ? t.artist.messageOnFacebook : t.artist.messageOnInstagram} ↗
    </CopyLink>
  ) : null;
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "CreativeWork",
    name: work.title,
    creator: { "@type": "Person", name: artist.name },
    image: work.image ? `https://khelovani.vercel.app${work.image}` : undefined,
    description: work.note || artist.bio,
    inLanguage: lang,
  };
  const badges = [work.isNew ? t.ui.isNew : null, work.unique ? t.ui.unique : null, work.madeToOrder ? t.ui.madeToOrder : null].filter(Boolean) as string[];

  return (
    <div className="mx-auto max-w-7xl px-4 pb-28 pt-3 sm:px-6 sm:pt-6 lg:px-10 lg:pb-24">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      {/* ნავიგაციის ბილიკი */}
      <nav aria-label="breadcrumb" className="mb-4 flex flex-wrap items-center gap-x-2 gap-y-1 text-sm text-muted">
        <Link href="/" className="hover:text-accent">{t.workPage.home}</Link>
        <span aria-hidden>›</span>
        {category && categoryName ? (
          <>
            <Link href={`/categories/${category.slug}`} className="hover:text-accent">{categoryName}</Link>
            <span aria-hidden>›</span>
          </>
        ) : null}
        <Link href={`/artists/${artist.slug}`} className="hover:text-accent">{artist.name}</Link>
      </nav>

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)] lg:gap-12">
        {photos.length > 0 ? (
          <WorkGallery photos={photos} title={work.title} />
        ) : (
          <div className="overflow-hidden rounded-[1.5rem]">
            <ArtTile color={work.color} variant={0} className="aspect-[4/5] w-full" />
          </div>
        )}

        <div className="flex flex-col">
          {/* ფასი → სათაური → ავტორი */}
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5">
            <p className="text-2xl font-semibold text-text sm:text-3xl">
              {work.price ? formatPrice(work.price) : <span className="text-lg font-normal text-muted sm:text-xl">{t.ui.priceOnRequest}</span>}
            </p>
            {badges.map((label) => (
              <span key={label} className="rounded-full border border-border bg-surface px-2.5 py-0.5 text-xs font-medium text-text">
                {label}
              </span>
            ))}
          </div>
          <h1 className="mt-2 text-balance text-xl font-semibold leading-snug tracking-tight text-text sm:text-3xl">{work.title}</h1>

          <Link href={`/artists/${artist.slug}`} className="group mt-3 flex items-center gap-3 rounded-2xl border border-border bg-surface p-3 transition duration-300 hover:border-accent">
            <span className="relative block h-12 w-12 shrink-0 overflow-hidden rounded-full bg-surface-2">
              {avatar ? <Image src={avatar} alt="" fill sizes="48px" placeholder="blur" blurDataURL={BLUR_DATA_URL} className="object-cover" /> : null}
            </span>
            <span className="min-w-0">
              <span className="block truncate font-semibold text-text group-hover:text-accent">{artist.name}</span>
              <span className="block truncate text-sm text-muted">
                {artist.category}
                {artist.city ? ` · ${artist.city}` : ""}
              </span>
            </span>
            <span className="ml-auto text-muted" aria-hidden>→</span>
          </Link>

          <div className="mt-4 hidden lg:block">{cta}</div>
          <p className="mt-3 text-sm leading-relaxed text-muted">{t.workPage.howToBuy}</p>
          <div className="mt-3 flex flex-wrap gap-2">
            <HeartButton id={`${artist.slug}/${entry.id}`} label className="min-h-11 border border-border bg-surface px-5 text-text hover:border-accent hover:text-accent" />
            <ShareButton title={work.title} className="min-h-11 border border-border bg-surface px-5 text-text hover:border-accent hover:text-accent" />
          </div>

          {/* ჩამოსაშლელი ბლოკები */}
          <div className="mt-6 space-y-3">
            <details className={accordion} open>
              <summary className={summary}>
                {t.workPage.details}
                <span aria-hidden className="text-muted transition group-open:rotate-45">+</span>
              </summary>
              <dl className="mt-3 space-y-1.5 text-sm text-muted">
                {work.materials ? (
                  <div><dt className="inline font-medium text-text">{t.workPage.materials}: </dt><dd className="inline">{work.materials}</dd></div>
                ) : null}
                {work.size ? (
                  <div><dt className="inline font-medium text-text">{t.ui.size}: </dt><dd className="inline">{work.size}</dd></div>
                ) : null}
                <div><dt className="inline font-medium text-text">{t.workPage.from}: </dt><dd className="inline">{artist.name}</dd></div>
                {work.note ? <p className="pt-1 leading-relaxed">{work.note}</p> : null}
              </dl>
            </details>
            <details className={accordion}>
              <summary className={summary}>
                {t.ui.deliveryTitle}
                <span aria-hidden className="text-muted transition group-open:rotate-45">+</span>
              </summary>
              <p className="mt-3 text-sm leading-relaxed text-muted">{t.ui.deliveryText}</p>
            </details>
            {work.madeToOrder ? (
              <details className={accordion}>
                <summary className={summary}>
                  {t.ui.orderTitle}
                  <span aria-hidden className="text-muted transition group-open:rotate-45">+</span>
                </summary>
                <p className="mt-3 text-sm leading-relaxed text-muted">{t.ui.orderText}</p>
              </details>
            ) : null}
          </div>
        </div>
      </div>

      {more.length > 0 ? (
        <section className="mt-12 sm:mt-16">
          <h2 className="text-2xl font-semibold tracking-tight text-text sm:text-3xl">{t.workPage.moreFrom(artist.name)}</h2>
          <ul className="mt-5 grid grid-cols-2 gap-x-3 gap-y-5 sm:grid-cols-3 sm:gap-x-4 sm:gap-y-6 lg:grid-cols-5 xl:grid-cols-6">
            {more.map((e) => (
              <li key={e.id}>
                <WorkCard card={toWorkCard(e)} />
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      {similar.length > 0 ? (
        <section className="mt-12 sm:mt-16">
          <h2 className="text-2xl font-semibold tracking-tight text-text sm:text-3xl">{t.workPage.similar}</h2>
          <ul className="mt-5 grid grid-cols-2 gap-x-3 gap-y-5 sm:grid-cols-3 sm:gap-x-4 sm:gap-y-6 lg:grid-cols-5 xl:grid-cols-6">
            {similar.map((e) => (
              <li key={`${e.artist.slug}-${e.id}`}>
                <WorkCard card={toWorkCard(e)} />
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      {/* ტელეფონზე ქვემოთ მიმაგრებული ღილაკი: გვერდის ჩამოსქროლვისას ჩანს */}
      {cta ? (
        <div className="fixed inset-x-0 bottom-0 z-30 border-t border-border bg-[color-mix(in_srgb,var(--bg)_92%,transparent)] px-4 py-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] backdrop-blur-xl lg:hidden">
          {cta}
        </div>
      ) : null}
    </div>
  );
}
