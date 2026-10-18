import { notFound } from "next/navigation";
import Link from "next/link";
import JsonLd from "@/components/JsonLd";
import ShareButton from "@/components/ShareButton";
import { SITE_URL } from "@/lib/site";
import type { ReactNode } from "react";
import CategoryArt from "@/components/CategoryArt";
import BannerPhotos from "@/components/BannerPhotos";
import BackLink from "@/components/BackLink";
import CopyLink from "@/components/CopyLink";
import ProfileView from "@/components/ProfileView";
import WorksGallery from "@/components/WorksGallery";
import { socialVariant } from "@/components/ui/socialStyles";
import { getArtistBySlug, isNewArtist, localizeArtist, pricing } from "@/data/artists";
import VerifiedMark from "@/components/VerifiedMark";
import { monthReach } from "@/lib/clicks";
import { categoryColor, getCategoryBySlug, localizeCategory } from "@/data/categories";
import { dictionary } from "@/lib/dictionary";
import { toGalleryWork } from "@/lib/galleryWork";
import { getLang } from "@/lib/i18n";

// ნამუშევრები დროით: ყველაზე ახლად დამატებული პირველი; თარიღის გარეშე (ძველი) ნამუშევრები ბოლოში, ფაილში რიგით
const addedAt = (work: { added?: string }) => (work.added ? Date.parse(work.added) || 0 : 0);

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
    "inline-flex min-h-11 flex-1 items-center justify-center gap-1.5 rounded-full border px-3.5 text-sm font-medium sm:flex-none sm:gap-2.5 sm:px-5";

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
  const title = `${artist.name} - ${artist.category}`;
  return {
    title,
    description: artist.bio,
    // სურათი: opengraph-image.tsx (ამ ხელოვანის ბარათი) თავისით ემატება
    openGraph: { title, description: artist.bio, type: "profile" },
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
  // ხელოვანის საერთო ფასდაკლება (ბანერის ნიშნისთვის): ის ჩანს, თუ ახლა მართლა მოქმედებს
  // ამ თვის გადასვლები (ნაჩვენებია, როცა რიცხვი უკვე ღირსშესანიშნავია)
  const MIN_PUBLIC_REACH = 5;
  const reach = await monthReach(artist.slug).catch(() => 0);
  const salePercent = artist.works.map((work) => pricing(artist, work)?.percent).find(Boolean);
  const instagram = artist.instagram ? `/go/${artist.slug}/instagram` : undefined;
  const facebook = artist.facebook ? `/go/${artist.slug}/facebook` : undefined;

  const artistLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Person",
        name: artist.name,
        description: artist.bio,
        url: `${SITE_URL}/artists/${artist.slug}`,
        jobTitle: artist.category,
        address: artist.city ? { "@type": "PostalAddress", addressLocality: artist.city, addressCountry: "GE" } : undefined,
        sameAs: [artist.instagram, artist.facebook].filter(Boolean),
        image: artist.cover ? `${SITE_URL}${artist.cover}` : undefined,
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: all.nav.home, item: SITE_URL },
          { "@type": "ListItem", position: 2, name: all.nav.artists, item: `${SITE_URL}/artists` },
          { "@type": "ListItem", position: 3, name: artist.name, item: `${SITE_URL}/artists/${artist.slug}` },
        ],
      },
    ],
  };

  return (
    <div className="mx-auto max-w-7xl px-4 pb-16 pt-1 sm:px-6 sm:pb-24 sm:pt-3 lg:px-10">
      <BackLink
        href="/artists"
        className="inline-flex min-h-9 items-center text-sm font-medium text-muted transition-colors hover:text-accent"
      />
      <JsonLd data={artistLd} />
      <ProfileView slug={artist.slug} />

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

        <div className="relative z-10 flex min-h-[11rem] flex-col justify-center p-5 sm:min-h-[13rem] sm:max-w-[62%] sm:px-10 sm:py-6">
          <div className="flex flex-wrap gap-2 pr-24 text-xs font-medium sm:pr-0">
            <span className="rounded-full border border-white/30 bg-white/10 px-3 py-0.5 backdrop-blur-md">
              {artist.category}
            </span>
            {artist.city ? (
              <span className="rounded-full border border-white/30 bg-white/10 px-3 py-0.5 backdrop-blur-md">
                {artist.city}
              </span>
            ) : null}
            {salePercent ? (
              <span className="rounded-full bg-[#c4302b] px-3 py-0.5 font-bold text-white shadow-sm">
                🔥 −{salePercent}%
              </span>
            ) : null}
            {artist.verified ? (
              <span title={t.verifiedHint} className="inline-flex items-center gap-1 rounded-full border border-white/30 bg-white/10 px-3 py-0.5 backdrop-blur-md">
                <VerifiedMark className="h-3.5 w-3.5" checkColor="#5b4636" />
                {t.verified}
              </span>
            ) : null}
            {isNewArtist(artist) ? (
              <span className="rounded-full bg-accent px-3 py-0.5 font-semibold text-on-accent shadow-sm">✦ {t.newArtistChip}</span>
            ) : null}
          </div>
          <h1 className="mt-2 pr-24 text-balance text-[min(1.75rem,7vw)] font-semibold leading-[1.08] tracking-tight [overflow-wrap:anywhere] sm:pr-0 sm:text-3xl lg:text-4xl xl:text-5xl">
            {artist.name}
          </h1>
          <p className="mt-1 text-sm text-white/80">
            {all.artists.worksCount(artist.works.length)}
          </p>
          {reach >= MIN_PUBLIC_REACH ? (
            <p className="mt-1 text-sm font-medium text-white/90">
              ↗ {t.monthReach(reach)}
              <span className="ml-1.5 text-xs font-normal text-white/60">· {t.monthReachNote}</span>
            </p>
          ) : null}

          <div className="mt-4 flex items-center justify-between gap-3">
            <p className="text-sm font-medium text-white/85">{t.buyHint}</p>
            {/* ტელეფონზე გაზიარება მხოლოდ ხატულაა და ტექსტის რიგშია, რომ ღილაკები ერთ რიგში ეტეოდეს */}
            <ShareButton url={`/artists/${artist.slug}`} title={artist.name} variant="icon" className="shrink-0 sm:hidden" />
          </div>
          <div className="mt-2 flex items-center gap-2">
            <SocialLink href={instagram} icon={<InstagramIcon />} label={t.instagram} variant="instagram" message={t.dmMessageArtist} />
            <SocialLink href={facebook} icon={<FacebookIcon />} label={t.facebook} variant="facebook" message={t.dmMessageArtist} />
            <ShareButton url={`/artists/${artist.slug}`} title={artist.name} className="hidden sm:inline-flex" />
          </div>
        </div>
      </section>

      {/* ნამუშევრები */}
      <section className="mt-8 sm:mt-10">
        <div className="flex flex-wrap items-end justify-between gap-x-4 gap-y-2">
          <h2 className="text-2xl font-semibold tracking-tight text-text sm:text-3xl">{t.works}</h2>
          {cats.length > 1 ? (
            <div className="flex items-center gap-2 text-sm max-sm:order-last max-sm:-mx-4 max-sm:w-[calc(100%+2rem)] max-sm:overflow-x-auto max-sm:px-4 max-sm:pb-1 max-sm:[scrollbar-width:none] max-sm:[&::-webkit-scrollbar]:hidden">
              <span className="hidden text-muted sm:inline">{t.alsoIn}</span>
              {cats.map((c) => (
                <Link
                  key={c.slug}
                  href={`/categories/${c.slug}`}
                  className="inline-flex min-h-9 shrink-0 items-center whitespace-nowrap rounded-full border border-border bg-surface px-3.5 text-[13px] font-medium text-text transition hover:border-accent hover:text-accent sm:text-sm"
                >
                  {c.name}
                </Link>
              ))}
            </div>
          ) : null}
        </div>
        <p className="mt-2 text-xs leading-relaxed text-muted sm:mt-1 sm:text-sm">{all.priceNote}</p>
        <div className="mt-6 sm:mt-8">
          <WorksGallery
            shareUrl={`/artists/${artist.slug}`}
            shareTitle={artist.name}
            works={artist.works
              .map((work, i) => ({ work, i }))
              .sort((a, b) => addedAt(b.work) - addedAt(a.work))
              .map(({ work, i }) => toGalleryWork(artist, work, i))}
          />
        </div>
      </section>

      {/* ავტორის შესახებ + ყიდვის ბლოკი */}
      <section className="mt-10 grid gap-4 sm:mt-14 lg:grid-cols-[3fr_2fr]">
        <div className="rounded-[1.75rem] border border-border bg-surface p-6 sm:p-8">
          <h2 className="text-sm font-semibold uppercase tracking-wider text-muted">{t.about}</h2>
          <p className="mt-3 text-lg leading-relaxed text-text sm:text-xl">{artist.bio}</p>
          {artist.verified ? (
            <p className="mt-4 flex items-start gap-2 text-sm text-muted">
              <VerifiedMark className="mt-0.5 h-4 w-4 shrink-0 text-accent" />
              <span>
                <b className="font-semibold text-text">{t.verified}.</b> {t.verifiedHint}
              </span>
            </p>
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
      </section>
    </div>
  );
}
