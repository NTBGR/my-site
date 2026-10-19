// ფიფქები მთელ გვერდზე (მხოლოდ საახალწლო გვერდზე): ფიქსირებული ფენა, რომელიც დაჭერას/სქროლს არ ერევა.
// მნიშვნელობები ფორმულით არის გამოთვლილი (არა შემთხვევით), რომ სერვერისა და ბრაუზერის გამოსახულება ერთმანეთს დაემთხვეს.
// ანიმაცია გამორთულია, თუ ადამიანს მოძრაობის შემცირება აქვს ჩართული (CSS-ში).
const FLAKES = Array.from({ length: 34 }, (_, i) => ({
  left: (i * 29 + (i % 5) * 7) % 100,
  size: 10 + ((i * 7) % 5) * 3,
  duration: 11 + ((i * 5) % 9),
  delay: -((i * 13) % 17),
  drift: ((i % 2 === 0 ? 1 : -1) * (14 + ((i * 3) % 18))),
  glyph: ["❄", "❅", "❆", "•"][i % 4],
  opacity: 0.55 + ((i * 11) % 4) * 0.1,
}));

export default function Snowfall() {
  return (
    <div aria-hidden className="snowfall pointer-events-none fixed inset-0 z-20 overflow-hidden">
      {FLAKES.map((f, i) => (
        <span
          key={i}
          className="snowflake"
          style={{
            left: `${f.left}%`,
            fontSize: `${f.size}px`,
            opacity: f.opacity,
            animationDuration: `${f.duration}s`,
            animationDelay: `${f.delay}s`,
            ["--drift" as string]: `${f.drift}px`,
          }}
        >
          {f.glyph}
        </span>
      ))}
    </div>
  );
}
