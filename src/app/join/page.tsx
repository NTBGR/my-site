import Link from "next/link";
import JoinForm from "@/components/JoinForm";
import PageBanner from "@/components/PageBanner";
import { dictionary } from "@/lib/dictionary";
import { getLang } from "@/lib/i18n";

export function generateMetadata() {
  return { title: dictionary[getLang()].join.title };
}

export default function JoinPage() {
  const all = dictionary[getLang()];
  const t = all.join;

  return (
    <div className="mx-auto max-w-7xl px-4 pb-16 pt-6 sm:px-6 sm:pb-24 sm:pt-10 lg:px-10">
      {/* ბანერი: ვინც უკვე გადაწყვიტა, ღილაკით პირდაპირ ფორმაზე გადადის */}
      <PageBanner
        title={t.title}
        text={t.text}
        badge={t.benefits[0].title}
        collage={["tyavi", "keramika", "samkauli"]}
      >
        <a
          href="#apply"
          className="group inline-flex min-h-11 items-center gap-2 rounded-full bg-white px-6 text-sm font-medium text-black transition duration-300 hover:-translate-y-0.5 hover:shadow-xl active:scale-95"
        >
          {all.form.open}
          <span aria-hidden className="transition-transform duration-300 group-hover:translate-y-0.5">
            ↓
          </span>
        </a>
      </PageBanner>

      {/* რას მიიღებ: სამი ბარათი ერთ რიგში */}
      <section className="mt-10 sm:mt-14">
        <h2 className="text-2xl font-semibold tracking-tight text-text sm:text-3xl">
          {t.benefitsTitle}
        </h2>
        <ul className="stagger mt-5 grid gap-3 sm:gap-4 md:grid-cols-3">
          {t.benefits.map((item, i) => (
            <li
              key={item.title}
              className="flex gap-4 rounded-[1.25rem] border border-border bg-surface p-4 sm:p-5 md:flex-col md:gap-3"
            >
              <span
                aria-hidden
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-accent-soft font-serif font-semibold text-accent"
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
        </div>

        <div
          id="apply"
          className="scroll-mt-24 rounded-[1.75rem] border border-border bg-surface p-5 shadow-sm sm:p-8"
        >
          <JoinForm />
        </div>
      </section>
    </div>
  );
}
