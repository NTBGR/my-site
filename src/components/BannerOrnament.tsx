import type { ReactNode } from "react";

// ბანერის ფონის მოძრავი ორნამენტი: წრეები ან ციმციმა ვარსკვლავები.
// თეთრი და გამჭვირვალეა, ნელა მოძრაობს; ანიმაცია ითიშება, თუ ადამიანს ასე აქვს პარამეტრებში (globals.css, .orn-*)
export type OrnamentKind = "circles" | "sparkles";

const star = (cx: number, cy: number, s: number) => {
  const k = s * 0.28;
  return `M${cx} ${cy - s}L${cx + k} ${cy - k}L${cx + s} ${cy}L${cx + k} ${cy + k}L${cx} ${cy + s}L${cx - k} ${cy + k}L${cx - s} ${cy}L${cx - k} ${cy - k}Z`;
};

const SHAPES: Record<OrnamentKind, ReactNode> = {
  circles: (
    <>
      <circle className="orn-drift" cx="250" cy="30" r="70" fill="none" stroke="#fff" strokeOpacity=".1" strokeWidth="22" />
      <circle className="orn-bob" cx="110" cy="245" r="60" fill="#fff" fillOpacity=".07" />
    </>
  ),
  sparkles: (
    <g fill="#fff">
      <path className="orn-twinkle" d={star(240, 50, 22)} fillOpacity=".3" />
      <path className="orn-twinkle [animation-delay:-1.2s]" d={star(170, 110, 12)} fillOpacity=".24" />
      <path className="orn-twinkle [animation-delay:-2.4s]" d={star(272, 150, 14)} fillOpacity=".22" />
      <path className="orn-twinkle [animation-delay:-3.1s]" d={star(205, 200, 9)} fillOpacity=".2" />
      <path className="orn-twinkle [animation-delay:-0.6s]" d={star(120, 40, 8)} fillOpacity=".18" />
    </g>
  ),
};

// zone: სად დგას ორნამენტი, რომ ფოტოებმა არ დაფაროს.
// right: მარჯვენა მხარე (ბანერები ფოტოების გარეშე); gap: დესკტოპზე ტექსტსა და ფოტოებს შორის, ტელეფონზე ქვემოთ, კუთხის ფოტოს ქვეშ
const ZONES = {
  right: {
    box: "inset-y-0 right-0 h-full w-[75%] [mask-image:linear-gradient(to_right,transparent,black_40%)] sm:w-[55%]",
    fit: "xMaxYMid slice",
  },
  gap: {
    box: "bottom-0 right-0 h-[58%] w-[70%] [mask-image:linear-gradient(to_right,transparent,black_40%)] sm:inset-y-0 sm:left-[37%] sm:right-auto sm:h-full sm:w-[24%] sm:[mask-image:linear-gradient(to_right,transparent,black_30%,black_70%,transparent)]",
    fit: "xMidYMid slice",
  },
} as const;

export default function BannerOrnament({
  kind,
  zone = "right",
  className = "",
}: {
  kind: OrnamentKind;
  zone?: keyof typeof ZONES;
  className?: string;
}) {
  return (
    <svg
      aria-hidden
      viewBox="0 0 300 240"
      preserveAspectRatio={ZONES[zone].fit}
      className={`pointer-events-none absolute ${ZONES[zone].box} ${className}`.trim()}
    >
      {SHAPES[kind]}
    </svg>
  );
}

// რომელი ორნამენტი რომელ ფერს (გვერდის ბანერები, src/lib/tones.ts)
export const TONE_ORNAMENT: Record<string, OrnamentKind> = {
  clay: "circles",
  teal: "sparkles",
  berry: "sparkles",
  ink: "circles",
  sage: "circles",
  marigold: "sparkles",
  plum: "sparkles",
};

// კატეგორიის ორნამენტი (კატეგორიის და ხელოვანის ბანერები, მთავარის სლაიდები): მეზობელი სლაიდები რომ არ გაიმეორონ
const CATEGORY_ORNAMENT: Record<string, OrnamentKind> = {
  nakhatebi: "circles",
  posterebi: "sparkles",
  bechdebi: "sparkles",
  keramika: "circles",
  skulptura: "sparkles",
  samkauli: "sparkles",
  tekstili: "circles",
  tyavi: "circles",
  "khis-nakethobebi": "circles",
  "saxlis-dekori": "sparkles",
  sachuqrebi: "sparkles",
};

export function categoryOrnament(slug: string): OrnamentKind {
  return CATEGORY_ORNAMENT[slug] ?? "circles";
}
