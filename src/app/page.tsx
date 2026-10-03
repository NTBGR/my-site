import Link from "next/link";
import ArtTile from "@/components/ArtTile";
import CategoryArt from "@/components/CategoryArt";
import CategoryCarousel from "@/components/CategoryCarousel";
import HeroBanner, { type BannerSlide } from "@/components/HeroBanner";
import ArtistCard from "@/components/ArtistCard";
import Reveal from "@/components/Reveal";
import { getLocalizedArtists } from "@/data/artists";
import { categories, categoryColor, localizeCategory } from "@/data/categories";
import { dictionary } from "@/lib/dictionary";
import { getLang } from "@/lib/i18n";


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
          <p className="mt-3 hidden max-w-md text-base leading-relaxed text-white/85 sm:block sm:text-lg lg:hidden xl:block">
            {t.text}
          </p>
          <div className="mt-5 flex flex-wrap gap-3">
            <Link href="/categories" className={`${whiteButton} whitespace-nowrap`}>
              {t.ctaPrimary}
              {arrow}
            </Link>
            <Link
              href="/join"
              className="hidden min-h-12 items-center whitespace-nowrap rounded-full border border-white/60 sm:inline-flex px-7 text-sm font-medium text-white transition duration-300 hover:-translate-y-0.5 hover:bg-white/15 active:scale-95"
            >
              {t.ctaMaker}
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
          <p className="mt-3 hidden max-w-md text-base leading-relaxed text-white/85 sm:block sm:text-lg">
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
                className="group relative block min-h-36 overflow-hidden rounded-[1.25rem] rounded-bl-[2.5rem] rounded-tr-[2.5rem] text-white shadow-lg transition duration-300 hover:-translate-y-1 hover:shadow-2xl active:scale-[0.99] lg:rounded-[1.5rem] lg:rounded-bl-[3.5rem] lg:rounded-tr-[3.5rem]"
              >
                <CategoryArt slug="sachuqrebi" color="#7a4e6a" className="absolute inset-0 h-full w-full" />
                <div aria-hidden className="absolute inset-0 z-10 bg-gradient-to-t from-black/50 via-black/5 to-transparent" />
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
                href="/artists"
                className="group relative block min-h-36 overflow-hidden rounded-[1.25rem] rounded-bl-[2.5rem] rounded-tr-[2.5rem] text-white shadow-lg transition duration-300 hover:-translate-y-1 hover:shadow-2xl active:scale-[0.99] lg:rounded-[1.5rem] lg:rounded-bl-[3.5rem] lg:rounded-tr-[3.5rem]"
              >
                <ArtTile color="#d4623a" variant={3} className="absolute inset-0 h-full w-full" />
                <div aria-hidden className="absolute inset-0 z-10 bg-gradient-to-t from-black/55 via-black/5 to-transparent" />
                <div className="absolute inset-x-0 bottom-0 z-20 p-5 sm:p-6">
                  <h2 className="text-xl font-semibold tracking-tight sm:text-2xl">
                    {t.ctaSecondary}
                  </h2>
                  <span className="mt-3 inline-flex min-h-10 items-center gap-2 rounded-full bg-white px-5 text-sm font-medium text-black transition duration-300 group-hover:bg-accent group-hover:text-on-accent">
                    {dictionary[lang].nav.artists}
                    {arrow}
                  </span>
                </div>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* კატეგორიები */}
      <section className="mx-auto max-w-7xl px-4 pt-14 sm:px-6 lg:px-10 sm:pt-20">
        <Reveal className="mb-5 sm:mb-8 flex items-end justify-between gap-4">
          <h2 className="text-balance text-2xl font-semibold leading-tight tracking-tight text-text sm:text-3xl lg:text-4xl">
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
            slides={cats.map((c) => ({
              slug: c.slug,
              name: c.name,
              description: c.description,
              color: categoryColor(c.slug),
            }))}
          />
        </Reveal>
      </section>

      {/* რჩეული ხელოვანები */}
      <section className="mx-auto max-w-7xl px-4 pt-14 sm:px-6 lg:px-10 sm:pt-20">
        <Reveal className="mb-5 sm:mb-8 flex items-end justify-between gap-4">
          <h2 className="text-balance text-2xl font-semibold leading-tight tracking-tight text-text sm:text-3xl lg:text-4xl">
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
              <ArtistCard
                artist={artist}
                artClassName="aspect-[4/3]"
                worksLabel={`${artist.city} · ${dictionary[lang].artists.worksCount(artist.works.length)}`}
              />
            </li>
          ))}
        </Reveal>
      </section>

      {/* როგორ მუშაობს */}
      <section
        id="how-it-works"
        className="mx-auto max-w-7xl scroll-mt-24 px-4 pt-14 sm:px-6 lg:px-10 sm:pt-20"
      >
        <Reveal className="mb-5 sm:mb-8">
          <h2 className="text-balance text-2xl font-semibold leading-tight tracking-tight text-text sm:text-3xl lg:text-4xl">
            {t.how}
          </h2>
        </Reveal>
        <Reveal
          as="ol"
          stagger
          className="grid grid-cols-1 gap-3 sm:gap-4 md:grid-cols-3"
        >
          {t.steps.map((step, i) => (
            <li
              key={step.title}
              className="flex items-start gap-4 rounded-[1.25rem] border border-border bg-surface p-4 sm:p-5"
            >
              <span
                aria-hidden
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-accent-soft font-serif text-base font-semibold text-accent"
              >
                {i + 1}
              </span>
              <div>
                <h3 className="text-base font-semibold tracking-tight text-text sm:text-lg">
                  {step.title}
                </h3>
                <p className="mt-1 text-sm leading-relaxed text-muted">{step.text}</p>
              </div>
            </li>
          ))}
        </Reveal>
      </section>

      {/* შემოქმედის ბანერი */}
      <section className="mx-auto max-w-7xl px-4 pb-14 pt-14 sm:px-6 lg:px-10 sm:pb-20 sm:pt-20">
        <Reveal>
          <div className="relative isolate flex flex-col gap-6 overflow-hidden rounded-[1.75rem] bg-gradient-to-br from-accent to-[color-mix(in_srgb,var(--accent),#f2a37a_28%)] px-6 py-8 text-on-accent sm:flex-row sm:items-center sm:justify-between sm:px-10 sm:py-10">
            <div
              aria-hidden
              className="blob absolute -right-16 -top-20 -z-10 h-56 w-56 rounded-full bg-white/15 blur-2xl"
            />
            <div
              aria-hidden
              className="absolute -bottom-20 right-1/3 -z-10 h-44 w-44 rounded-full border-[20px] border-white/10"
            />
            <div>
              <h2 className="text-balance text-2xl font-semibold leading-tight tracking-tight sm:text-3xl">
                {t.bannerTitle}
              </h2>
              <p className="mt-2 max-w-md leading-relaxed opacity-85">
                {t.bannerText}
              </p>
            </div>
            <Link
              href="/join"
              className="group inline-flex min-h-12 shrink-0 self-start sm:self-auto items-center gap-2 rounded-full bg-on-accent px-7 text-sm font-medium text-accent transition duration-300 hover:-translate-y-0.5 hover:shadow-xl active:scale-95"
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
