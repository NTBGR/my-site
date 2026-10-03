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
          <h1 className="text-balance text-3xl font-semibold leading-[1.08] tracking-tight sm:text-5xl lg:text-4xl xl:text-5xl">
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
          <h2 className="text-balance text-3xl font-semibold leading-[1.08] tracking-tight sm:text-5xl lg:text-4xl xl:text-5xl">
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
  ];

  return (
    <div>
      {/* ჰერო: მბრუნავი ბანერები */}
      <section className="relative isolate overflow-x-clip">
        <div
          aria-hidden
          className="blob pointer-events-none absolute -left-32 top-0 -z-10 h-[28rem] w-[28rem] rounded-full bg-accent-soft blur-3xl"
        />
        <div className="mx-auto max-w-7xl px-4 pb-0 pt-5 sm:px-6 sm:pt-8 lg:px-10">
          <div className="grid gap-4 lg:grid-cols-[2fr_1fr]">
            <HeroBanner slides={bannerSlides} />
            <div className="hidden gap-4 sm:grid sm:grid-cols-2 lg:grid-cols-1 lg:grid-rows-2">
              <Link
                href="/categories"
                className="group relative block min-h-36 overflow-hidden rounded-[2rem] text-white shadow-lg transition duration-300 hover:-translate-y-1 hover:shadow-2xl active:scale-[0.99] lg:rounded-[2.5rem]"
              >
                <CategoryArt slug="sachuqrebi" color="#7a4e6a" className="absolute inset-0 h-full w-full" />
                <div aria-hidden className="absolute inset-0 z-10 bg-gradient-to-t from-black/65 via-black/10 to-transparent" />
                <div className="absolute inset-x-0 bottom-0 z-20 flex items-end justify-between gap-3 p-5 sm:p-6">
                  <h2 className="text-xl font-semibold tracking-tight sm:text-2xl">
                    {dictionary[lang].nav.categories}
                  </h2>
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white/20 backdrop-blur-md transition duration-300 group-hover:bg-white group-hover:text-black" aria-hidden>
                    <span className="arrow-slide">→</span>
                  </span>
                </div>
              </Link>
              <Link
                href="/join"
                className="group relative block min-h-36 overflow-hidden rounded-[2rem] text-white shadow-lg transition duration-300 hover:-translate-y-1 hover:shadow-2xl active:scale-[0.99] lg:rounded-[2.5rem]"
              >
                <ArtTile color="#c93f15" variant={3} className="absolute inset-0 h-full w-full" />
                <div aria-hidden className="absolute inset-0 z-10 bg-gradient-to-t from-black/55 via-black/5 to-transparent" />
                <div className="absolute inset-x-0 bottom-0 z-20 p-5 sm:p-6">
                  <h2 className="text-xl font-semibold tracking-tight sm:text-2xl">
                    {t.bannerTitle}
                  </h2>
                  <span className="mt-3 inline-flex min-h-10 items-center gap-2 rounded-full bg-white px-5 text-sm font-medium text-black transition duration-300 group-hover:bg-accent group-hover:text-on-accent">
                    {dictionary[lang].nav.join}
                    {arrow}
                  </span>
                </div>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* კატეგორიები */}
      <section className="mx-auto max-w-7xl px-4 pt-16 sm:px-6 lg:px-10 sm:pt-24">
        <Reveal className="mb-6 sm:mb-10 flex items-end justify-between gap-4">
          <h2 className="max-w-xl text-balance text-2xl font-semibold leading-tight tracking-tight text-text sm:text-5xl">
            {t.categoriesTitle}
          </h2>
          <Link
            href="/categories"
            className="group hidden min-h-10 shrink-0 items-center gap-2 rounded-full border border-border bg-surface px-5 text-sm font-medium text-text transition duration-300 hover:border-accent hover:text-accent sm:inline-flex"
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
      <section className="mx-auto max-w-7xl px-4 pt-16 sm:px-6 lg:px-10 sm:pt-24">
        <Reveal className="mb-6 sm:mb-10 flex items-end justify-between gap-4">
          <h2 className="max-w-xl text-balance text-2xl font-semibold leading-tight tracking-tight text-text sm:text-5xl">
            {t.featured}
          </h2>
          <Link
            href="/artists"
            className="group inline-flex min-h-10 shrink-0 items-center gap-2 rounded-full border border-border bg-surface px-5 text-sm font-medium text-text transition duration-300 hover:border-accent hover:text-accent"
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
      <section className="mx-auto max-w-7xl px-4 pt-16 sm:px-6 lg:px-10 sm:pt-24">
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
      <section className="mx-auto max-w-7xl px-4 pb-16 pt-16 sm:px-6 lg:px-10 sm:pb-24 sm:pt-24">
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
