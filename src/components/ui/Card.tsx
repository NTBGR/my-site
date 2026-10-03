import type { HTMLAttributes, ReactNode } from "react";

export default function Card({
  children,
  className = "",
  ...rest
}: HTMLAttributes<HTMLDivElement> & { children: ReactNode }) {
  return (
    <div
      className={`rounded-card border border-border bg-surface p-5 ${className}`.trim()}
      {...rest}
    >
      {children}
    </div>
  );
}
