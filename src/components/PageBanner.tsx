import type { ReactNode } from "react";
import CategoryArt from "@/components/CategoryArt";
import { categoryColor } from "@/data/categories";

// კოლაჟის სამი ილუსტრაციის ადგილი ბანერის მარჯვენა მხარეს
const POSITIONS = [
  { pos: "right-[23%] top-[12%] w-[16%]", r: "-6deg" },
  { pos: "right-[5%] top-[8%] w-[16%]", r: "5deg" },
  { pos: "right-[13%] top-[52%] w-[15%]", r: "-2deg" },
];

// გვერდის დაბალი ფერადი ბანერი: ბეჯი, სათაური, ტექსტი და ილუსტრაციების კოლაჟი
export default function PageBanner({
  title,
  text,
  badge,
  collage,
  children,
}: {
  title: string;
  text?: string;
  badge?: string;
  collage: [string, string, string];
  children?: ReactNode;
}) {
  return (
    <section
      className="relative isolate overflow-hidden rounded-[2rem] text-white shadow-lg lg:rounded-[2.5rem]"
      style={{
        background:
          "linear-gradient(135deg, color-mix(in srgb, var(--accent), white 14%), var(--accent) 55%, color-mix(in srgb, var(--accent), black 34%))",
      }}
    >
      <div className="absolute inset-0 hidden sm:block" aria-hidden>
        {collage.map((slug, i) => (
          <div
            key={slug}
            className={`float absolute ${POSITIONS[i].pos} overflow-hidden rounded-2xl shadow-2xl ring-4 ring-white/15`}
            style={{ ["--r" as string]: POSITIONS[i].r }}
          >
            <CategoryArt slug={slug} color={categoryColor(slug)} className="aspect-[4/3]" />
          </div>
        ))}
      </div>
      <div className="relative z-10 flex min-h-[11rem] flex-col justify-end p-6 sm:min-h-[14rem] sm:max-w-[58%] sm:justify-center sm:p-10">
        {badge ? (
          <p className="mb-3 inline-flex w-fit items-center rounded-full border border-white/30 bg-white/10 px-3 py-1 text-xs font-medium backdrop-blur-md sm:text-sm">
            {badge}
          </p>
        ) : null}
        <h1 className="text-balance text-3xl font-semibold leading-[1.1] tracking-tight sm:text-5xl">
          {title}
        </h1>
        {text ? <p className="mt-2 max-w-md text-sm text-white/85 sm:text-lg">{text}</p> : null}
        {children ? <div className="mt-5">{children}</div> : null}
      </div>
    </section>
  );
}
