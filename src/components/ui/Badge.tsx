import type { HTMLAttributes, ReactNode } from "react";

export default function Badge({
  children,
  className = "",
  ...rest
}: HTMLAttributes<HTMLSpanElement> & { children: ReactNode }) {
  return (
    <span
      className={`inline-flex items-center rounded-full border border-border bg-bg px-2.5 py-1 text-xs font-medium text-muted ${className}`.trim()}
      {...rest}
    >
      {children}
    </span>
  );
}
