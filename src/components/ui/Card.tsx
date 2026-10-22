import type { HTMLAttributes, ReactNode } from "react";

export default function Card({
  children,
  className = "",
  ...rest
}: HTMLAttributes<HTMLDivElement> & { children: ReactNode }) {
  return (
    <div
      className={`rounded-[1.25rem] border border-border bg-surface p-5 shadow-[0_1px_0_rgb(255_255_255/0.6)_inset,0_10px_24px_-18px_rgb(60_40_20/0.35)] ${className}`.trim()}
      {...rest}
    >
      {children}
    </div>
  );
}
