import Link from "next/link";
import ArtTile from "@/components/ArtTile";
import CategoryArt from "@/components/CategoryArt";
import CategoryCarousel from "@/components/CategoryCarousel";
import HeroBanner, { type BannerSlide } from "@/components/HeroBanner";
import ArtistCard from "@/components/ArtistCard";
import Reveal from "@/components/Reveal";
import { getLocalizedArtists } from "@/data/artists";
import { categories, localizeCategory } from "@/data/categories";
import { dictionary } from "@/lib/dictionary";
import { getLang } from "@/lib/i18n";

const tileColors = [
  "#c4553a",
  "#3d5a73",
  "#5e7a55",
  "#7a4e6a",
  "#b07a4a",
  "#4a6d8c",
];

export default function Home() {
  const lang = getLang();
  const t = dictionary[lang].home;
  const artists = getLocalizedArtists(lang);
  const featured = artists.slice(0, 3);
  const cats = categories.map((c) => localizeCategory(c, lang));

  const glassButton =
    "hidden min-h-12 items-center rounded-full border border-white/35 bg-white/10 px-7 text-sm font-medium text-white backdrop-blur-md transition duration-300 hover:-translate-y-0.5 hover:bg-white hover:text-black active:scale-95 sm:inline-flex";
  const whiteButton =
    "group inline-flex min-h-12 items-center gap-2 rounded-full bg-white px-7 text-sm font-medium text-black transition duration-300 hover:-translate-y-0.5 hover:shadow-xl active:scale-95";
  const arrow = (
    <span className="arrow-slide" aria-hidden>
      →
    </span>
  );

  const bannerSlides: BannerSlide[] = [
    {
      id: "main",
      color: "#c4553a",
      art: (
        <div className="relative hidden h-full w-full lg:block" aria-hidden>
          <div
            className="float absolute left-[22%] top-[8%] w-[34%] rounded-[1.5rem] shadow-2xl"
            style={{ ["--r" as string]: "-6deg" }}
          >
            <ArtTile color={artists[0].works[0].color} variant={0} className="aspect-[3/4] rounded-[1.5rem]" />
          </div>
          <div
            className="float absolute right-[7%] top-[5%] w-[28%] rounded-[1.5rem] shadow-2xl [animation-delay:-2.5s]"
            style={{ ["--r" as string]: "5deg" }}
          >
            <ArtTile color={artists[1].works[0].color} variant={2} className="aspect-[4/5] rounded-[1.5rem]" />
          </div>
          <div
            className="float absolute right-[30%] top-[46%] w-[22%] rounded-full shadow-2xl [animation-delay:-4.5s]"
            style={{ ["--r" as string]: "-3deg" }}
          >
            <ArtTile color={artists[2].works[0].color} variant={3} className="aspect-square rounded-full" />
          </div>
        </div>
      ),
      content: (
        <div className="hero-in">
          <p className="inline-flex items-center gap-2.5 rounded-full border border-white/30 bg-white/10 px-4 py-1.5 text-sm font-medium backdrop-blur-md">
            <span className="pulse-dot h-2 w-2 rounded-full bg-white" />
            {t.badge}
          </p>
          <h1 className="mt-4 text-balance text-3xl font-semibold leading-[1.08] tracking-tight sm:text-5xl">
            {t.title}
          </h1>
          <p className="mt-3 max-w-md text-base leading-relaxed text-white/85 sm:text-lg">
            {t.text}
          </p>
          <div className="mt-5 flex flex-wrap gap-3">
            <Link href="/categories" className={whiteButton}>
              {t.ctaPrimary}
              {arrow}
            </Link>
            <Link href="/artists" className={glassButton}>
              {t.ctaSecondary}
            </Link>
          </div>
        </div>
      ),
    },
    ...t.banners.map((banner, i): BannerSlide => ({
      id: banner.slug,
      color: ["#5e7a55", "#3d5a73", "#b07a4a"][i],
      art: (
        <CategoryArt
          slug={banner.slug}
          color={["#5e7a55", "#3d5a73", "#b07a4a"][i]}
          className="absolute inset-0 h-full w-full"
        />
      ),
      content: (
        <div>
          <h2 className="text-balance text-3xl font-semibold leading-[1.08] tracking-tight sm:text-5xl">
            {banner.title}
          </h2>
          <p className="mt-3 max-w-md text-base leading-relaxed text-white/85 sm:text-lg">
            {banner.text}
          </p>
          <div className="mt-5">
            <Link href={`/categories/${banner.slug}`} className={whiteButton}>
              {t.browse}
              {arrow}
            </Link>
          </div>
        </div>
      ),
    })),
    {
      id: "join",
      color: "#a5320e",
      art: (
        <ArtTile color="#c93f15" variant={3} className="absolute inset-0 h-full w-full" />
      ),
      content: (
        <div>
          <h2 className="text-balance text-3xl font-semibold leading-[1.08] tracking-tight sm:text-5xl">
            {t.bannerTitle}
          </h2>
          <p className="mt-3 max-w-md text-base leading-relaxed text-white/85 sm:text-lg">
            {t.bannerText}
          </p>
          <div className="mt-5">
            <Link href="/join" className={`${whiteButton} glow-btn`}>
              {dictionary[lang].nav.join}
              {arrow}
            </Link>
          </div>
        </div>
      ),
    },
  ];

  return (
    <div>
      {/* ჰერო: მბრუნავი ბანერები */}
      <section className="relative isolate overflow-hidden">
        <div
          aria-hidden
          className="blob pointer-events-none absolute -left-32 -top-24 -z-10 h-[28rem] w-[28rem] rounded-full bg-accent-soft blur-3xl"
        />
        <div className="mx-auto max-w-7xl px-4 pb-10 pt-5 sm:px-6 sm:pb-14 sm:pt-8 lg:px-10">
          <HeroBanner slides={bannerSlides} />
        </div>
      </section>

      {/* კატეგორიები */}
      <section className="mx-auto max-w-7xl px-4 pt-16 sm:px-6 sm:pt-24">
        <Reveal className="mb-6 sm:mb-10 flex items-end justify-between gap-4">
          <h2 className="max-w-xl text-balance text-2xl font-semibold leading-tight tracking-tight text-text sm:text-5xl">
            {t.categoriesTitle}
          </h2>
          <Link
            href="/categories"
            className="group hidden shrink-0 items-center gap-1 text-sm font-medium text-accent hover:underline sm:inline-flex"
          >
            {t.allCategories}
            <span className="arrow-slide" aria-hidden>
              →
            </span>
          </Link>
        </Reveal>

        <Reveal>
          <CategoryCarousel
            autoplay={false}
            slides={cats.map((c, i) => ({
              slug: c.slug,
              name: c.name,
              description: c.description,
              color: tileColors[i % tileColors.length],
            }))}
          />
        </Reveal>
      </section>

      {/* რჩეული ხელოვანები */}
      <section className="mx-auto max-w-7xl px-4 pt-16 sm:px-6 sm:pt-28">
        <Reveal className="mb-6 sm:mb-10 flex items-end justify-between gap-4">
          <h2 className="max-w-xl text-balance text-2xl font-semibold leading-tight tracking-tight text-text sm:text-5xl">
            {t.featured}
          </h2>
          <Link
            href="/artists"
            className="group inline-flex shrink-0 items-center gap-1 text-sm font-medium text-accent hover:underline"
          >
            {t.fullList}
            <span className="arrow-slide" aria-hidden>
              →
            </span>
          </Link>
        </Reveal>
        <Reveal
          as="ul"
          stagger
          className="-mx-4 flex snap-x snap-mandatory gap-4 overflow-x-auto px-4 pb-4 [scrollbar-width:none] sm:mx-0 sm:grid sm:grid-cols-2 sm:gap-5 sm:overflow-visible sm:px-0 sm:pb-0 lg:grid-cols-3 [&::-webkit-scrollbar]:hidden"
        >
          {featured.map((artist) => (
            <li key={artist.slug} className="w-[78%] shrink-0 snap-center sm:w-auto">
              <ArtistCard artist={artist} />
            </li>
          ))}
        </Reveal>
      </section>

      {/* როგორ მუშაობს */}
      <section className="mx-auto max-w-7xl px-4 pt-16 sm:px-6 sm:pt-28">
        <Reveal className="mb-6 sm:mb-10 max-w-xl">
          <h2 className="text-balance text-2xl font-semibold leading-tight tracking-tight text-text sm:text-5xl">
            {t.how}
          </h2>
        </Reveal>
        <Reveal
          as="ol"
          stagger
          className="grid grid-cols-1 gap-5 md:grid-cols-3"
        >
          {t.steps.map((step, i) => (
            <li
              key={step.title}
              className="group relative overflow-hidden rounded-[1.75rem] border border-border bg-surface p-5 transition sm:p-7 duration-300 hover:-translate-y-1 hover:border-accent hover:shadow-xl"
            >
              <span
                aria-hidden
                className="font-serif text-5xl font-semibold sm:text-7xl leading-none text-accent opacity-25 transition-opacity duration-300 group-hover:opacity-100"
              >
                {String(i + 1).padStart(2, "0")}
              </span>
              <h3 className="mt-3 text-xl font-semibold tracking-tight text-text sm:mt-6">
                {step.title}
              </h3>
              <p className="mt-2 leading-relaxed text-muted">{step.text}</p>
            </li>
          ))}
        </Reveal>
      </section>

      {/* შემოქმედის ბანერი */}
      <section className="mx-auto max-w-7xl px-4 pt-16 sm:px-6 sm:pt-28">
        <Reveal>
          <div className="relative isolate overflow-hidden rounded-[2rem] bg-accent px-6 py-10 text-on-accent sm:rounded-[2.25rem] sm:px-14 sm:py-20">
            <div
              aria-hidden
              className="blob absolute -right-16 -top-20 -z-10 h-72 w-72 rounded-full bg-white/15 blur-2xl"
            />
            <div
              aria-hidden
              className="absolute -bottom-24 right-24 -z-10 h-64 w-64 rounded-full border-[28px] border-white/10"
            />
            <h2 className="max-w-lg text-balance text-3xl font-semibold leading-tight tracking-tight sm:text-6xl">
              {t.bannerTitle}
            </h2>
            <p className="mt-5 max-w-md text-lg leading-relaxed opacity-85">
              {t.bannerText}
            </p>
            <Link
              href="/join"
              className="group mt-9 inline-flex min-h-12 items-center gap-2 rounded-full bg-on-accent px-7 text-sm font-medium text-accent transition duration-300 hover:-translate-y-0.5 hover:shadow-xl active:scale-95"
            >
              {dictionary[lang].nav.join}
              <span className="arrow-slide" aria-hidden>
                →
              </span>
            </Link>
          </div>
        </Reveal>
      </section>
    </div>
  );
}
