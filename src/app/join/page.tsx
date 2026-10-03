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
      <div className="mx-auto max-w-7xl px-4 pb-16 pt-8 sm:px-6 sm:pb-24 sm:pt-12 lg:px-10">
        <div className="grid items-start gap-8 lg:grid-cols-[5fr_7fr] lg:gap-12">
          {/* მარცხენა სვეტი: რას მიიღებ და როგორ ხდება ჩართვა */}
          <div className="space-y-8 lg:sticky lg:top-28">
            <div>
              <h2 className="text-2xl font-semibold tracking-tight text-text sm:text-3xl">
                {t.benefitsTitle}
              </h2>
              <ul className="stagger mt-5 space-y-3">
                {t.benefits.map((item, i) => (
                  <li
                    key={item.title}
                    className="group flex gap-4 rounded-[1.5rem] border border-border bg-surface p-4 transition duration-300 hover:border-accent hover:shadow-lg sm:p-5"
                  >
                    <span
                      aria-hidden
                      className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-accent-soft font-semibold text-accent transition duration-300 group-hover:bg-accent group-hover:text-on-accent"
                    >
                      {i + 1}
                    </span>
                    <div>
                      <h3 className="text-lg font-semibold tracking-tight text-text">
                        {item.title}
                      </h3>
                      <p className="mt-1 text-sm leading-relaxed text-muted">
                        {item.text}
                      </p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>

            <div className="rounded-[1.75rem] bg-accent-soft p-5 sm:p-6">
              <h2 className="text-xl font-semibold tracking-tight text-text">
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
              <div className="mt-5">
                <Button href="/artists" variant="secondary">
                  {t.existing}
                </Button>
              </div>
            </div>
          </div>

          {/* ფორმა ყოველთვის ღიაა */}
          <div className="rounded-[1.75rem] border border-border bg-surface p-5 shadow-sm sm:p-8">
            <JoinForm />
          </div>
        </div>
      </div>
    </>
  );
}
