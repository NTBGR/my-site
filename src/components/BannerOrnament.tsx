// ბანერის ფონის მოძრავი ორნამენტი: ნელა მცურავი წრეები (რგოლი და შევსებული წრე).
// თეთრი და გამჭვირვალეა; ანიმაცია ითიშება, თუ ადამიანს ასე აქვს პარამეტრებში (globals.css, .orn-*)

// zone: სად დგას ორნამენტი, რომ ფოტოებმა არ დაფაროს.
// right: მარჯვენა მხარე (ბანერები ფოტოების გარეშე); gap: ტექსტსა და ფოტოებს შორის.
// ტელეფონზე ეს ნახატი არ ჩანს: მის ნაცვლად ერთი მთლიანი რგოლია ქვედა მარჯვენა კუთხეში (მოჭრილი რკალი უცნაურად ჩანდა)
const ZONES = {
  right: {
    box: "inset-y-0 right-0 h-full w-[55%] [mask-image:linear-gradient(to_right,transparent,black_40%)]",
    fit: "xMaxYMid slice",
  },
  gap: {
    box: "inset-y-0 left-[37%] h-full w-[24%] [mask-image:linear-gradient(to_right,transparent,black_30%,black_70%,transparent)]",
    fit: "xMidYMid slice",
  },
} as const;

export default function BannerOrnament({ zone = "right", className = "" }: { zone?: keyof typeof ZONES; className?: string }) {
  return (
    <>
      <svg
        aria-hidden
        viewBox="0 0 300 240"
        preserveAspectRatio={ZONES[zone].fit}
        className={`pointer-events-none absolute hidden sm:block ${ZONES[zone].box} ${className}`.trim()}
      >
        <circle className="orn-drift" cx="250" cy="30" r="70" fill="none" stroke="#fff" strokeOpacity=".1" strokeWidth="22" />
        <circle className="orn-bob" cx="110" cy="245" r="60" fill="#fff" fillOpacity=".07" />
      </svg>
      <span
        aria-hidden
        className={`orn-drift pointer-events-none absolute -bottom-16 -right-16 h-44 w-44 rounded-full border-[22px] border-white/10 sm:hidden ${className}`.trim()}
      />
    </>
  );
}
