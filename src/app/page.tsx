import Image from "next/image";
import Link from "next/link";
import Reveal from "@/components/Reveal";
import WorkCard from "@/components/WorkCard";
import { getLocalizedArtists, getWorkEntries, interleavedWorks, type WorkEntry } from "@/data/artists";
import { categories, localizeCategory } from "@/data/categories";
import { BLUR_DATA_URL } from "@/lib/blur";
import { dictionary } from "@/lib/dictionary";
import { getLang } from "@/lib/i18n";
import { toWorkCard } from "@/lib/workCard";

const MIN_WORKS_FOR_COLLECTIONS = 30;
const sectionClass = "mx-auto max-w-7xl px-4 pt-12 sm:px-6 lg:px-10 sm:pt-16";
const h2Class = "text-balance text-2xl font-semibold leading-tight tracking-tight text-text sm:text-3xl lg:text-4xl";

// ნამუშევრების ბადე (ერთნაირი ბარათით)
function WorkGrid({ entries, cols = "lg:grid-cols-4" }: { entries: WorkEntry[]; cols?: string }) {
  return (
    <ul className={`grid grid-cols-2 gap-x-3 gap-y-5 sm:grid-cols-3 sm:gap-x-4 sm:gap-y-6 ${cols}`}>
      {entries.map((entry) => (
        <li key={`${entry.artist.slug}-${entry.id}`}>
          <WorkCard card={toWorkCard(entry)} />
        </li>
      ))}
    </ul>
  );
}

