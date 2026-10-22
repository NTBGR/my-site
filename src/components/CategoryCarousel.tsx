"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import CategoryCard from "@/components/CategoryCard";
import { useT } from "@/components/LangProvider";
import ArrowButton from "@/components/ui/ArrowButton";
import { useDragScroll } from "@/lib/useDragScroll";

export type CarouselSlide = {
  slug: string;
  name: string;
  description: string;
  color: string;
  // ბარათის კუთხეში: რამდენი ხელოვანია ამ კატეგორიაში (ცარიელ კატეგორიაზე არ ჩანს)
  count?: string;
  // ცარიელ კატეგორიაზე რაოდენობის ნაცვლად („მალე“)
  soon?: string;
};

const GAP = 16;
const AUTOPLAY_MS = 4500;

export default function CategoryCarousel({
  slides,
  autoplay = true,
}: {
  slides: CarouselSlide[];
  autoplay?: boolean;
}) {
  const t = useT().home;
  const trackRef = useRef<HTMLUListElement | null>(null);
  const pausedRef = useRef(false);
  const resumeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [active, setActive] = useState(0);
  useDragScroll(trackRef);

  const step = useCallback(() => {
    const first = trackRef.current?.children[0] as HTMLElement | undefined;
    return first ? first.getBoundingClientRect().width + GAP : 0;
  }, []);

  const goTo = useCallback(
    (index: number) => {
      const track = trackRef.current;
      if (!track) return;
      const next = (index + slides.length) % slides.length;
      track.scrollTo({ left: next * step(), behavior: "smooth" });
    },
    [slides.length, step],
  );

  // აქტიური წერტილი სქროლის მიხედვით
  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    const onScroll = () => {
      const s = step();
      if (s <= 0) return;
      // ბოლო ბარათი სქროლის ბოლოს თავში ვერ დგება, ამიტომ ბოლოს ბოლო წერტილი გავანათოთ
      const atEnd = track.scrollLeft + track.clientWidth >= track.scrollWidth - 4;
      setActive(atEnd ? slides.length - 1 : Math.min(slides.length - 1, Math.round(track.scrollLeft / s)));
    };
    track.addEventListener("scroll", onScroll, { passive: true });
    return () => track.removeEventListener("scroll", onScroll);
  }, [slides.length, step]);

  // ავტომატური გადასვლა (პაუზა ჰოვერზე/შეხებაზე, არ ირთვება თუ ანიმაცია გამორთულია)
  useEffect(() => {
    if (!autoplay) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const id = setInterval(() => {
      const track = trackRef.current;
      if (!track || pausedRef.current || document.hidden) return;
      const s = step();
      if (s <= 0) return;
      const current = Math.round(track.scrollLeft / s);
      const atEnd = track.scrollLeft + track.clientWidth >= track.scrollWidth - 4;
      track.scrollTo({
        left: atEnd ? 0 : (current + 1) * s,
        behavior: "smooth",
      });
    }, AUTOPLAY_MS);
    return () => clearInterval(id);
  }, [step, autoplay]);

  const pause = () => {
    pausedRef.current = true;
    if (resumeTimer.current) clearTimeout(resumeTimer.current);
  };
  const resume = (delay = 0) => {
    if (resumeTimer.current) clearTimeout(resumeTimer.current);
    resumeTimer.current = setTimeout(() => {
      pausedRef.current = false;
    }, delay);
  };

  return (
    <div
      onMouseEnter={pause}
      onMouseLeave={() => resume()}
      onFocus={pause}
      onBlur={() => resume()}
      onTouchStart={pause}
      onTouchEnd={() => resume(6000)}
    >
      <ul
        ref={trackRef}
        className="-mx-4 flex snap-x snap-mandatory scroll-px-4 gap-4 overflow-x-auto -mt-3 pt-3 -mb-5 px-4 pb-7 [scrollbar-width:none] sm:mx-0 sm:scroll-px-0 sm:px-0 [&::-webkit-scrollbar]:hidden"
      >
        {slides.map((slide) => (
          <li
            key={slide.slug}
            className="w-[58%] shrink-0 snap-start sm:w-[46%] lg:w-[calc((100%-4*1rem)/5)]"
          >
            <CategoryCard
              slug={slide.slug}
              name={slide.name}
              color={slide.color}
              label={`${slide.name} · ${t.browse}`}
              badge={slide.count ?? slide.soon}
              muted={!slide.count}
            />
          </li>
        ))}
      </ul>

      <div className="mt-6 flex items-center justify-between gap-4">
        <div className="flex items-center gap-1.5" role="tablist" aria-label={t.categoriesTitle}>
          {slides.map((slide, i) => (
            <button
              key={slide.slug}
              type="button"
              role="tab"
              aria-selected={i === active}
              aria-label={slide.name}
              onClick={() => goTo(i)}
              className="flex h-6 items-center px-0.5"
            >
              <span
                className={`block h-1.5 rounded-full transition-all duration-300 ${
                  i === active ? "w-6 bg-accent" : "w-1.5 bg-border"
                }`}
              />
            </button>
          ))}
        </div>
        <div className="hidden gap-2 sm:flex">
          <ArrowButton
            direction="prev"
            label={t.prev}
            onClick={() => goTo(active - 1)}
          />
          <ArrowButton
            direction="next"
            label={t.next}
            onClick={() => goTo(active + 1)}
          />
        </div>
      </div>
    </div>
  );
}
