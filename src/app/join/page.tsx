import Button from "@/components/ui/Button";
import JoinForm from "@/components/JoinForm";
import PageHeader from "@/components/PageHeader";
import { dictionary } from "@/lib/dictionary";
import { getLang } from "@/lib/i18n";

export function generateMetadata() {
  return { title: dictionary[getLang()].join.title };
}

export default function JoinPage() {
  const t = dictionary[getLang()].join;

  return (
    <>
      <PageHeader title={t.title} text={t.text} />
      <div className="mx-auto max-w-7xl px-4 pb-16 pt-10 sm:px-6 lg:px-10 sm:pb-24 sm:pt-14">
        <ul className="stagger grid grid-cols-1 gap-3 sm:gap-5 md:grid-cols-3">
          {t.benefits.map((item, i) => (
            <li
              key={item.title}
              className="group flex gap-4 rounded-[1.5rem] border border-border bg-surface p-4 transition duration-300 hover:-translate-y-1.5 hover:border-accent hover:shadow-xl sm:block sm:rounded-[1.75rem] sm:p-7"
            >
              <span
                aria-hidden
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-accent-soft font-semibold text-accent transition duration-300 group-hover:bg-accent group-hover:text-on-accent sm:h-11 sm:w-11"
              >
                {i + 1}
              </span>
              <div>
                <h3 className="text-lg font-semibold tracking-tight text-text sm:mt-5 sm:text-xl">
                  {item.title}
                </h3>
                <p className="mt-1 text-sm leading-relaxed text-muted sm:mt-2 sm:text-base">
                  {item.text}
                </p>
              </div>
            </li>
          ))}
        </ul>

        <div className="mt-10 grid gap-8 sm:mt-16 sm:gap-12 lg:grid-cols-[0.8fr_1.2fr]">
          <div>
            <h2 className="text-2xl font-semibold tracking-tight text-text sm:text-3xl">
              {t.stepsTitle}
            </h2>
            <ol className="stagger mt-6 space-y-4">
              {t.steps.map((step, i) => (
                <li key={step} className="flex gap-4 leading-relaxed text-muted">
                  <span className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-border text-xs font-semibold text-text">
                    {i + 1}
                  </span>
                  {step}
                </li>
              ))}
            </ol>
            <div className="mt-8">
              <Button href="/artists" variant="secondary">
                {t.existing}
              </Button>
            </div>
          </div>
          <div className="rounded-[1.75rem] border border-border bg-surface p-6 sm:p-8">
            <JoinForm />
          </div>
        </div>
      </div>
    </>
  );
}
