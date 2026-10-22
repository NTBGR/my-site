import Link from "next/link";
import BackLink from "@/components/BackLink";
import PageBanner from "@/components/PageBanner";
import SocialIcons from "@/components/SocialIcons";
import { dictionary } from "@/lib/dictionary";
import { getLang } from "@/lib/i18n";
import { TONES, toneGradient } from "@/lib/tones";
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
    <div className="mx-auto max-w-7xl px-4 pb-16 pt-1 sm:px-6 sm:pb-24 sm:pt-3 lg:px-10">
      <BackLink href="/" home />
      <PageBanner
        title={a.title}
        text={a.intro}
        badge={a.badge}
        collage={["keramika", "tekstili", "nakhatebi"]}
        tone="clay"
        photos={false}
      />

      {/* ისტორია */}
      <section className="mt-10 grid gap-6 sm:mt-14 lg:grid-cols-[1fr_2fr] lg:gap-12">
        <h2 className="title-mark text-2xl font-semibold tracking-tight text-text sm:text-3xl">{a.storyTitle}</h2>
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
        <h2 className="title-mark text-2xl font-semibold tracking-tight text-text sm:text-3xl">{a.principlesTitle}</h2>
        <ul className="stagger mt-5 grid gap-3 sm:grid-cols-2 sm:gap-4 lg:grid-cols-4">
          {a.principles.map((item, i) => (
            <li key={item.title} className="flex gap-4 rounded-[1.25rem] border border-border bg-surface p-5 sm:flex-col sm:gap-3">
              <span
                aria-hidden
                className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full font-serif text-lg font-semibold bg-accent text-white shadow-md"
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
      <section className="grain relative isolate mt-12 overflow-hidden rounded-[1.75rem] p-6 text-center text-white sm:mt-16 sm:p-12" style={{ background: toneGradient(TONES.clay) }}>
        <div aria-hidden className="blob pointer-events-none absolute -right-16 -top-20 -z-10 h-64 w-64 rounded-full border-[30px] border-white/10" />
        <p className="mx-auto max-w-2xl text-balance font-serif text-2xl font-semibold leading-snug tracking-tight sm:text-3xl">
          {a.closing}
        </p>
        <div className="mt-7 flex flex-wrap justify-center gap-3">
          <Link
            href="/categories"
            className="group btn btn-light"
          >
            {a.browse}
            <span className="arrow-slide" aria-hidden>
              →
            </span>
          </Link>
          <Link
            href="/join"
            className="btn btn-ghost-light"
          >
            {nav.join}
          </Link>
        </div>
        <p className="mt-7 text-sm text-white/80">
          {a.contact}{" "}
          <a
            href={`mailto:${CONTACT_EMAIL}`}
            className="font-medium text-white underline decoration-white/50 underline-offset-4 hover:decoration-white"
          >
            {CONTACT_EMAIL}
          </a>
        </p>
        <SocialIcons className="mt-4 justify-center" withEmail onDark />
      </section>
    </div>
  );
}
