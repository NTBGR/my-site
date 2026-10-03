type Props = {
  direction: "prev" | "next";
  onClick: () => void;
  label: string;
  // surface: ღია ფონზე; glass: ბანერებზე (მინისებრი)
  variant?: "surface" | "glass";
  size?: "md" | "sm";
  className?: string;
};

const variantClass = {
  surface:
    "border-transparent bg-text text-bg shadow-lg shadow-black/15 hover:bg-accent hover:text-on-accent",
  glass:
    "border-white/25 bg-white/15 text-white backdrop-blur-md hover:border-white hover:bg-white hover:text-black",
};

export default function ArrowButton({
  direction,
  onClick,
  label,
  variant = "surface",
  size = "md",
  className = "",
}: Props) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      className={`group flex ${size === "sm" ? "h-9 w-9" : "h-11 w-11"} items-center justify-center rounded-full border transition duration-300 hover:scale-105 active:scale-90 ${variantClass[variant]} ${className}`.trim()}
    >
      <svg
        viewBox="0 0 24 24"
        className={`${size === "sm" ? "h-4 w-4" : "h-5 w-5"} transition-transform duration-300 ${
          direction === "prev"
            ? "group-hover:-translate-x-0.5"
            : "group-hover:translate-x-0.5"
        }`}
        fill="none"
        stroke="currentColor"
        strokeWidth="1.9"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden
      >
        <path d={direction === "prev" ? "M19 12H5M11 6l-6 6 6 6" : "M5 12h14M13 6l6 6-6 6"} />
      </svg>
    </button>
  );
}
