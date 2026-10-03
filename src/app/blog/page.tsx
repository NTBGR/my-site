import PageHeader from "@/components/PageHeader";
import Button from "@/components/ui/Button";
import { dictionary } from "@/lib/dictionary";
import { getLang } from "@/lib/i18n";

export function generateMetadata() {
  return { title: dictionary[getLang()].blog.title };
}

export default function BlogPage() {
  const t = dictionary[getLang()].blog;

  return (
    <>
      <PageHeader title={t.title} text={t.text} />
      <div className="mx-auto max-w-7xl px-4 pb-16 pt-10 sm:px-6 lg:px-10 sm:pb-24 sm:pt-14">
        <h2 className="text-2xl font-semibold tracking-tight text-text sm:text-3xl">
          {t.topicsTitle}
        </h2>
        <ul className="stagger mt-8 grid grid-cols-1 gap-5 md:grid-cols-3">
          {t.topics.map((topic, i) => (
            <li
              key={topic.title}
              className="group rounded-[1.75rem] border border-border bg-surface p-7 transition duration-300 hover:-translate-y-1.5 hover:border-accent hover:shadow-xl"
            >
              <span
                aria-hidden
                className="font-serif text-5xl font-semibold leading-none text-accent opacity-25 transition-opacity duration-300 group-hover:opacity-100"
              >
                {String(i + 1).padStart(2, "0")}
              </span>
              <h3 className="mt-5 text-xl font-semibold tracking-tight text-text">
                {topic.title}
              </h3>
              <p className="mt-2 leading-relaxed text-muted">{topic.text}</p>
            </li>
          ))}
        </ul>

        <div className="mt-12">
          <Button href="/artists" variant="secondary">
            {t.cta}
          </Button>
        </div>
      </div>
    </>
  );
}
