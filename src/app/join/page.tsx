import Link from "next/link";
import BackLink from "@/components/BackLink";
import ApplyShortcut from "@/components/ApplyShortcut";
import JoinForm from "@/components/JoinForm";
import PageBanner from "@/components/PageBanner";
import { categories } from "@/data/categories";
import { dictionary } from "@/lib/dictionary";
import { getLang } from "@/lib/i18n";
import { RIBBON } from "@/lib/tones";

export async function generateMetadata() {
  return { title: dictionary[await getLang()].join.title };
}

export default async function JoinPage({ searchParams }: { searchParams: Promise<{ category?: string }> }) {
  const all = dictionary[await getLang()];
  // ცარიელი კატეგორიის გვერდიდან მოსულს ფორმაში ეს კატეგორია უკვე არჩეული აქვს
  const requested = (await searchParams).category;
  const defaultCategory = categories.some((c) => c.slug === requested) ? requested : undefined;
  const t = all.join;

  return (
    <div className="mx-auto max-w-7xl px-4 pb-16 pt-1 sm:px-6 sm:pb-24 sm:pt-3 lg:px-10">
      <BackLink href="/" home />
      {/* ბანერი: ვინც უკვე გადაწყვიტა, ღილაკით პირდაპირ ფორმაზე გადადის */}
      <PageBanner
        title={t.title}
        text={t.text}
        badge={t.benefits[0].title}
        collage={["tyavi", "keramika", "samkauli"]}
        tone="marigold"
      >
        <a
          href="#apply"
          className="group btn btn-light"
        >
          {all.form.open}
          <span aria-hidden className="transition-transform duration-300 group-hover:translate-y-0.5">
            ↓
          </span>
        </a>
      </PageBanner>

      {/* რას მიიღებ: სამი ბარათი ერთ რიგში */}
      <section className="mt-10 sm:mt-14">
        <h2 className="title-mark text-2xl font-semibold tracking-tight text-text sm:text-3xl">
          {t.benefitsTitle}
        </h2>
        <ul className="stagger mt-5 grid gap-3 sm:gap-4 md:grid-cols-3">
          {t.benefits.map((item, i) => (
            <li
              key={item.title}
              className="flex gap-4 rounded-[1.25rem] border border-border bg-surface p-4 shadow-[0_12px_28px_-22px_rgb(60_40_20/0.5)] sm:p-5 md:flex-col md:gap-3"
            >
              <span
                aria-hidden
                className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full font-serif text-lg font-semibold bg-accent text-white shadow-md"
              >
                {i + 1}
              </span>
              <div>
                <h3 className="text-base font-semibold tracking-tight text-text sm:text-lg">
                  {item.title}
                </h3>
                <p className="mt-1 text-sm leading-relaxed text-muted">{item.text}</p>
              </div>
            </li>
          ))}
        </ul>
      </section>

      {/* ჩართვის ნაბიჯები და ფორმა */}
      <section
        className="mt-10 grid items-start gap-6 sm:mt-14 lg:grid-cols-[4fr_7fr] lg:gap-10"
      >
        <div className="rounded-[1.5rem] bg-accent-soft p-5 sm:p-6 lg:sticky lg:top-28">
          <h2 className="text-xl font-semibold tracking-tight text-text sm:text-2xl">
            {t.stepsTitle}
          </h2>
          <ol className="mt-4 space-y-3">
            {t.steps.map((step, i) => (
              <li key={step} className="flex gap-3 text-sm leading-relaxed text-text/80">
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-surface text-xs font-semibold text-accent">
                  {i + 1}
                </span>
                {step}
              </li>
            ))}
          </ol>
          <Link
            href="/artists"
            className="group mt-5 inline-flex items-center gap-2 text-sm font-medium text-accent"
          >
            {t.existing}
            <span className="arrow-slide" aria-hidden>
              →
            </span>
          </Link>
          <Link href="/faq" className="group mt-2 inline-flex items-center gap-2 text-sm font-medium text-accent">
            {t.faqQuestions}
            <span className="arrow-slide" aria-hidden>
              →
            </span>
          </Link>
        </div>

        <div
          id="apply"
          className="relative scroll-mt-24 overflow-hidden rounded-[1.75rem] border border-border bg-surface p-5 pt-7 shadow-[0_24px_48px_-32px_rgb(60_40_20/0.55)] sm:p-8 sm:pt-10"
        >
          <div aria-hidden className="absolute inset-x-0 top-0 h-1.5" style={{ background: RIBBON }} />
          <JoinForm defaultCategory={defaultCategory} />
        </div>
      </section>

      <ApplyShortcut label={all.form.open} />
    </div>
  );
}
