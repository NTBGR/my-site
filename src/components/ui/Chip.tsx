import type { ButtonHTMLAttributes, ReactNode } from "react";

type ChipProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  children: ReactNode;
  selected?: boolean;
};

export default function Chip({
  children,
  selected = false,
  className = "",
  type = "button",
  ...rest
}: ChipProps) {
  return (
    <button
      type={type}
      aria-pressed={selected}
      className={`inline-flex min-h-11 items-center rounded-full px-4 text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-bg ${
        selected
          ? "bg-accent text-white"
          : "border border-border bg-surface text-text hover:border-accent"
      } ${className}`.trim()}
      {...rest}
    >
      {children}
    </button>
  );
}