export default async function Home() {
  const lang = await getLang();
  const dict = dictionary[lang];
  const t = dict.home;
  const ui = dict.ui;
  const artists = getLocalizedArtists(lang);
  const all = getWorkEntries(lang);
  // მთავარ ვიტრინაში ცნობილი ადამიანების პოსტერები არ ჩანს (სამართლებრივი რისკი); ისინი კატეგორიასა და ძებნაში რჩება
  const showcase = interleavedWorks(lang, 8, ["posterebi"]);

  // კატეგორიის წრე: პირველი ნამდვილი ფოტო ამ კატეგორიიდან (თუ არ არის, ილუსტრაცია)
  const usedImages = new Set<string>();
  const circles = categories
    .map((c) => {
      const candidates = all.filter((e) => e.artist.categories.includes(c.slug) && !e.artist.categories.includes("posterebi") && e.work.image);
      const entry = candidates.find((e) => !usedImages.has(e.work.image as string)) ?? candidates[0];
      if (entry?.work.image) usedImages.add(entry.work.image);
      const full = localizeCategory(c, lang).name;
      return { slug: c.slug, name: full.split(/ და | & /)[0], image: entry?.work.image };
    })
    .filter((c) => c.image);

  // კოლექციები: ჩანს მხოლოდ მაშინ, როცა შიგნით ნივთია
  const collections = [
    { title: ui.collectionUnder50, href: "/search", items: all.filter((e) => (e.work.price ?? Infinity) < 50) },
    { title: ui.collectionTbilisi, href: "/categories/keramika", items: all.filter((e) => e.artist.city === (lang === "ka" ? "თბილისი" : "Tbilisi") && e.artist.categories.includes("keramika")) },
    { title: ui.collectionUnique, href: "/search", items: all.filter((e) => e.work.unique) },
    { title: ui.collectionMadeToOrder, href: "/search", items: all.filter((e) => e.work.madeToOrder) },
  ]
    .map((c) => ({ ...c, items: c.items.slice(0, 4) }))
    .filter((c) => c.items.length > 0)
    .slice(0, 3);
  // ცოტა ნამუშევრით კოლექციები იგივე ნივთებს იმეორებს, ამიტომ ჩანს მხოლოდ ბევრი ნამუშევრის შემთხვევაში
  const showCollections = all.length >= MIN_WORKS_FOR_COLLECTIONS;

  // „გაიცანი ხელოვანი“: პირველი ხელოვანი სამი ნამუშევრით
  const spotlight = artists[0];
  const spotlightWorks = spotlight ? all.filter((e) => e.artist.slug === spotlight.slug).slice(0, 3) : [];
  const spotlightPhoto = spotlight ? spotlight.banner || spotlight.cover || spotlight.works.find((w) => w.image)?.image : undefined;

  return (
    <div className="pb-16 sm:pb-24">
      {/* მოკლე მისალმება: ერთი სტატიკური ზოლი */}
      <section className="mx-auto max-w-7xl px-4 pt-5 sm:px-6 sm:pt-8 lg:px-10">
        <div
          className="grain relative isolate overflow-hidden rounded-[1.5rem] px-5 py-5 text-white shadow-lg sm:px-10 sm:py-12 lg:rounded-[2rem]"
          style={{ background: "linear-gradient(135deg, #d4623a, #c4553a 55%, #7a2f1b)" }}
        >
          <h1 className="max-w-2xl text-balance text-2xl font-semibold leading-[1.1] tracking-tight sm:text-5xl">{ui.introTitle}</h1>
          <p className="mt-2 max-w-xl text-sm text-white/90 sm:mt-3 sm:text-lg">{ui.introText}</p>
          <Link
            href="/search"
            className="mt-6 hidden min-h-12 items-center gap-2 rounded-full bg-white px-7 sm:inline-flex text-sm font-medium text-black transition duration-300 hover:-translate-y-0.5 hover:shadow-xl active:scale-95"
          >
            {ui.introCta}
            <span aria-hidden>→</span>
          </Link>
        </div>
      </section>

      {/* კატეგორიების წრეები (რეალური ფოტოებით), ჰორიზონტალურად */}
      <section className="mx-auto max-w-7xl pt-8 sm:px-6 lg:px-10">
        <ul className="flex gap-4 overflow-x-auto px-4 pb-2 [scrollbar-width:none] sm:gap-6 sm:px-0 [&::-webkit-scrollbar]:hidden">
          {circles.map((c) => (
            <li key={c.slug} className="shrink-0">
              <Link href={`/categories/${c.slug}`} className="group flex w-[4.75rem] flex-col items-center gap-2 text-center sm:w-24">
                <span className="relative block h-[4.5rem] w-[4.5rem] overflow-hidden rounded-full shadow-md ring-2 ring-border transition duration-300 group-hover:-translate-y-1 group-hover:ring-accent sm:h-20 sm:w-20">
                  <Image src={c.image as string} alt="" fill sizes="80px" placeholder="blur" blurDataURL={BLUR_DATA_URL} className="object-cover" />
                </span>
                <span className="text-xs font-medium leading-tight text-text group-hover:text-accent sm:text-sm">{c.name}</span>
              </Link>
            </li>
          ))}
        </ul>
      </section>

      {/* ახალი ნამუშევრები */}
      <section className={sectionClass}>
        <Reveal className="mb-5 flex items-end justify-between gap-4 sm:mb-8">
          <h2 className={h2Class}>{ui.newWorks}</h2>
          <Link href="/search" className="inline-flex min-h-11 shrink-0 items-center gap-1.5 text-sm font-medium text-accent hover:text-accent-hover">
            {t.allWorks} →
          </Link>
        </Reveal>
        <Reveal>
          <ul className="grid grid-cols-2 gap-x-3 gap-y-5 sm:grid-cols-3 sm:gap-x-4 sm:gap-y-6 lg:grid-cols-4">
            {showcase.map((entry, i) => (
              <li key={`${entry.artist.slug}-${entry.id}`} className={i >= 6 ? "hidden lg:block" : undefined}>
                <WorkCard card={toWorkCard(entry)} priority={i < 4} />
              </li>
            ))}
          </ul>
        </Reveal>
      </section>

      {/* კოლექციები */}
      {(showCollections ? collections : []).map((collection) => (
        <section key={collection.title} className={sectionClass}>
          <Reveal className="mb-5 flex items-end justify-between gap-4 sm:mb-8">
            <h2 className={h2Class}>{collection.title}</h2>
            <Link href={collection.href} className="inline-flex min-h-11 shrink-0 items-center gap-1.5 text-sm font-medium text-accent hover:text-accent-hover">
              {t.allWorks} →
            </Link>
          </Reveal>
          <Reveal>
            <WorkGrid entries={collection.items} />
          </Reveal>
        </section>
      ))}

      {/* გაიცანი ხელოვანი */}
      {spotlight ? (
        <section className={sectionClass}>
          <Reveal className="mb-5 sm:mb-8">
            <h2 className={h2Class}>{ui.meetMaker}</h2>
          </Reveal>
          <Reveal>
            <div className="grid gap-5 overflow-hidden rounded-[1.75rem] border border-border bg-surface p-4 sm:p-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.4fr)] lg:gap-8">
              <div className="flex flex-col">
                <Link href={`/artists/${spotlight.slug}`} className="group relative block aspect-[4/3] overflow-hidden rounded-[1.25rem] bg-surface-2">
                  {spotlightPhoto ? (
                    <Image
                      src={spotlightPhoto}
                      alt={spotlight.name}
                      fill
                      sizes="(min-width: 1024px) 35vw, 100vw"
                      placeholder="blur"
                      blurDataURL={BLUR_DATA_URL}
                      className="object-cover transition duration-500 group-hover:scale-[1.03]"
                    />
                  ) : null}
                </Link>
                <h3 className="mt-4 text-2xl font-semibold tracking-tight text-text">{spotlight.name}</h3>
                <p className="text-sm text-muted">
                  {spotlight.category}
                  {spotlight.city ? ` · ${spotlight.city}` : ""}
                </p>
                <p className="mt-3 line-clamp-4 text-sm leading-relaxed text-muted">{spotlight.bio}</p>
                <Link
                  href={`/artists/${spotlight.slug}`}
                  className="mt-4 inline-flex min-h-11 w-fit items-center rounded-full border border-border bg-bg px-5 text-sm font-medium text-text transition duration-300 hover:border-accent hover:text-accent"
                >
                  {dict.workPage.viewProfile} →
                </Link>
              </div>
              <ul className="grid grid-cols-3 gap-3">
                {spotlightWorks.map((entry) => (
                  <li key={entry.id}>
                    <WorkCard card={toWorkCard(entry)} />
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>
        </section>
      ) : null}

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
