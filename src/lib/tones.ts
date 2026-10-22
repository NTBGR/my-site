// საიტის ფერადი პალიტრა: ბანერები, ზოლები და ბარათები ერთი და იგივე ოჯახიდან იღებს ფერს
export const TONES = {
  clay: "#a84f2c",
  teal: "#2f5d62",
  berry: "#8a3b57",
  ink: "#2b3a67",
  sage: "#5c6f3f",
  marigold: "#a56a12",
  plum: "#5b4d82",
} as const;

export type Tone = keyof typeof TONES;

// გრადიენტი საბაზო ფერიდან: ზემოდან ოდნავ ნათელი, ქვემოდან ღრმა
export function toneGradient(base: string, angle = 135) {
  return `linear-gradient(${angle}deg, color-mix(in srgb, ${base}, white 14%), ${base} 52%, color-mix(in srgb, ${base}, black 40%))`;
}

// ფერების ლენტი ზედა ზოლისთვის (ჰედერის თავზე და ფუთერზე)
export const RIBBON = `linear-gradient(90deg, ${TONES.teal}, ${TONES.ink}, ${TONES.plum}, ${TONES.berry}, ${TONES.clay}, ${TONES.marigold}, ${TONES.sage})`;
