import type { HTMLAttributes, ReactNode } from "react";

export default function Badge({
  children,
  className = "",
  ...rest
}: HTMLAttributes<HTMLSpanElement> & { children: ReactNode }) {
  return (
    <span
      className={`inline-flex items-center rounded-full border border-border bg-surface px-3 py-1 text-xs font-semibold text-muted ${className}`.trim()}
      {...rest}
    >
      {children}
    </span>
  );
}
