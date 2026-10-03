import Link from "next/link";
import type { ReactNode } from "react";
import { variantFor } from "@/components/ArtTile";
import PageHeader from "@/components/PageHeader";
import WorksGallery from "@/components/WorksGallery";
import { getArtistBySlug, localizeArtist } from "@/data/artists";
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

// ტელეფონზე მხოლოდ ხატულა, უფრო დიდ ეკრანზე ხატულა + სახელი
function SocialLink({
  href,
  icon,
  label,
}: {
  href?: string;
  icon: ReactNode;
  label: string;
}) {
  const base =
    "inline-flex h-11 min-w-11 items-center justify-center gap-2.5 rounded-full border border-border bg-surface px-4 text-sm font-medium sm:px-5";

  // ბმული ჯერ არ არის: ღილაკი მაინც ჩანს, ოღონდ მკრთალია
  if (!href) {
    return (
      <span
        aria-disabled="true"
        title={label}
        className={`${base} cursor-not-allowed text-muted opacity-50`}
      >
        {icon}
        <span>{label}</span>
      </span>
    );
  }

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={label}
      title={label}
      className={`group ${base} text-text transition duration-300 hover:-translate-y-0.5 hover:border-accent hover:text-accent hover:shadow-md`}
    >
      {icon}
      <span>{label}</span>
      <span
        className="-ml-1 hidden translate-x-0 opacity-50 transition duration-300 group-hover:translate-x-0.5 group-hover:opacity-100 sm:inline"
        aria-hidden
      >
        ↗
      </span>
    </a>
  );
}

const chipClass =
  "inline-flex items-center rounded-full border border-border bg-surface px-3 py-1 text-xs font-medium text-muted sm:text-sm";

export function generateMetadata({ params }: { params: { slug: string } }) {
  const raw = getArtistBySlug(params.slug);
  if (!raw) return {};
  const artist = localizeArtist(raw, getLang());
  const title = `${artist.name} — ${artist.category}`;
  return {
    title,
    description: artist.bio,
    openGraph: { title, description: artist.bio, type: "profile", images: ["/opengraph-image"] },
  };
}

export default function ArtistPage({
  params,
}: {
  params: { slug: string };
}) {
  const lang = getLang();
  const t = dictionary[lang].artist;
  const raw = getArtistBySlug(params.slug);
  const artist = raw ? localizeArtist(raw, lang) : undefined;

  if (!artist) {
    return (
      <PageHeader title={t.notFoundTitle} text={t.notFoundText}>
        <Link
          href="/artists"
          className="inline-flex items-center rounded-full bg-accent px-6 py-3 text-sm font-medium text-on-accent transition duration-300 hover:-translate-y-0.5 hover:bg-accent-hover hover:shadow-lg"
        >
          {t.list}
        </Link>
      </PageHeader>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 pb-16 pt-6 sm:px-6 sm:pb-24 sm:pt-10 lg:px-10">
      {/* კომპაქტური სათაური */}
      <Link
        href="/artists"
        className="inline-flex min-h-10 items-center text-sm font-medium text-muted transition-colors hover:text-accent"
      >
        {t.back}
      </Link>

      <div className="mt-3 flex flex-wrap items-end justify-between gap-x-6 gap-y-4">
        <div>
          <div className="flex flex-wrap gap-2">
            <span className={chipClass}>{artist.category}</span>
          </div>
          <h1 className="mt-3 text-balance text-3xl font-semibold leading-[1.1] tracking-tight text-text sm:text-5xl">
            {artist.name}
          </h1>
        </div>

        <div>
          <p className="mb-2 text-sm font-medium text-muted">{t.buyHint}</p>
          <div className="flex gap-2">
            <SocialLink
              href={artist.instagram ? `/go/${artist.slug}/instagram` : undefined}
              icon={<InstagramIcon />}
              label={t.instagram}
            />
            <SocialLink
              href={artist.facebook ? `/go/${artist.slug}/facebook` : undefined}
              icon={<FacebookIcon />}
              label={t.facebook}
            />
          </div>
        </div>
      </div>

      {/* ნამუშევრები ჯერ: ერთნაირი 9:16 ბარათები */}
      <div className="mt-6 sm:mt-8">
        <WorksGallery
          works={artist.works.map((work, i) => ({
            title: work.title,
            color: work.color,
            variant: (variantFor(artist.slug) + i) % 4,
            url: (work.url || artist.instagram || artist.facebook) ? `/go/${artist.slug}/w${i}` : undefined,
            image: work.image,
            width: work.width,
            height: work.height,
          }))}
        />
      </div>

      {/* აღწერა ქვემოთ */}
      <section className="mt-10 max-w-3xl sm:mt-14">
        <h2 className="text-sm font-semibold uppercase tracking-wider text-muted">
          {t.about}
        </h2>
        <p className="mt-3 text-lg leading-relaxed text-text sm:text-xl">
          {artist.bio}
        </p>
      </section>
    </div>
  );
}
