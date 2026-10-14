"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { useT } from "@/components/LangProvider";

export type MenuCategory = { label: string; href: string };

// „კატეგორიები“ ღილაკი ჰედერში (ეთსის მსგავსად): იხსნება სია ყველა კატეგორიით
export default function CategoriesMenu({ items }: { items: MenuCategory[] }) {
  const t = useT();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!open) return;
    const onDown = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) setOpen(false);
    };
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    document.addEventListener("mousedown", onDown);
    window.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDown);
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <div ref={ref} className="relative hidden shrink-0 lg:block">
      <button
        type="button"
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
        className="inline-flex min-h-11 items-center gap-2 rounded-full px-4 text-sm font-semibold text-text transition-colors hover:bg-accent-soft"
      >
        <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" aria-hidden>
          <path d="M4 7h16M4 12h16M4 17h16" />
        </svg>
        {t.ui.navCategories}
      </button>
      {open ? (
        <div className="menu-enter absolute left-0 top-full z-50 mt-2 w-72 rounded-2xl border border-border bg-bg p-2 shadow-2xl">
          <ul>
            {items.map((item) => (
              <li key={item.href}>
                <Link href={item.href} onClick={() => setOpen(false)} className="flex min-h-11 items-center rounded-xl px-3 text-sm text-text hover:bg-accent-soft hover:text-accent">
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
          <Link href="/categories" onClick={() => setOpen(false)} className="mt-1 flex min-h-11 items-center rounded-xl px-3 text-sm font-medium text-accent hover:bg-accent-soft">
            {t.categories.title} →
          </Link>
        </div>
      ) : null}
    </div>
  );
}
