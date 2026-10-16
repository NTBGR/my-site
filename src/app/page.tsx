import Link from "next/link";
import JsonLd from "@/components/JsonLd";
import { SITE_URL } from "@/lib/site";
import ArtistOfWeek from "@/components/ArtistOfWeek";
import CategoryArt from "@/components/CategoryArt";
import TrendingWorks from "@/components/TrendingWorks";
import CategoryCarousel from "@/components/CategoryCarousel";
import HeroBanner, { type BannerSlide } from "@/components/HeroBanner";
import ArtistCard from "@/components/ArtistCard";
import ArtistsCarousel from "@/components/ArtistsCarousel";
import Reveal from "@/components/Reveal";
import { getLocalizedArtists } from "@/data/artists";
import { categories, categoryColor, localizeCategory } from "@/data/categories";
import { hasCategoryPhoto } from "@/data/categoryPhotos";
import { dictionary } from "@/lib/dictionary";
import { getLang } from "@/lib/i18n";


export default async function Home() {
  const lang = await getLang();
  const t = dictionary[lang].home;
  const artists = getLocalizedArtists(lang);
  // ტელეფონზე ფურცვლით ჩანს ექვსამდე ხელოვანი და ბოლოს „ყველა ხელოვანი“ ბარათი; დესკტოპზე ხუთამდე (ერთი რიგი)
  const featured = artists.slice(0, 6);
  // ხელოვანების სხვადასხვა ხელობა „გაიცანი ხელოვანები“ ქარდისთვის
  const crafts = Array.from(new Set(artists.map((a) => a.categories[0]).filter(Boolean))).slice(0, 3);
  const cats = categories.map((c) => localizeCategory(c, lang));

  const whiteButton =
    "group inline-flex min-h-12 items-center gap-2 rounded-full bg-white px-7 text-sm font-medium text-black transition duration-300 hover:-translate-y-0.5 hover:shadow-xl active:scale-95";
  const arrow = (
    <span className="arrow-slide" aria-hidden>
      →
    </span>
  );

  // სლაიდის ფონის ფერი კატეგორიის პალიტრიდანაა (იგივე თბილი მიწისფერი ოჯახი, რაც ფოტოებს)
  const slideColor = (slug: string) => categoryColor(slug);


  // მცურავი, დახრილი ფოტოების კოლაჟი ბანერის მარჯვენა მხარეს (ტელეფონზე სამი პატარა კუთხეში): ყველა სლაიდზე ერთნაირია
  const collage = (slugs: [string, string, string]) => (
    <>
      <div className="absolute inset-x-5 top-4 h-24 sm:inset-x-auto sm:right-8 sm:top-6 sm:h-28 sm:w-48 lg:hidden" aria-hidden>
        {[
          { pos: "left-[2%] top-2 w-[29%] sm:left-0 sm:top-2 sm:w-[34%]", r: "-5deg", delay: "" },
          { pos: "left-[35.5%] top-2 w-[29%] sm:left-[33%] sm:top-0 sm:w-[34%]", r: "3deg", delay: "[animation-delay:-2.5s]" },
          { pos: "right-[2%] top-2 w-[29%] sm:right-0 sm:top-5 sm:w-[32%]", r: "-3deg", delay: "[animation-delay:-4.5s]" },
        ].map((tile, i) => (
          <div
            key={slugs[i]}
            className={`float absolute ${tile.pos} overflow-hidden rounded-2xl shadow-xl ring-2 ring-white/20 ${tile.delay}`}
            style={{ ["--r" as string]: tile.r }}
          >
            <CategoryArt slug={slugs[i]} color={categoryColor(slugs[i])} className="aspect-square sm:aspect-[3/4]" />
          </div>
        ))}
      </div>
      <div className="relative hidden h-full w-full lg:block" aria-hidden>
        <div
          className="float absolute left-[24%] top-[10%] w-[32%] overflow-hidden rounded-[1.5rem] shadow-2xl ring-4 ring-white/15"
          style={{ ["--r" as string]: "-6deg" }}
        >
          <CategoryArt slug={slugs[0]} color={categoryColor(slugs[0])} className="aspect-[3/4]" />
        </div>
        <div
          className="float absolute right-[6%] top-[6%] w-[30%] overflow-hidden rounded-[1.5rem] shadow-2xl ring-4 ring-white/15 [animation-delay:-2.5s]"
          style={{ ["--r" as string]: "5deg" }}
        >
          <CategoryArt slug={slugs[1]} color={categoryColor(slugs[1])} className="aspect-[4/5]" />
        </div>
        <div
          className="float absolute right-[24%] top-[50%] w-[28%] overflow-hidden rounded-[1.5rem] shadow-2xl ring-4 ring-white/15 [animation-delay:-4.5s]"
          style={{ ["--r" as string]: "-3deg" }}
        >
          <CategoryArt slug={slugs[2]} color={categoryColor(slugs[2])} className="aspect-[4/3]" />
        </div>
      </div>
    </>
  );

  // თითო სლაიდზე ერთი და იგივე თემის სამი ფოტო
  const related: Record<string, [string, string, string]> = {
    keramika: ["keramika", "keramika-2", "keramika-3"],
    nakhatebi: ["nakhatebi", "nakhatebi-2", "nakhatebi-3"],
    samkauli: ["samkauli", "bechdebi", "samkauli-3"],
    posterebi: ["posterebi", "posterebi-2", "posterebi-3"],
  };

  const bannerSlides: BannerSlide[] = [
    {
      id: "main",
      color: "#8f5a43",
      art: collage(["bechdebi", "keramika", "samkauli"]),
      content: (
        <div className="hero-in">
          <h1 className="text-balance text-2xl font-semibold leading-[1.1] tracking-tight sm:text-5xl lg:text-4xl xl:text-5xl">
            {t.title}
          </h1>
          <p className="mt-2 max-w-md text-sm leading-relaxed text-white/85 sm:mt-3 sm:text-lg">
            {t.text}
          </p>
          <div className="mt-5 flex flex-wrap items-center gap-x-5 gap-y-3">
            <Link href="/categories" className={`${whiteButton} whitespace-nowrap`}>
              {t.ctaPrimary}
              {arrow}
            </Link>
            <Link
              href="/join"
              className="hidden whitespace-nowrap text-sm font-medium text-white/90 underline decoration-white/40 underline-offset-4 transition hover:text-white hover:decoration-white sm:inline"
            >
              {t.ctaMaker}
            </Link>
          </div>
        </div>
      ),
    },
    // სლაიდი მხოლოდ იმ კატეგორიას აქვს, რომელსაც ნამდვილი ფოტო ჰყავს
    ...t.banners.filter((banner) => hasCategoryPhoto(banner.slug)).map((banner): BannerSlide => ({
      id: banner.slug,
      color: slideColor(banner.slug),
      art: collage(related[banner.slug] ?? ["keramika", "samkauli", "nakhatebi"]),
      content: (
        <div>
          <h2 className="text-balance text-2xl font-semibold leading-[1.1] tracking-tight sm:max-w-[60%] sm:text-5xl lg:max-w-none lg:text-3xl xl:text-4xl">
            {banner.title}
          </h2>
          <p className="mt-2 line-clamp-2 max-w-md text-sm leading-snug text-white/85 sm:mt-3 sm:max-w-[55%] sm:text-lg lg:max-w-[15rem]">
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

  const siteLd = {
    "@context": "https://schema.org",
    "@graph": [
      { "@type": "Organization", name: "ხელოვანი", url: SITE_URL, logo: `${SITE_URL}/icon.svg` },
      {
        "@type": "WebSite",
        name: "ხელოვანი",
        url: SITE_URL,
        inLanguage: lang,
        potentialAction: { "@type": "SearchAction", target: `${SITE_URL}/artists?q={search_term_string}`, "query-input": "required name=search_term_string" },
      },
    ],
  };

  return (
    <div>
      <JsonLd data={siteLd} />
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
                className="group relative block min-h-36 overflow-hidden sm:min-h-44 rounded-[1.25rem] rounded-bl-[2.5rem] rounded-tr-[2.5rem] text-white shadow-lg transition duration-300 hover:-translate-y-1 hover:shadow-2xl active:scale-[0.99] lg:rounded-[1.5rem] lg:rounded-bl-[3.5rem] lg:rounded-tr-[3.5rem]"
              >
                <div
                  aria-hidden
                  className="grain absolute inset-0"
                  style={{ background: "linear-gradient(150deg, #8c7560, #735f4c 52%, #4a3c2f)" }}
                />
                <div aria-hidden className="absolute inset-x-5 top-5 z-10 grid grid-cols-4 gap-2 sm:inset-x-6 sm:top-6">
                  {["nakhatebi", "posterebi", "keramika", "tyavi"].map((slug, i) => (
                    <div
                      key={slug}
                      className="float-soft overflow-hidden rounded-xl shadow-lg ring-2 ring-white/15"
                      style={{ ["--r" as string]: `${[-4, 3, -2, 4][i]}deg`, animationDelay: `-${i * 1.8}s` }}
                    >
                      <CategoryArt slug={slug} color={categoryColor(slug)} className="aspect-square" />
                    </div>
                  ))}
                </div>
                <div aria-hidden className="absolute inset-0 z-10 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
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
                className="group relative block min-h-36 overflow-hidden sm:min-h-44 rounded-[1.25rem] rounded-bl-[2.5rem] rounded-tr-[2.5rem] text-white shadow-lg transition duration-300 hover:-translate-y-1 hover:shadow-2xl active:scale-[0.99] lg:rounded-[1.5rem] lg:rounded-bl-[3.5rem] lg:rounded-tr-[3.5rem]"
              >
                <div
                  aria-hidden
                  className="grain absolute inset-0"
                  style={{ background: "linear-gradient(150deg, #b97b58, #9d6044 52%, #5e3a2a)" }}
                />
                <div aria-hidden className="absolute left-5 top-5 z-10 flex sm:left-6 sm:top-6">
                  {crafts.map((slug, i) => (
                    <span
                      key={slug}
                      className="float-soft -ml-3 block h-14 w-14 overflow-hidden rounded-full shadow-lg ring-[3px] ring-[#9d6044] first:ml-0"
                      style={{ ["--r" as string]: "0deg", animationDelay: `-${i * 2.2}s` }}
                    >
                      <CategoryArt slug={slug} color={categoryColor(slug)} className="h-full w-full" />
                    </span>
                  ))}
                </div>
                <div aria-hidden className="absolute inset-0 z-10 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
                <div className="absolute inset-x-0 bottom-0 z-20 flex items-end justify-between gap-3 p-5 sm:p-6">
                  <h2 className="text-xl font-semibold tracking-tight sm:text-2xl">
                    {t.ctaSecondary}
                  </h2>
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white/20 backdrop-blur-md transition duration-300 group-hover:bg-white group-hover:text-black" aria-hidden>
                    <span className="arrow-slide">→</span>
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

      <ArtistOfWeek />

      {/* რჩეული ხელოვანები */}
      <section className="mx-auto max-w-7xl px-4 pt-14 sm:px-6 lg:px-10 sm:pt-20">
        <Reveal className="mb-5 sm:mb-8 flex items-end justify-between gap-4">
          <h2 className="text-balance text-2xl font-semibold leading-tight tracking-tight text-text sm:text-3xl lg:text-4xl">
            {t.featured}
          </h2>
          <Link
            href="/artists"
            className="group hidden min-h-10 shrink-0 items-center gap-2 rounded-full border border-border bg-surface px-5 text-sm font-medium text-text transition duration-300 hover:border-accent hover:text-accent sm:inline-flex"
          >
            {t.fullList}
            <span className="arrow-slide" aria-hidden>
              →
            </span>
          </Link>
        </Reveal>
        <Reveal>
          <ArtistsCarousel>
            {featured.map((artist) => (
              <ArtistCard
                key={artist.slug}
                artist={artist}
                artClassName="aspect-[4/5] sm:aspect-square"
                worksLabel={dictionary[lang].artists.worksCount(artist.works.length)}
              />
            ))}
            {/* ბოლო ბარათი: პარტნიორობის მოწვევა საიტის მთავარი ფერით, ბადის თავისუფალ ადგილას */}
            <Link
              key="join"
              href="/join"
              className="group flex h-full min-h-72 flex-col justify-between overflow-hidden rounded-[1.5rem] bg-accent p-5 text-on-accent transition duration-300 hover:-translate-y-1.5 hover:bg-accent-hover hover:shadow-2xl active:scale-[0.99] sm:rounded-[1.75rem] sm:p-6"
            >
              <span aria-hidden className="text-3xl opacity-80">
                ✦
              </span>
              <div>
                <h3 className="text-xl font-semibold leading-tight tracking-tight sm:text-2xl">{dictionary[lang].nav.join}</h3>
                <p className="mt-2 text-sm leading-snug opacity-90">{dictionary[lang].join.text}</p>
              </div>
              <span
                aria-hidden
                className="mt-4 flex h-10 w-10 items-center justify-center self-end rounded-full bg-white/20 transition duration-300 group-hover:bg-white group-hover:text-black"
              >
                <span className="arrow-slide">→</span>
              </span>
            </Link>
          </ArtistsCarousel>
        </Reveal>
      </section>

      <TrendingWorks />

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
        <Link
          href="/about"
          className="group mt-5 inline-flex min-h-10 items-center gap-2 text-sm font-medium text-accent"
        >
          {t.aboutLink}
          <span className="arrow-slide" aria-hidden>
            →
          </span>
        </Link>
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
