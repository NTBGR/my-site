import Link from "next/link";
import BackLink from "@/components/BackLink";
import PageBanner from "@/components/PageBanner";
import { dictionary } from "@/lib/dictionary";
import { getLang } from "@/lib/i18n";
import { TONES, toneGradient } from "@/lib/tones";

export async function generateMetadata() {
  return { title: dictionary[await getLang()].blog.title };
}

export default async function BlogPage() {
  const all = dictionary[await getLang()];
  const t = all.blog;

  return (
    <div className="mx-auto max-w-7xl px-4 pb-16 pt-1 sm:px-6 sm:pb-24 sm:pt-3 lg:px-10">
      <BackLink href="/" home />
      <PageBanner
        title={t.title}
        text={t.text}
        badge={t.badge}
        collage={["tekstili", "khis-nakethobebi", "saxlis-dekori"]}
        tone="sage"
      />

      {/* რაზე დავწერთ */}
      <section className="mt-10 sm:mt-14">
        <h2 className="title-mark text-2xl font-semibold tracking-tight text-text sm:text-3xl">
          {t.topicsTitle}
        </h2>
        <ul className="stagger mt-5 grid gap-3 sm:gap-4 md:grid-cols-3">
          {t.topics.map((topic, i) => (
            <li
              key={topic.title}
              className="flex gap-4 rounded-[1.25rem] border border-border bg-surface p-4 sm:p-5 md:flex-col md:gap-3"
            >
              <span
                aria-hidden
                className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full font-serif text-lg font-semibold text-white shadow-md"
                style={{ background: [TONES.sage, TONES.teal, TONES.plum][i % 3] }}
              >
                {i + 1}
              </span>
              <div>
                <h3 className="text-base font-semibold tracking-tight text-text sm:text-lg">
                  {topic.title}
                </h3>
                <p className="mt-1 text-sm leading-relaxed text-muted">{topic.text}</p>
              </div>
            </li>
          ))}
        </ul>
      </section>

      {/* ხელოვანებისთვის: ისტორიის მოყოლა + ბმულები */}
      <section className="grain relative isolate mt-10 flex flex-col gap-5 overflow-hidden rounded-[1.5rem] p-5 text-white sm:mt-14 sm:flex-row sm:items-center sm:justify-between sm:p-8" style={{ background: toneGradient(TONES.sage) }}>
        <div>
          <h2 className="text-xl font-semibold tracking-tight sm:text-2xl">
            {t.storyTitle}
          </h2>
          <p className="mt-1 max-w-xl text-sm leading-relaxed text-white/85 sm:text-base">
            {t.storyText}
          </p>
        </div>
        <div className="flex shrink-0 flex-wrap gap-3">
          <Link
            href="/join"
            className="group btn btn-light"
          >
            {all.nav.join}
            <span className="arrow-slide" aria-hidden>
              →
            </span>
          </Link>
          <Link
            href="/artists"
            className="btn btn-ghost-light"
          >
            {t.cta}
          </Link>
        </div>
      </section>
    </div>
  );
}
