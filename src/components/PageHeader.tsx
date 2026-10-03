import type { ReactNode } from "react";

export default function PageHeader({
  title,
  text,
  eyebrow,
  children,
}: {
  title: string;
  text?: string;
  eyebrow?: string;
  children?: ReactNode;
}) {
  return (
    <header className="relative isolate overflow-hidden border-b border-border">
      <div
        aria-hidden
        className="blob pointer-events-none absolute -right-24 -top-32 -z-10 h-80 w-80 rounded-full bg-accent-soft blur-3xl"
      />
      <div className="hero-in mx-auto max-w-7xl px-4 pb-12 pt-14 sm:px-6 sm:pb-16 sm:pt-20">
        {eyebrow ? (
          <p className="mb-4 inline-flex items-center gap-2 rounded-full border border-border bg-surface px-3 py-1 text-xs font-medium text-muted">
            <span className="h-1.5 w-1.5 rounded-full bg-accent" />
            {eyebrow}
          </p>
        ) : null}
        <h1 className="text-balance text-4xl font-semibold leading-[1.1] tracking-tight text-text sm:text-6xl">
          {title}
        </h1>
        {text ? (
          <p className="mt-5 max-w-2xl text-lg leading-relaxed text-muted">
            {text}
          </p>
        ) : null}
        {children ? <div className="mt-8">{children}</div> : null}
      </div>
    </header>
  );
}
