"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import { useLang, useT } from "@/components/LangProvider";
import ArrowButton from "@/components/ui/ArrowButton";
import { categories, localizeCategory } from "@/data/categories";

export default function CategoryBar() {
  const t = useT();
  const lang = useLang();
  const pathname = usePathname();
  const listRef = useRef<HTMLUListElement | null>(null);
  const [canLeft, setCanLeft] = useState(false);
  const [canRight, setCanRight] = useState(false);

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

  // ჩატვირთვისას ზოლი თავიდან იწყება; გვერდის შეცვლისას კი მხოლოდ იმდენს
  // გადაინაცვლებს, რომ აქტიური ღილაკი ხილვად არეში მოხვდეს
  const firstRun = useRef(true);
  useEffect(() => {
    if (firstRun.current) {
      firstRun.current = false;
      return;
    }
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

  const allActive = pathname === "/categories";

  return (
    <nav
      aria-label={t.nav.categories}
      className="relative z-10 border-b border-border bg-bg"
    >
      <div className="relative mx-auto max-w-7xl">
        {canLeft ? (
          <ArrowButton
            direction="prev"
            size="sm"
            label={t.home.prev}
            onClick={() => scrollBy(-1)}
            className="absolute left-3 top-1/2 z-10 hidden -translate-y-1/2 sm:flex lg:left-6"
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
          className="flex gap-1.5 overflow-x-auto px-4 py-2.5 [scrollbar-width:none] sm:px-6 lg:px-10 [&::-webkit-scrollbar]:hidden"
          style={{
            maskImage: `linear-gradient(90deg, ${canLeft ? "transparent, #000 56px" : "#000, #000"}, ${canRight ? "#000 calc(100% - 56px), transparent" : "#000, #000"})`,
          }}
        >
          <li className="shrink-0">
            <Link
              href="/categories"
              aria-current={allActive ? "page" : undefined}
              className={`inline-flex min-h-10 items-center whitespace-nowrap rounded-full px-4 text-sm font-semibold transition-colors ${
                allActive
                  ? "bg-accent text-on-accent"
                  : "bg-highlight text-on-highlight hover:bg-accent hover:text-on-accent"
              }`}
            >
              {t.home.allCategories}
            </Link>
          </li>
          {categories.map((raw) => {
            const category = localizeCategory(raw, lang);
            const active = pathname === `/categories/${category.slug}`;
            return (
              <li key={category.slug} className="shrink-0">
                <Link
                  href={`/categories/${category.slug}`}
                  aria-current={active ? "page" : undefined}
                  className={`inline-flex min-h-10 items-center whitespace-nowrap rounded-full px-4 text-sm font-medium transition-colors ${
                    active
                      ? "bg-accent text-on-accent"
                      : "text-muted hover:bg-accent-soft hover:text-accent"
                  }`}
                >
                  {category.name}
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
    </nav>
  );
}
