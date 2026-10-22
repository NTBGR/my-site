// ბანერის ფონის მოძრავი ორნამენტი: ნელა მცურავი წრეები (რგოლი და შევსებული წრე).
// თეთრი და გამჭვირვალეა; ანიმაცია ითიშება, თუ ადამიანს ასე აქვს პარამეტრებში (globals.css, .orn-*)

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

export default function BannerOrnament({ zone = "right", className = "" }: { zone?: keyof typeof ZONES; className?: string }) {
  return (
    <svg
      aria-hidden
      viewBox="0 0 300 240"
      preserveAspectRatio={ZONES[zone].fit}
      className={`pointer-events-none absolute ${ZONES[zone].box} ${className}`.trim()}
    >
      <circle className="orn-drift" cx="250" cy="30" r="70" fill="none" stroke="#fff" strokeOpacity=".1" strokeWidth="22" />
      <circle className="orn-bob" cx="110" cy="245" r="60" fill="#fff" fillOpacity=".07" />
    </svg>
  );
}
