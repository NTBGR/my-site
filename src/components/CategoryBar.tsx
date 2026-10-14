"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import { useLang, useT } from "@/components/LangProvider";
import ArrowButton from "@/components/ui/ArrowButton";
import { categories, localizeCategory } from "@/data/categories";

export type BarTag = { slug: string; name: string; emoji: string };

// ჰედერის ქვეშ ზოლი: მარცხნივ „კატეგორიები“ (ჩამოსაშლელი, ყველა კატეგორიით), გვერდით საჩუქრის თაგები
export default function CategoryBar({ tags }: { tags: BarTag[] }) {
  const t = useT();
  const lang = useLang();
  const pathname = usePathname();
  const listRef = useRef<HTMLUListElement | null>(null);
  const menuRef = useRef<HTMLDivElement | null>(null);
  const [canLeft, setCanLeft] = useState(false);
  const [canRight, setCanRight] = useState(false);
  const [open, setOpen] = useState(false);

  const update = useCallback(() => {
    const el = listRef.current;
    if (!el) return;
    setCanLeft(el.scrollLeft > 4);
    setCanRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 4);
  }, []);

  useEffect(() => {
    const el = listRef.current;
    if (!el) return;
    update();
    el.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      el.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, [update, lang]);

  // გვერდის შეცვლისას ჩამოსაშლელი იხურება
  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  // გარეთ დაჭერით ან Esc-ით იხურება
  useEffect(() => {
    if (!open) return;
    const onPointer = (event: PointerEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) setOpen(false);
    };
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    document.addEventListener("pointerdown", onPointer);
    window.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("pointerdown", onPointer);
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  // გვერდის შეცვლისას ზოლი მხოლოდ იმდენს გადაინაცვლებს, რომ აქტიური თაგი ხილვად არეში მოხვდეს
  const lastPath = useRef(pathname);
  useEffect(() => {
    if (lastPath.current === pathname) return;
    lastPath.current = pathname;
    const list = listRef.current;
    const active = list?.querySelector<HTMLElement>('[aria-current="page"]');
    if (!list || !active) return;
    const listBox = list.getBoundingClientRect();
    const box = active.getBoundingClientRect();
    const left = box.left - listBox.left + list.scrollLeft;
    const right = left + box.width;
    const pad = 24;
    if (left < list.scrollLeft) {
      list.scrollTo({ left: Math.max(0, left - pad), behavior: "smooth" });
    } else if (right > list.scrollLeft + list.clientWidth) {
      list.scrollTo({ left: right - list.clientWidth + pad, behavior: "smooth" });
    }
  }, [pathname]);

  function scrollBy(direction: 1 | -1) {
    const el = listRef.current;
    if (!el) return;
    el.scrollBy({ left: direction * el.clientWidth * 0.7, behavior: "smooth" });
  }

  const onCategoryPage = pathname === "/categories" || pathname.startsWith("/categories/");

  return (
    <nav aria-label={t.nav.categories} className="relative z-30 hidden border-b border-border bg-bg sm:block">
      <div className="mx-auto flex max-w-7xl items-center">
        <div ref={menuRef} className="shrink-0 border-r border-border pl-4 pr-3 sm:pl-6 lg:pl-10">
          <button
            type="button"
            aria-expanded={open}
            aria-haspopup="true"
            onClick={() => setOpen((value) => !value)}
            className={`inline-flex min-h-10 items-center gap-2 whitespace-nowrap rounded-full px-4 text-sm font-medium transition-colors ${
              open || onCategoryPage ? "bg-accent text-on-accent" : "bg-accent-soft text-accent hover:bg-accent hover:text-on-accent"
            }`}
          >
            <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
              <rect x="4" y="4" width="6.5" height="6.5" rx="1.5" />
              <rect x="13.5" y="4" width="6.5" height="6.5" rx="1.5" />
              <rect x="4" y="13.5" width="6.5" height="6.5" rx="1.5" />
              <rect x="13.5" y="13.5" width="6.5" height="6.5" rx="1.5" />
            </svg>
            {t.nav.categories}
            <svg viewBox="0 0 24 24" className={`h-3.5 w-3.5 transition-transform ${open ? "rotate-180" : ""}`} fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
              <path d="m6 9 6 6 6-6" />
            </svg>
          </button>

          {open ? (
            <div className="absolute left-4 top-full z-30 mt-1 w-[min(22rem,calc(100vw-2rem))] rounded-2xl border border-border bg-bg p-2 shadow-2xl sm:left-6 lg:left-10">
              <Link
                href="/categories"
                aria-current={pathname === "/categories" ? "page" : undefined}
                className="flex min-h-11 items-center rounded-xl px-3 text-sm font-semibold text-accent transition-colors hover:bg-accent-soft"
              >
                {t.home.allCategories} →
              </Link>
              <ul className="mt-1 border-t border-border pt-1">
                {categories.map((raw) => {
                  const category = localizeCategory(raw, lang);
                  const active = pathname === `/categories/${category.slug}`;
                  return (
                    <li key={category.slug}>
                      <Link
                        href={`/categories/${category.slug}`}
                        aria-current={active ? "page" : undefined}
                        className={`flex min-h-11 items-center rounded-xl px-3 text-sm font-medium transition-colors ${
                          active ? "bg-accent-soft text-accent" : "text-text hover:bg-accent-soft hover:text-accent"
                        }`}
                      >
                        {category.name}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>
          ) : null}
        </div>

        <div className="relative min-w-0 flex-1">
          {canLeft ? (
            <ArrowButton
              direction="prev"
              size="sm"
              label={t.home.prev}
              onClick={() => scrollBy(-1)}
              className="absolute left-1 top-1/2 z-10 hidden -translate-y-1/2 sm:flex"
            />
          ) : null}
          {canRight ? (
            <ArrowButton
              direction="next"
              size="sm"
              label={t.home.next}
              onClick={() => scrollBy(1)}
              className="absolute right-3 top-1/2 z-10 hidden -translate-y-1/2 sm:flex lg:right-6"
            />
          ) : null}

          <ul
            ref={listRef}
            className="flex gap-1.5 overflow-x-auto py-2.5 pl-2 pr-4 [scrollbar-width:none] sm:pr-6 lg:pr-10 [&::-webkit-scrollbar]:hidden"
            style={{
              maskImage: `linear-gradient(90deg, ${canLeft ? "transparent, #000 40px" : "#000, #000"}, ${canRight ? "#000 calc(100% - 56px), transparent" : "#000, #000"})`,
            }}
          >
            {tags.map((tag) => {
              const active = pathname === `/gifts/${tag.slug}`;
              return (
                <li key={tag.slug} className="shrink-0">
                  <Link
                    href={`/gifts/${tag.slug}`}
                    aria-current={active ? "page" : undefined}
                    className={`inline-flex min-h-10 items-center whitespace-nowrap rounded-full px-4 text-sm font-medium transition-colors ${
                      active ? "bg-accent text-on-accent" : "text-muted hover:bg-accent-soft hover:text-accent"
                    }`}
                  >
                    <span aria-hidden className="mr-1.5">{tag.emoji}</span>
                    {tag.name}
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </nav>
  );
}
