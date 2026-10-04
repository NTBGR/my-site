import Link from "next/link";
import PageBanner from "@/components/PageBanner";
import { dictionary } from "@/lib/dictionary";
import { getLang } from "@/lib/i18n";

export async function generateMetadata() {
  return { title: dictionary[await getLang()].blog.title };
}

export default async function BlogPage() {
  const all = dictionary[await getLang()];
  const t = all.blog;

  return (
    <div className="mx-auto max-w-7xl px-4 pb-16 pt-6 sm:px-6 sm:pb-24 sm:pt-10 lg:px-10">
      <PageBanner
        title={t.title}
        text={t.text}
        badge={t.badge}
        collage={["tekstili", "khis-nakethobebi", "saxlis-dekori"]}
      />

      {/* რაზე დავწერთ */}
      <section className="mt-10 sm:mt-14">
        <h2 className="text-2xl font-semibold tracking-tight text-text sm:text-3xl">
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
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-accent-soft font-serif font-semibold text-accent"
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
      <section className="mt-10 flex flex-col gap-5 rounded-[1.5rem] bg-accent-soft p-5 sm:mt-14 sm:flex-row sm:items-center sm:justify-between sm:p-8">
        <div>
          <h2 className="text-xl font-semibold tracking-tight text-text sm:text-2xl">
            {t.storyTitle}
          </h2>
          <p className="mt-1 max-w-xl text-sm leading-relaxed text-text/75 sm:text-base">
            {t.storyText}
          </p>
        </div>
        <div className="flex shrink-0 flex-wrap gap-3">
          <Link
            href="/join"
            className="group inline-flex min-h-12 items-center gap-2 rounded-full bg-accent px-6 text-sm font-medium text-on-accent transition duration-300 hover:-translate-y-0.5 hover:shadow-lg active:scale-95"
          >
            {all.nav.join}
            <span className="arrow-slide" aria-hidden>
              →
            </span>
          </Link>
          <Link
            href="/artists"
            className="inline-flex min-h-12 items-center rounded-full border border-border bg-surface px-6 text-sm font-medium text-text transition duration-300 hover:border-accent hover:text-accent"
          >
            {t.cta}
          </Link>
        </div>
      </section>
    </div>
  );
}
