import type { ReactNode } from "react";
import CategoryArt from "@/components/CategoryArt";
import Photo from "@/components/Photo";
import { categoryColor } from "@/data/categories";

// საახალწლო ფოტოები: public/categories/soft-1..3.jpg (Pexels და Unsplash, უფასო ლიცენზია, ატრიბუცია არ სჭირდება).
// კოლაჟის სამი ილუსტრაციის ადგილი ბანერის მარჯვენა მხარეს
const POSITIONS = [
  { pos: "right-[22%] top-[12%] w-[15%]", r: "-6deg" },
  { pos: "right-[5%] top-[8%] w-[15%]", r: "5deg" },
  { pos: "right-[13%] top-[46%] w-[14%]", r: "-2deg" },
];

// გვერდის დაბალი ფერადი ბანერი: ბეჯი, სათაური, ტექსტი და ილუსტრაციების კოლაჟი
export default function PageBanner({
  title,
  text,
  badge,
  collage,
  festive = false,
  children,
}: {
  title: string;
  text?: string;
  badge?: string;
  collage: [string, string, string];
  // საახალწლო ბანერი: მწვანე ფონი და თოვლი
  festive?: boolean;
  children?: ReactNode;
}) {
  return (
    <section
      className={`relative isolate overflow-hidden rounded-[1.5rem] text-white shadow-lg lg:rounded-[2rem] ${festive ? "snow-bg" : ""}`}
      style={{
        background: festive
          ? "linear-gradient(135deg, #3f7d5c, #1f5a42 55%, #103b2c)"
          : "linear-gradient(135deg, #9a826b, #7f6a56 55%, #54443a)",
      }}
    >
      <div className="absolute inset-0 hidden sm:block" aria-hidden>
        {collage.map((slug, i) => (
          <div
            key={slug}
            className={`float absolute ${POSITIONS[i].pos} max-w-[9rem] overflow-hidden rounded-2xl shadow-xl ring-[3px] ring-white/15`}
            style={{ ["--r" as string]: POSITIONS[i].r }}
          >
            {festive ? (
              <div className="relative aspect-[4/3]" style={{ filter: "saturate(.86) sepia(.14) contrast(.97) brightness(.98)" }}>
                <Photo src={`/categories/soft-${["1", "2", "3c"][i]}.jpg`} alt="" sizes="144px" />
              </div>
            ) : <CategoryArt slug={slug} color={categoryColor(slug)} className="aspect-[4/3]" />}
          </div>
        ))}
      </div>
      <div className="relative z-10 flex min-h-[11rem] flex-col justify-center p-5 sm:min-h-[15rem] sm:max-w-[58%] sm:px-10 sm:py-8">
        {badge ? (
          <p className="mb-2 inline-flex w-fit items-center rounded-full border border-white/30 bg-white/10 px-3 py-0.5 text-xs font-medium backdrop-blur-md">
            {badge}
          </p>
        ) : null}
        <h1 className="text-balance text-[min(1.625rem,6.4vw)] font-semibold leading-[1.1] tracking-tight sm:text-3xl lg:text-4xl xl:text-5xl">
          {title}
        </h1>
        {text ? <p className="mt-2 max-w-md text-sm text-white/85 sm:text-lg">{text}</p> : null}
        {children ? <div className="mt-4">{children}</div> : null}
      </div>
    </section>
  );
}
