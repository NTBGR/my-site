import Image from "next/image";
import { notFound } from "next/navigation";
import ArtistTabs from "@/components/ArtistTabs";
import ShareButton from "@/components/ShareButton";
import WorkCard from "@/components/WorkCard";
import { BLUR_DATA_URL } from "@/lib/blur";
import { toWorkCard } from "@/lib/workCard";
import Link from "next/link";
import type { ReactNode } from "react";
import CopyLink from "@/components/CopyLink";
import { socialVariant } from "@/components/ui/socialStyles";
import { getArtistBySlug, localizeArtist, workId } from "@/data/artists";
import { categoryColor, getCategoryBySlug, localizeCategory } from "@/data/categories";
import { dictionary } from "@/lib/dictionary";
import { getLang } from "@/lib/i18n";

function InstagramIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      className="h-5 w-5"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      aria-hidden
    >
      <rect x="3.5" y="3.5" width="17" height="17" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.2" cy="6.8" r="0.9" fill="currentColor" stroke="none" />
    </svg>
  );
}

function FacebookIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor" aria-hidden>
      <path d="M13.5 21v-7.5H16l.5-3h-3V8.8c0-.9.3-1.5 1.6-1.5h1.5V4.6c-.3 0-1.2-.1-2.2-.1-2.3 0-3.9 1.4-3.9 4v2H7.5v3H10V21h3.5Z" />
    </svg>
  );
}


function SocialLink({
  href,
  icon,
  label,
  variant,
  message,
}: {
  href?: string;
  message: string;
  icon: ReactNode;
  label: string;
  variant: keyof typeof socialVariant;
}) {
  const base =
    "inline-flex min-h-11 items-center justify-center gap-1.5 rounded-full border px-3.5 text-sm font-medium sm:gap-2.5 sm:px-5";

  // ბმული ჯერ არ არის: ღილაკი მაინც ჩანს, ოღონდ მკრთალია
  if (!href) {
    return (
      <span aria-disabled="true" title={label} className={`${base} ${socialVariant[variant]} cursor-not-allowed opacity-40`}>
        {icon}
        <span>{label}</span>
      </span>
    );
  }

  return (
    <CopyLink
      href={href}
      message={message}
      className={`group ${base} ${socialVariant[variant]} transition duration-300 hover:-translate-y-0.5 active:scale-95`}
    >
      {icon}
      <span>{label}</span>
      <span className="-ml-1 hidden opacity-60 transition duration-300 group-hover:translate-x-0.5 group-hover:opacity-100 sm:inline" aria-hidden>
        ↗
      </span>
    </CopyLink>
  );
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const raw = getArtistBySlug(slug);
  if (!raw) return {};
  const artist = localizeArtist(raw, await getLang());
  const title = `${artist.name} — ${artist.category}`;
  return {
    title,
    description: artist.bio,
    alternates: { canonical: `/artists/${artist.slug}` },
    openGraph: { title, description: artist.bio, type: "profile", images: ["/opengraph-image"] },
  };
}

