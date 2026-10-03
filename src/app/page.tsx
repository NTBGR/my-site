import Link from "next/link";
import ArtTile from "@/components/ArtTile";
import CategoryArt from "@/components/CategoryArt";
import ArtistCard from "@/components/ArtistCard";
import Marquee from "@/components/Marquee";
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
  const bento = cats.slice(0, 6);

  return (
    <div>
      {/* ჰერო */}
      <section className="relative isolate overflow-hidden">
        <div
          aria-hidden
          className="blob pointer-events-none absolute -left-32 -top-24 -z-10 h-[28rem] w-[28rem] rounded-full bg-accent-soft blur-3xl"
        />
        <div
          aria-hidden
          className="blob pointer-events-none absolute -bottom-40 right-[-8rem] -z-10 h-[26rem] w-[26rem] rounded-full blur-3xl [animation-delay:-6s]"
          style={{ background: "color-mix(in srgb, var(--accent) 22%, transparent)" }}
        />

        <div className="mx-auto grid max-w-7xl items-center gap-10 px-4 pb-12 pt-10 sm:gap-14 sm:px-6 sm:pb-20 sm:pt-20 lg:min-h-[calc(100svh-11rem)] lg:grid-cols-[1.05fr_0.95fr] lg:gap-20 lg:px-10 xl:gap-28 lg:pb-24 lg:pt-16">
          <div className="hero-in">
            <p className="inline-flex items-center gap-2.5 rounded-full border border-border bg-surface px-4 py-1.5 text-sm font-medium text-text shadow-sm">
              <span className="pulse-dot h-2 w-2 rounded-full bg-accent" />
              {t.badge}
            </p>
            <h1 className="mt-5 text-balance text-4xl font-semibold leading-[1.05] tracking-tight text-text sm:mt-6 sm:text-6xl lg:text-6xl xl:text-7xl">
              {t.title}
            </h1>
            <p className="mt-6 max-w-xl text-lg leading-relaxed text-muted sm:text-xl">
              {t.text}
            </p>
            <div className="mt-9 flex flex-wrap gap-3">
              <Link
                href="/categories"
                className="group inline-flex min-h-12 items-center gap-2 rounded-full bg-accent px-7 text-sm font-medium text-on-accent transition duration-300 hover:-translate-y-0.5 hover:bg-accent-hover hover:shadow-lg active:scale-95"
              >
                {t.ctaPrimary}
                <span className="arrow-slide" aria-hidden>
                  →
                </span>
              </Link>
              <Link
                href="/artists"
                className="inline-flex min-h-12 items-center rounded-full border border-border bg-surface px-7 text-sm font-medium text-text transition duration-300 hover:-translate-y-0.5 hover:border-accent hover:text-accent active:scale-95"
              >
                {t.ctaSecondary}
              </Link>
            </div>
            <div className="mt-8 grid grid-cols-3 gap-3 sm:hidden" aria-hidden>
              <ArtTile color={artists[0].works[0].color} variant={0} className="aspect-[4/5] rounded-3xl" />
              <ArtTile color={artists[1].works[0].color} variant={2} className="aspect-[4/5] rounded-3xl" />
              <ArtTile color={artists[2].works[0].color} variant={3} className="aspect-[4/5] rounded-3xl" />
            </div>
            <ul className="mt-8 flex flex-wrap gap-x-6 gap-y-2 text-sm text-muted sm:mt-10">
              {t.perks.map((perk) => (
                <li key={perk} className="flex items-center gap-2">
                  <span className="text-accent" aria-hidden>
                    ✦
                  </span>
                  {perk}
                </li>
              ))}
            </ul>
          </div>

          {/* ხელოვნების კოლაჟი */}
          <div className="relative mx-auto hidden h-[24rem] w-full max-w-lg sm:block sm:h-[30rem] lg:h-[34rem] lg:max-w-md xl:max-w-lg" aria-hidden>
            <div
              className="float absolute left-0 top-6 w-[58%] rounded-[2rem] shadow-2xl"
              style={{ ["--r" as string]: "-6deg" }}
            >
              <ArtTile
                color={artists[0].works[0].color}
                variant={0}
                className="aspect-[3/4] rounded-[2rem]"
              />
            </div>
            <div
              className="float absolute right-0 top-0 w-[46%] rounded-[2rem] shadow-2xl [animation-delay:-2.5s]"
              style={{ ["--r" as string]: "5deg" }}
            >
              <ArtTile
                color={artists[1].works[0].color}
                variant={2}
                className="aspect-[4/5] rounded-[2rem]"
              />
            </div>
            <div
              className="float absolute bottom-0 right-[10%] w-[42%] rounded-full shadow-2xl [animation-delay:-4.5s]"
              style={{ ["--r" as string]: "-3deg" }}
            >
              <ArtTile
                color={artists[2].works[0].color}
                variant={3}
                className="aspect-square rounded-full"
              />
            </div>
            <div
              className="float absolute bottom-6 left-[6%] flex h-24 w-24 items-center justify-center rounded-full bg-accent text-3xl text-on-accent shadow-xl [animation-delay:-1s]"
              style={{ ["--r" as string]: "10deg" }}
            >
              ✦
            </div>
          </div>
        </div>
      </section>

      {/* კატეგორიების ბეჭედი */}
      <Marquee items={cats.map((c) => c.name)} />

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

        <Reveal
          stagger
          className="grid grid-cols-2 gap-3 sm:gap-4 md:auto-rows-[13rem] md:grid-cols-4"
        >
          {bento.map((category, i) => (
            <Link
              key={category.slug}
              href={`/categories/${category.slug}`}
              className={`group relative block overflow-hidden rounded-[1.75rem] transition duration-300 hover:-translate-y-1 hover:shadow-2xl active:scale-[0.99] ${
                i === 0 ? "col-span-2 row-span-2 min-h-[14rem] sm:min-h-[18rem]" : "min-h-[9rem] sm:min-h-[11rem]"
              } ${i >= 3 ? "md:col-span-2" : ""}`}
            >
              <CategoryArt
                slug={category.slug}
                color={tileColors[i % tileColors.length]}
                className="absolute inset-0"
              />
              <div
                aria-hidden
                className="absolute inset-0 z-10 bg-gradient-to-t from-black/60 via-black/5 to-transparent"
              />
              <div className="absolute inset-x-0 bottom-0 z-20 flex items-end justify-between gap-3 p-5 text-white sm:p-6">
                <div>
                  <h3
                    className={`font-semibold leading-tight tracking-tight ${
                      i === 0 ? "text-3xl sm:text-4xl" : "text-xl"
                    }`}
                  >
                    {category.name}
                  </h3>
                  {i === 0 ? (
                    <p className="mt-2 max-w-xs text-sm text-white/80">
                      {category.description}
                    </p>
                  ) : null}
                </div>
                <span
                  className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white/20 backdrop-blur-md transition duration-300 group-hover:bg-white group-hover:text-black"
                  aria-hidden
                >
                  <span className="arrow-slide">→</span>
                </span>
              </div>
            </Link>
          ))}
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
          <p className="mt-4 text-lg text-muted">{t.howText}</p>
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
