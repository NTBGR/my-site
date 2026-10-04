import Link from "next/link";
import PageBanner from "@/components/PageBanner";
import { dictionary } from "@/lib/dictionary";
import { getLang } from "@/lib/i18n";
import { CONTACT_EMAIL } from "../privacy/content";
import { about } from "./content";

export async function generateMetadata() {
  const a = about[await getLang()];
  return { title: a.title, description: a.intro };
}

export default async function AboutPage() {
  const lang = await getLang();
  const a = about[lang];
  const nav = dictionary[lang].nav;

  return (
    <div className="mx-auto max-w-7xl px-4 pb-16 pt-6 sm:px-6 sm:pb-24 sm:pt-10 lg:px-10">
      <PageBanner
        title={a.title}
        text={a.intro}
        badge={a.badge}
        collage={["keramika", "tekstili", "nakhatebi"]}
      />

      {/* ისტორია */}
      <section className="mt-10 grid gap-6 sm:mt-14 lg:grid-cols-[1fr_2fr] lg:gap-12">
        <h2 className="text-2xl font-semibold tracking-tight text-text sm:text-3xl">{a.storyTitle}</h2>
        <div className="max-w-2xl space-y-4">
          {a.story.map((paragraph, i) => (
            <p
              key={i}
              className={
                i === 0
                  ? "text-lg leading-relaxed text-text sm:text-xl"
                  : "leading-relaxed text-text/80 sm:text-lg"
              }
            >
              {paragraph}
            </p>
          ))}
        </div>
      </section>

      {/* პრინციპები */}
      <section className="mt-12 sm:mt-16">
        <h2 className="text-2xl font-semibold tracking-tight text-text sm:text-3xl">{a.principlesTitle}</h2>
        <ul className="stagger mt-5 grid gap-3 sm:grid-cols-2 sm:gap-4 lg:grid-cols-4">
          {a.principles.map((item, i) => (
            <li key={item.title} className="flex gap-4 rounded-[1.25rem] border border-border bg-surface p-5 sm:flex-col sm:gap-3">
              <span
                aria-hidden
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-accent-soft font-serif font-semibold text-accent"
              >
                {i + 1}
              </span>
              <div>
                <h3 className="text-base font-semibold tracking-tight text-text sm:text-lg">{item.title}</h3>
                <p className="mt-1 text-sm leading-relaxed text-muted">{item.text}</p>
              </div>
            </li>
          ))}
        </ul>
      </section>

      {/* დასკვნა + მოქმედებები */}
      <section className="mt-12 rounded-[1.75rem] bg-accent-soft p-6 text-center sm:mt-16 sm:p-12">
        <p className="mx-auto max-w-2xl text-balance font-serif text-2xl font-semibold leading-snug tracking-tight text-text sm:text-3xl">
          {a.closing}
        </p>
        <div className="mt-7 flex flex-wrap justify-center gap-3">
          <Link
            href="/categories"
            className="group inline-flex min-h-12 items-center gap-2 rounded-full bg-accent px-6 text-sm font-medium text-on-accent transition duration-300 hover:-translate-y-0.5 hover:shadow-lg active:scale-95"
          >
            {a.browse}
            <span className="arrow-slide" aria-hidden>
              →
            </span>
          </Link>
          <Link
            href="/join"
            className="inline-flex min-h-12 items-center rounded-full border border-border bg-surface px-6 text-sm font-medium text-text transition duration-300 hover:border-accent hover:text-accent"
          >
            {nav.join}
          </Link>
        </div>
        <p className="mt-7 text-sm text-text/70">
          {a.contact}{" "}
          <a
            href={`mailto:${CONTACT_EMAIL}`}
            className="font-medium text-accent underline decoration-accent/40 underline-offset-4 hover:decoration-accent"
          >
            {CONTACT_EMAIL}
          </a>
        </p>
      </section>
    </div>
  );
}
