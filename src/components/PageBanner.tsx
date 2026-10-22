import type { ReactNode } from "react";
import CategoryArt from "@/components/CategoryArt";
import Photo from "@/components/Photo";
import { categoryColor } from "@/data/categories";
import { TONES, toneGradient, type Tone } from "@/lib/tones";

export type BannerTone = Tone;

// საახალწლო ფოტოები: public/categories/soft-1..3.jpg (Pexels და Unsplash, უფასო ლიცენზია, ატრიბუცია არ სჭირდება).
// კოლაჟის სამი ფოტოს ადგილი ბანერის მარჯვენა მხარეს
const POSITIONS = [
  { pos: "right-[24%] top-[14%] w-[15%]", r: "-6deg" },
  { pos: "right-[5%] top-[9%] w-[16%]", r: "5deg" },
  { pos: "right-[14%] top-[48%] w-[14%]", r: "-2deg" },
];

// გვერდის დაბალი ფერადი ბანერი: ბეჯი, სათაური, ტექსტი და ფოტოების კოლაჟი „ამობეჭდილ“ ჩარჩოებში
export default function PageBanner({
  title,
  text,
  badge,
  collage,
  tone = "clay",
  festive = false,
  children,
}: {
  title: string;
  text?: string;
  badge?: string;
  collage: [string, string, string];
  tone?: BannerTone;
  // საახალწლო ბანერი: მწვანე ფონი და თოვლი
  festive?: boolean;
  children?: ReactNode;
}) {
  const base = TONES[tone];
  const photo = (slug: string, i: number) =>
    festive ? (
      <div className="relative aspect-[4/3]" style={{ filter: "saturate(.86) sepia(.14) contrast(.97) brightness(.98)" }}>
        <Photo src={`/categories/soft-${["1", "2", "3c"][i]}.jpg`} alt="" sizes="144px" />
      </div>
    ) : (
      <CategoryArt slug={slug} color={categoryColor(slug)} className="aspect-[4/3]" />
    );
  return (
    <section
      className={`relative isolate overflow-hidden rounded-[1.5rem] text-white shadow-lg lg:rounded-[2rem] ${festive ? "snow-bg" : "grain"}`}
      style={{
        background: festive ? "linear-gradient(135deg, #3f7d5c, #1f5a42 55%, #103b2c)" : toneGradient(base),
        ["--tone" as string]: festive ? "#1f5a42" : base,
      }}
    >
      {/* რბილი შუქი და დიდი წრეები: ტელეფონზეც (სადაც კოლაჟი არ ჩანს) ბანერი ცოცხალია */}
      <div aria-hidden className="pointer-events-none absolute inset-0">
        <div
          className="absolute inset-0"
          style={{ background: "radial-gradient(60% 90% at 88% 8%, rgb(255 255 255 / 0.22), transparent 70%)" }}
        />
        <div className="blob absolute -right-16 -top-20 h-56 w-56 rounded-full border-[28px] border-white/10 sm:h-72 sm:w-72" />
        <div className="absolute -bottom-24 right-[30%] h-48 w-48 rounded-full bg-white/[0.07]" />
      </div>
      {/* დესკტოპზე სამი ფოტო, ტელეფონზე ერთი კუთხეში */}
      <div className="absolute inset-0 z-[2] hidden sm:block" aria-hidden>
        {collage.map((slug, i) => (
          <div
            key={slug}
            className={`float print absolute ${POSITIONS[i].pos} max-w-[9.5rem]`}
            style={{ ["--r" as string]: POSITIONS[i].r }}
          >
            {photo(slug, i)}
          </div>
        ))}
      </div>
      <div
        aria-hidden
        className="float print print-sm absolute right-4 top-4 z-[2] w-[5.25rem] sm:hidden"
        style={{ ["--r" as string]: "5deg" }}
      >
        {photo(collage[0], 0)}
      </div>
      <div className="relative z-10 min-h-[8.5rem] p-5 sm:flex sm:min-h-[15rem] sm:max-w-[58%] sm:flex-col sm:justify-center sm:px-10 sm:py-8">
        {/* ტელეფონზე ფოტოს ადგილი: ტექსტი მას გარს უვლის და ქვემოთ მთელ სიგანეს იყენებს */}
        <div aria-hidden className="float-right ml-3 h-[4.5rem] w-[5.25rem] sm:hidden" />
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
