"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import { useLang, useT } from "@/components/LangProvider";
import ArrowButton from "@/components/ui/ArrowButton";
import ComingSoonCountdown from "@/components/ComingSoonCountdown";
import { useDragScroll } from "@/lib/useDragScroll";

export type BarTag = { slug: string; name: string; emoji: string; opensAtMs?: number };

// ჰედერის ქვეშ ზოლი: საჩუქრის თაგები (ფასდაკლებები, 100 ₾-მდე...) და ბოლოს საჩუქრის შერჩევა.
// მარცხენა დაშორება ჩიპის შიდა დაშორებით (px-4) შემცირებულია: პირველი ჩიპის ტექსტი ლოგოსთან ერთ ხაზზე დგას
export default function CategoryBar({ tags }: { tags: BarTag[] }) {
  const t = useT();
  const lang = useLang();
  const pathname = usePathname();
  const listRef = useRef<HTMLUListElement | null>(null);
  const [canLeft, setCanLeft] = useState(false);
  const [canRight, setCanRight] = useState(false);
  useDragScroll(listRef);

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

  // გვერდის შეცვლისას ზოლი მხოლოდ იმდენს გადაინაცვლებს, რომ აქტიური თაგი ხილვად არეში მოხვდეს
  const lastPath = useRef(pathname);
  useEffect(() => {
    if (lastPath.current === pathname) return;
    lastPath.current = pathname;
    const list = listRef.current;
    const active = list?.querySelector<HTMLElement>('[aria-current="page"]');
    if (!list) return;
    // თაგის გარეშე გვერდზე გადასვლისას ზოლი თავიდან იწყება (და არა იქ, სადაც გადაახვიე)
    if (!active) {
      list.scrollTo({ left: 0, behavior: "instant" });
      return;
    }
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

  return (
    <nav aria-label={t.nav.categories} className="relative z-30 border-b border-border bg-bg">
      <div className="mx-auto flex max-w-7xl items-center">
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
              className="absolute right-2 top-1/2 z-10 hidden -translate-y-1/2 sm:right-3 sm:flex lg:right-6"
            />
          ) : null}

          <ul
            ref={listRef}
            className="flex gap-1.5 overflow-x-auto py-2.5 pl-0 pr-12 [scrollbar-width:none] sm:pl-2 sm:pr-6 lg:pl-6 lg:pr-10 [&::-webkit-scrollbar]:hidden"
            style={{
              maskImage: `linear-gradient(90deg, ${canLeft ? "transparent, #000 40px" : "#000, #000"}, ${canRight ? "#000 calc(100% - 56px), transparent" : "#000, #000"})`,
            }}
          >
            {tags.map((tag) => {
              const active = pathname === `/gifts/${tag.slug}`;
              if (tag.opensAtMs) {
                return (
                  <li key={tag.slug} className="shrink-0">
                    <span
                      aria-disabled="true"
                      title={tag.name}
                      className="inline-flex min-h-10 cursor-not-allowed select-none items-center whitespace-nowrap rounded-full border border-dashed border-border px-4 text-sm font-medium text-muted/70"
                    >
                      <span aria-hidden className="mr-1.5 opacity-70 grayscale">{tag.emoji}</span>
                      {tag.name}
                      <span className="ml-2 rounded-full bg-accent-soft px-2 py-0.5 text-xs font-semibold text-accent tabular-nums">
                        <ComingSoonCountdown opensAtMs={tag.opensAtMs} />
                      </span>
                    </span>
                  </li>
                );
              }
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
            {/* საჩუქრის შერჩევა ბოლოშია: ფასდაკლებები და ფასის თაგები პირველია */}
            <li className="shrink-0">
              <Link
                href="/quiz"
                aria-current={pathname === "/quiz" ? "page" : undefined}
                className={`inline-flex min-h-10 items-center whitespace-nowrap rounded-full px-4 text-sm font-medium transition-colors ${
                  pathname === "/quiz" ? "bg-accent text-on-accent" : "text-muted hover:bg-accent-soft hover:text-accent"
                }`}
              >
                <span aria-hidden className="mr-1.5">🎯</span>
                {t.quiz.title}
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
}
