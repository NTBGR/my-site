import PageBanner from "@/components/PageBanner";
import { getLang } from "@/lib/i18n";
import { CONTACT_EMAIL, privacy } from "./content";

export async function generateMetadata() {
  const p = privacy[await getLang()];
  return { title: p.title, description: p.intro };
}

export default async function PrivacyPage() {
  const p = privacy[await getLang()];

  return (
    <div className="mx-auto max-w-7xl px-4 pb-16 pt-6 sm:px-6 sm:pb-24 sm:pt-10 lg:px-10">
      <PageBanner
        title={p.title}
        text={p.intro}
        badge={p.updated}
        collage={["sachuqrebi", "khis-nakethobebi", "keramika"]}
      />

      <article className="mt-10 max-w-3xl space-y-8 sm:mt-14 sm:space-y-10">
        {p.sections.map((section) => (
          <section key={section.title}>
            <h2 className="text-xl font-semibold tracking-tight text-text sm:text-2xl">{section.title}</h2>
            {section.text?.map((paragraph) => (
              <p key={paragraph} className="mt-3 leading-relaxed text-text/80">
                {paragraph}
              </p>
            ))}
            {section.items ? (
              <ul className="mt-3 space-y-2">
                {section.items.map((item) => (
                  <li key={item} className="flex gap-3 leading-relaxed text-text/80">
                    <span aria-hidden className="mt-2.5 h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />
                    {item}
                  </li>
                ))}
              </ul>
            ) : null}
          </section>
        ))}

        <section className="rounded-[1.5rem] bg-accent-soft p-5 sm:p-6">
          <h2 className="text-xl font-semibold tracking-tight text-text">{p.contactTitle}</h2>
          <p className="mt-2 text-text/80">
            {p.contactText}{" "}
            <a
              href={`mailto:${CONTACT_EMAIL}`}
              className="font-medium text-accent underline decoration-accent/40 underline-offset-4 hover:decoration-accent"
            >
              {CONTACT_EMAIL}
            </a>
          </p>
        </section>
      </article>
    </div>
  );
}
