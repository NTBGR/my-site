import Link from "next/link";
import type { ReactNode } from "react";
import { variantFor } from "@/components/ArtTile";
import CategoryArt from "@/components/CategoryArt";
import PageHeader from "@/components/PageHeader";
import BannerPhotos from "@/components/BannerPhotos";
import CopyLink from "@/components/CopyLink";
import WorksGallery from "@/components/WorksGallery";
import { socialVariant } from "@/components/ui/socialStyles";
import { getArtistBySlug, localizeArtist } from "@/data/artists";
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

  const main = artist.categories[0] ?? "nakhatebi";
  // ბანერის ფილაში ქავერი (ან პირველი ნამუშევრის ფოტო); თუ არცერთია, კატეგორიის ილუსტრაცია
  const firstPhoto = artist.works.find((work) => work.image)?.image;
  const bannerPhoto = artist.banner || artist.cover || firstPhoto;
  const cover = bannerPhoto ? { image: bannerPhoto } : undefined;
  // ბანერში ტრიალებს ქავერი (პირველი) და ხელოვანის ყველა ნამუშევარი
  const bannerImages = bannerPhoto
    ? [bannerPhoto, ...artist.works.map((work) => work.image).filter((src): src is string => !!src && src !== bannerPhoto)]
    : [];
  const color = categoryColor(main);
  const cats = artist.categories
    .map((slug) => getCategoryBySlug(slug))
    .filter((c) => c !== undefined)
    .map((c) => localizeCategory(c, lang));
  const instagram = artist.instagram ? `/go/${artist.slug}/instagram` : undefined;
  const facebook = artist.facebook ? `/go/${artist.slug}/facebook` : undefined;

  return (
    <div className="mx-auto max-w-7xl px-4 pb-16 pt-4 sm:px-6 sm:pb-24 sm:pt-8 lg:px-10">
      <Link
        href="/artists"
        className="inline-flex min-h-10 items-center text-sm font-medium text-muted transition-colors hover:text-accent"
      >
        {t.back}
      </Link>

      {/* ბანერი ხელოვანის მთავარი კატეგორიის ფერში */}
      <section
        className="relative isolate mt-2 overflow-hidden rounded-[1.5rem] text-white shadow-lg lg:rounded-[2rem]"
        style={{
          background: `linear-gradient(135deg, color-mix(in srgb, ${color}, white 14%), ${color} 55%, color-mix(in srgb, ${color}, black 34%))`,
        }}
      >
        {/* დესკტოპი/პლანშეტი: მცურავი ფილა მარჯვნივ, მთლიანად ჩანს */}
        <div
          aria-hidden
          className={`absolute right-[6%] top-1/2 hidden -translate-y-1/2 sm:block ${cover ? "w-[16%] max-w-[10rem]" : "w-[24%] max-w-[15rem]"}`}
        >
          <div
            className="float overflow-hidden rounded-[1.25rem] shadow-2xl ring-4 ring-white/15"
            style={{ ["--r" as string]: "4deg" }}
          >
            {cover?.image ? (
              <BannerPhotos images={bannerImages} sizes="160px" priority />
            ) : (
              <CategoryArt slug={main} color={color} className="aspect-[4/3]" />
            )}
          </div>
        </div>
        {/* მობილურზე: პატარა ილუსტრაცია კუთხეში */}
        <div
          aria-hidden
          className={`float absolute right-4 top-4 z-10 overflow-hidden rounded-xl shadow-xl ring-2 ring-white/20 sm:hidden ${cover ? "w-[5.5rem]" : "w-[4.5rem]"}`}
          style={{ ["--r" as string]: "5deg" }}
        >
          {cover?.image ? (
            <BannerPhotos images={bannerImages} sizes="88px" />
          ) : (
            <CategoryArt slug={main} color={color} className="aspect-[4/3]" />
          )}
        </div>
        <div aria-hidden className="absolute inset-0 bg-gradient-to-r from-black/35 via-black/5 to-transparent" />

        <div className="relative z-10 flex min-h-[11rem] flex-col justify-center p-5 sm:min-h-[15rem] sm:max-w-[62%] sm:px-10 sm:py-8">
          <div className="flex flex-wrap gap-2 pr-24 text-xs font-medium sm:pr-0">
            <span className="rounded-full border border-white/30 bg-white/10 px-3 py-0.5 backdrop-blur-md">
              {artist.category}
            </span>
            {artist.city ? (
              <span className="rounded-full border border-white/30 bg-white/10 px-3 py-0.5 backdrop-blur-md">
                {artist.city}
              </span>
            ) : null}
          </div>
          <h1 className="mt-2 pr-24 text-balance text-[min(1.75rem,7vw)] font-semibold leading-[1.08] tracking-tight [overflow-wrap:anywhere] sm:pr-0 sm:text-3xl lg:text-4xl xl:text-5xl">
            {artist.name}
          </h1>
          <p className="mt-1 text-sm text-white/80">
            {all.artists.worksCount(artist.works.length)}
          </p>

          <p className="mt-4 text-sm font-medium text-white/85">{t.buyHint}</p>
          <div className="mt-2 flex flex-wrap gap-2">
            <SocialLink href={instagram} icon={<InstagramIcon />} label={t.instagram} variant="instagram" message={t.dmMessageArtist} />
            <SocialLink href={facebook} icon={<FacebookIcon />} label={t.facebook} variant="facebook" message={t.dmMessageArtist} />
          </div>
        </div>
      </section>

      {/* ნამუშევრები */}
      <section className="mt-10 sm:mt-14">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <h2 className="text-2xl font-semibold tracking-tight text-text sm:text-3xl">{t.works}</h2>
          {cats.length > 1 ? (
            <div className="flex flex-wrap items-center gap-2 text-sm">
              <span className="text-muted">{t.alsoIn}</span>
              {cats.map((c) => (
                <Link
                  key={c.slug}
                  href={`/categories/${c.slug}`}
                  className="inline-flex min-h-9 items-center rounded-full border border-border bg-surface px-3 font-medium text-text transition hover:border-accent hover:text-accent"
                >
                  {c.name}
                </Link>
              ))}
            </div>
          ) : null}
        </div>
        <div className="mt-5">
          <WorksGallery
            works={artist.works.map((work, i) => ({
              title: work.title,
              color: work.color,
              variant: (variantFor(artist.slug) + i) % 4,
              url: (work.url || artist.instagram || artist.facebook) ? `/go/${artist.slug}/w${i}` : undefined,
              network: /facebook\.com|fb\.com|fb\.me/i.test(work.url || artist.instagram || artist.facebook) ? "facebook" as const : "instagram" as const,
              image: work.image,
              width: work.width,
              height: work.height,
            }))}
          />
        </div>
      </section>

      {/* ავტორის შესახებ + ყიდვის ბლოკი */}
      <section className="mt-10 grid gap-4 sm:mt-14 lg:grid-cols-[3fr_2fr]">
        <div className="rounded-[1.75rem] border border-border bg-surface p-6 sm:p-8">
          <h2 className="text-sm font-semibold uppercase tracking-wider text-muted">{t.about}</h2>
          <p className="mt-3 text-lg leading-relaxed text-text sm:text-xl">{artist.bio}</p>
        </div>
        <div className="flex flex-col justify-center rounded-[1.75rem] bg-accent-soft p-6 sm:p-8">
          <h2 className="text-2xl font-semibold tracking-tight text-text">{t.ctaTitle}</h2>
          <p className="mt-2 leading-relaxed text-text/75">{t.ctaText}</p>
          <div className="mt-5 flex flex-wrap gap-2">
            <SocialLink href={instagram} icon={<InstagramIcon />} label={t.instagram} variant="instagram" message={t.dmMessageArtist} />
            <SocialLink href={facebook} icon={<FacebookIcon />} label={t.facebook} variant="facebook" message={t.dmMessageArtist} />
          </div>
        </div>
      </section>
    </div>
  );
}
