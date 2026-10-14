import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import ArtTile from "@/components/ArtTile";
import CopyLink from "@/components/CopyLink";
import HeartButton from "@/components/HeartButton";
import ShareButton from "@/components/ShareButton";
import WorkCard, { toWorkCard } from "@/components/WorkCard";
import { socialVariant } from "@/components/ui/socialStyles";
import { getWorkEntries, getWorkEntry } from "@/data/artists";
import { getCategoryBySlug, localizeCategory } from "@/data/categories";
import { dictionary } from "@/lib/dictionary";
import { getLang } from "@/lib/i18n";

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

  return (
    <div className="mx-auto max-w-7xl px-4 pb-28 pt-3 lg:pb-24 sm:px-6 sm:pt-6 lg:px-10">
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
        {/* ფოტო: მთლიანად ჩანს, არ იჭრება */}
        <div className="overflow-hidden rounded-[1.5rem] bg-surface shadow-sm">
          {work.image ? (
            <Image
              src={work.image}
              alt={work.title}
              width={work.width ?? 1000}
              height={work.height ?? 1250}
              sizes="(min-width: 1024px) 55vw, 100vw"
              className="mx-auto h-auto max-h-[80vh] w-auto max-w-full object-contain"
              priority
            />
          ) : (
            <ArtTile color={work.color} variant={0} className="aspect-[3/4] w-full" />
          )}
        </div>

        <div className="flex flex-col">
          <h1 className="text-balance text-3xl font-semibold leading-tight tracking-tight text-text sm:text-4xl">{work.title}</h1>
          <p className="mt-2 text-muted">
            {t.workPage.from}{" "}
            <Link href={`/artists/${artist.slug}`} className="font-medium text-text underline decoration-border underline-offset-4 hover:text-accent">
              {artist.name}
            </Link>
            {artist.city ? ` · ${artist.city}` : ""}
          </p>

          <p className="mt-6 text-sm leading-relaxed text-muted">{t.workPage.howToBuy}</p>
          <div className="mt-4 hidden lg:block">{cta}</div>
          <div className="mt-3 flex flex-wrap gap-2">
            <HeartButton id={`${artist.slug}/${entry.id}`} label className="min-h-11 border border-border bg-surface px-5 text-text hover:border-accent hover:text-accent" />
            <ShareButton title={work.title} className="min-h-11 border border-border bg-surface px-5 text-text hover:border-accent hover:text-accent" />
          </div>

          {work.materials || work.note ? (
            <section className="mt-6 rounded-[1.5rem] border border-border bg-surface p-5">
              <h2 className="text-lg font-semibold tracking-tight text-text">{t.workPage.details}</h2>
              {work.materials ? (
                <p className="mt-2 text-sm text-muted"><span className="font-medium text-text">{t.workPage.materials}:</span> {work.materials}</p>
              ) : null}
              {work.note ? <p className="mt-2 text-sm leading-relaxed text-muted">{work.note}</p> : null}
            </section>
          ) : null}

          {/* გაიცანი ავტორი */}
          <section className="mt-8 rounded-[1.5rem] border border-border bg-surface p-5">
            <h2 className="text-lg font-semibold tracking-tight text-text">{t.workPage.aboutMaker}</h2>
            <p className="mt-1 text-sm font-medium text-text">
              {artist.name}
              <span className="font-normal text-muted">
                {" "}
                · {artist.category}
                {artist.city ? ` · ${artist.city}` : ""}
              </span>
            </p>
            <p className="mt-3 text-sm leading-relaxed text-muted">{artist.bio}</p>
            <Link
              href={`/artists/${artist.slug}`}
              className="mt-4 inline-flex min-h-10 items-center rounded-full border border-border bg-bg px-5 text-sm font-medium text-text transition duration-300 hover:border-accent hover:text-accent"
            >
              {t.workPage.viewProfile} →
            </Link>
          </section>
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
