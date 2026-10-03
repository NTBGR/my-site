"use client";

import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import CategoryArt from "@/components/CategoryArt";
import { useT } from "@/components/LangProvider";
import ArrowButton from "@/components/ui/ArrowButton";

export type CarouselSlide = {
  slug: string;
  name: string;
  description: string;
  color: string;
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
      if (s > 0) setActive(Math.min(slides.length - 1, Math.round(track.scrollLeft / s)));
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
        className="-mx-4 flex snap-x snap-mandatory scroll-px-4 gap-4 overflow-x-auto px-4 pb-2 [scrollbar-width:none] sm:mx-0 sm:scroll-px-0 sm:px-0 [&::-webkit-scrollbar]:hidden"
      >
        {slides.map((slide) => (
          <li
            key={slide.slug}
            className="w-[82%] shrink-0 snap-start sm:w-[46%] lg:w-[31.5%]"
          >
            <Link
              href={`/categories/${slide.slug}`}
              className="group relative block overflow-hidden rounded-[1.75rem] transition duration-300 hover:-translate-y-1.5 hover:shadow-2xl active:scale-[0.99]"
            >
              <CategoryArt
                slug={slide.slug}
                color={slide.color}
                className="aspect-[4/5] w-full sm:aspect-[4/3]"
              />
              <div
                aria-hidden
                className="absolute inset-0 z-10 bg-gradient-to-t from-black/65 via-black/5 to-transparent"
              />
              <div className="absolute inset-x-0 bottom-0 z-20 p-5 text-white sm:p-6">
                <h3 className="text-xl font-semibold leading-tight tracking-tight sm:text-2xl">
                  {slide.name}
                </h3>
                <p className="mt-1.5 hidden max-w-xs text-sm text-white/80 sm:block">
                  {slide.description}
                </p>
                <span className="mt-4 inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-sm font-medium text-black transition duration-300 group-hover:bg-accent group-hover:text-on-accent">
                  {t.browse}
                  <span className="arrow-slide" aria-hidden>
                    →
                  </span>
                </span>
              </div>
            </Link>
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
        <div className="flex gap-2">
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