export default async function ArtistPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const lang = await getLang();
  const all = dictionary[lang];
  const t = all.artist;
  const { slug } = await params;
  const raw = getArtistBySlug(slug);
  const artist = raw ? localizeArtist(raw, lang) : undefined;

  if (!artist) notFound();

  const main = artist.categories[0] ?? "nakhatebi";
  // ბანერის ფილაში ქავერი (ან პირველი ნამუშევრის ფოტო); თუ არცერთია, კატეგორიის ილუსტრაცია
  const firstPhoto = artist.works.find((work) => work.image)?.image;
  const bannerPhoto = artist.banner || artist.cover || firstPhoto;
  const color = categoryColor(main);
  const cats = artist.categories
    .map((slug) => getCategoryBySlug(slug))
    .filter((c) => c !== undefined)
    .map((c) => localizeCategory(c, lang));
  const instagram = artist.instagram ? `/go/${artist.slug}/instagram` : undefined;
  const facebook = artist.facebook ? `/go/${artist.slug}/facebook` : undefined;

  const avatar = artist.cover || firstPhoto;
  const oneLiner = artist.bio.split(/(?<=[.!?])\s/)[0];
  const workCards = artist.works.map((w, i) => toWorkCard({ artist, work: w, index: i, id: workId(w, i) }, i));

  return (
    <div className="mx-auto max-w-7xl px-4 pb-16 pt-1 sm:px-6 sm:pb-24 sm:pt-3 lg:px-10">
      <Link
        href="/artists"
        className="inline-flex min-h-9 items-center text-sm font-medium text-muted transition-colors hover:text-accent"
      >
        {t.back}
      </Link>

      {/* მაღაზიის ზედა ნაწილი: ფართო სურათი (cover), მრგვალი ავატარი, სახელი, ქალაქი, ერთხაზიანი აღწერა */}
      <section className="mt-2 overflow-hidden rounded-[1.5rem] border border-border bg-surface shadow-sm lg:rounded-[2rem]">
        <div
          className="relative h-32 sm:h-48"
          style={{ background: `linear-gradient(135deg, color-mix(in srgb, ${color}, white 14%), ${color} 55%, color-mix(in srgb, ${color}, black 34%))` }}
        >
          {bannerPhoto ? (
            <Image src={bannerPhoto} alt="" fill sizes="(min-width: 1280px) 1200px, 100vw" priority placeholder="blur" blurDataURL={BLUR_DATA_URL} className="object-cover opacity-60 mix-blend-multiply" />
          ) : null}
          <div aria-hidden className="absolute inset-0 bg-gradient-to-t from-black/25 to-transparent" />
        </div>
        <div className="px-5 pb-6 sm:px-8">
          <div className="-mt-12 flex items-end justify-between gap-3 sm:-mt-14">
            <span className="relative block h-24 w-24 shrink-0 overflow-hidden rounded-full bg-surface-2 shadow-lg ring-4 ring-surface sm:h-28 sm:w-28">
              {avatar ? <Image src={avatar} alt={artist.name} fill sizes="112px" placeholder="blur" blurDataURL={BLUR_DATA_URL} className="object-cover" /> : null}
            </span>
            <ShareButton title={artist.name} label={all.ui.shareProfile} className="min-h-11 border border-border bg-surface px-5 text-text hover:border-accent hover:text-accent" />
          </div>
          <h1 className="mt-3 text-balance text-3xl font-semibold leading-tight tracking-tight text-text sm:text-4xl">{artist.name}</h1>
          <p className="mt-1 text-sm text-muted">
            {artist.category}
            {artist.city ? ` · ${artist.city}` : ""} · {all.artists.worksCount(artist.works.length)}
          </p>
          <p className="mt-3 max-w-2xl text-base leading-relaxed text-text/80">{oneLiner}</p>
          <p className="mt-4 text-sm font-medium text-muted">{t.buyHint}</p>
          <div className="mt-2 flex flex-wrap gap-2">
            <SocialLink href={instagram} icon={<InstagramIcon />} label={t.instagram} variant="instagram" message={t.dmMessageArtist} />
            <SocialLink href={facebook} icon={<FacebookIcon />} label={t.facebook} variant="facebook" message={t.dmMessageArtist} />
          </div>
        </div>
      </section>

      <ArtistTabs
        worksLabel={all.ui.tabWorks}
        storyLabel={all.ui.tabStory}
        works={
          <ul className="mt-6 grid grid-cols-2 gap-x-3 gap-y-5 sm:grid-cols-3 sm:gap-x-4 sm:gap-y-6 lg:grid-cols-4 xl:grid-cols-5">
            {workCards.map((card, i) => (
              <li key={card.key}>
                <WorkCard card={card} priority={i < 4} />
              </li>
            ))}
          </ul>
        }
        story={
          <div className="mt-6 grid gap-4 lg:grid-cols-[3fr_2fr]">
            <div className="rounded-[1.75rem] border border-border bg-surface p-6 sm:p-8">
              <h2 className="text-sm font-semibold uppercase tracking-wider text-muted">{t.about}</h2>
              <p className="mt-3 text-lg leading-relaxed text-text sm:text-xl">{artist.bio}</p>
              {cats.length > 1 ? (
                <div className="mt-5 flex flex-wrap items-center gap-2 text-sm">
                  <span className="text-muted">{t.alsoIn}</span>
                  {cats.map((c) => (
                    <Link
                      key={c.slug}
                      href={`/categories/${c.slug}`}
                      className="inline-flex min-h-11 items-center rounded-full border border-border bg-bg px-4 font-medium text-text transition hover:border-accent hover:text-accent"
                    >
                      {c.name}
                    </Link>
                  ))}
                </div>
              ) : null}
            </div>
            <div className="flex flex-col justify-center rounded-[1.75rem] bg-accent-soft p-6 sm:p-8">
              <h2 className="text-2xl font-semibold tracking-tight text-text">{t.ctaTitle}</h2>
              <p className="mt-2 leading-relaxed text-text/75">{t.ctaText}</p>
              <div className="mt-5 flex flex-wrap gap-2">
                <SocialLink href={instagram} icon={<InstagramIcon />} label={t.instagram} variant="instagram" message={t.dmMessageArtist} />
                <SocialLink href={facebook} icon={<FacebookIcon />} label={t.facebook} variant="facebook" message={t.dmMessageArtist} />
              </div>
            </div>
          </div>
        }
      />
    </div>
  );
}
