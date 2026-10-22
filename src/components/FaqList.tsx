import JsonLd from "@/components/JsonLd";
import SocialIcons from "@/components/SocialIcons";
import { TONES, toneGradient } from "@/lib/tones";

// ხშირად დასმული კითხვები: ღია სია გამყოფი ხაზებით (ბარათების გარეშე), ნომრებით და ისრით. გახსნადია <details>-ით (დამატებითი JavaScript არ სჭირდება).
// დიდ ეკრანზე სათაური მარცხნივ რჩება, სია მარჯვნივ; სტრუქტურირებული მონაცემები Google-ისთვის (FAQPage)
export default function FaqList({
  items,
  title,
  contactTitle,
  contactText,
  contactEmail,
  standalone = false,
}: {
  items: { q: string; a: string }[];
  title: string;
  contactTitle: string;
  contactText: string;
  contactEmail: string;
  // ცალკე გვერდზე (/faq): ზედა ხაზისა და დიდი დაშორების გარეშე
  standalone?: boolean;
}) {
  const ld = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((item) => ({
      "@type": "Question",
      name: item.q,
      acceptedAnswer: { "@type": "Answer", text: item.a },
    })),
  };

  return (
    <section className={standalone ? "mt-10 sm:mt-14" : "mt-14 border-t border-border pt-10 sm:mt-20"} aria-labelledby="faq-title">
      <JsonLd data={ld} />
      <h2
        id="faq-title"
        className={standalone ? "sr-only" : "mb-6 font-serif text-3xl font-semibold leading-tight tracking-tight text-text sm:text-4xl"}
      >
        {title}
      </h2>

      <div className="grid gap-3">
        {items.map((item, i) => (
          <details key={item.q} className="group rounded-[1.25rem] border-[1.5px] border-border bg-surface px-4 shadow-[0_10px_24px_-20px_rgb(60_40_20/0.5)] transition-colors open:border-accent sm:px-5">
            <summary className="flex min-h-16 cursor-pointer list-none items-center gap-4 py-4 pr-1 text-left marker:hidden [&::-webkit-details-marker]:hidden">
              <span aria-hidden className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-bold tabular-nums text-white"
                style={{ background: [TONES.clay, TONES.teal, TONES.berry, TONES.ink, TONES.sage, TONES.plum][i % 6] }}>
                {String(i + 1).padStart(2, "0")}
              </span>
              <span className="flex-1 text-base font-semibold tracking-tight text-text transition-colors group-hover:text-accent sm:text-lg">
                {item.q}
              </span>
              <svg
                aria-hidden
                viewBox="0 0 20 20"
                className="h-5 w-5 shrink-0 text-muted transition-transform duration-300 group-open:-rotate-180 group-open:text-accent"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="m5 8 5 5 5-5" />
              </svg>
            </summary>
            <p className="pb-5 pl-12 pr-6 text-[15px] leading-relaxed text-muted sm:text-base">{item.a}</p>
          </details>
        ))}
      </div>

      {/* ბოლოში ერთი სუფთა ხაზი: ტექსტი მარცხნივ, ხატულები მარჯვნივ (ტელეფონზე ერთმანეთის ქვეშ, ორივე მარცხნივ) */}
      <div className="grain relative isolate mt-6 flex flex-col gap-4 overflow-hidden rounded-[1.5rem] p-5 text-white sm:flex-row sm:items-center sm:justify-between sm:p-6" style={{ background: toneGradient(TONES.ink) }}>
        <div>
          <p className="text-lg font-semibold tracking-tight">{contactTitle}</p>
          <p className="mt-1 text-sm leading-relaxed text-white/85">
            {contactText}{" "}
            <a href={`mailto:${contactEmail}`} className="font-medium text-white underline decoration-white/50 underline-offset-4 hover:decoration-white">
              {contactEmail}
            </a>
          </p>
        </div>
        <SocialIcons withEmail onDark />
      </div>
    </section>
  );
}
