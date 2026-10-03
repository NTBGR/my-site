"use client";

import { useCallback, useEffect, useRef, useState, type ReactNode } from "react";
import { useT } from "@/components/LangProvider";

export type BannerSlide = {
  id: string;
  color: string;
  art: ReactNode;
  content: ReactNode;
};

const AUTOPLAY_MS = 6000;

export default function HeroBanner({ slides }: { slides: BannerSlide[] }) {
  const t = useT().home;
  const [active, setActive] = useState(0);
  const pausedRef = useRef(false);
  const resumeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const goTo = useCallback(
    (index: number) => setActive((index + slides.length) % slides.length),
    [slides.length],
  );

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const id = setInterval(() => {
      if (pausedRef.current || document.hidden) return;
      setActive((a) => (a + 1) % slides.length);
    }, AUTOPLAY_MS);
    return () => clearInterval(id);
  }, [slides.length]);

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

  // მობილურზე მარცხნივ/მარჯვნივ გადაფურცვლა
  const touchStart = useRef<number | null>(null);

  return (
    <div
      className="relative min-h-[24rem] overflow-hidden rounded-[2rem] text-white shadow-xl sm:min-h-[28rem] lg:min-h-[25rem] lg:rounded-[2.5rem]"
      style={{ background: slides[active].color, transition: "background 0.8s ease" }}
      onMouseEnter={pause}
      onMouseLeave={() => resume()}
      onFocus={pause}
      onBlur={() => resume()}
      onTouchStart={(e) => {
        pause();
        touchStart.current = e.touches[0].clientX;
      }}
      onTouchEnd={(e) => {
        const start = touchStart.current;
        if (start !== null) {
          const dx = e.changedTouches[0].clientX - start;
          if (Math.abs(dx) > 50) goTo(active + (dx < 0 ? 1 : -1));
        }
        touchStart.current = null;
        resume(8000);
      }}
      role="region"
      aria-roledescription="carousel"
      aria-label={t.badge}
    >
      {slides.map((slide, i) => {
        const isActive = i === active;
        return (
          <div
            key={slide.id}
            aria-hidden={!isActive}
            className={`absolute inset-0 transition-all duration-700 ease-out ${
              isActive
                ? "visible translate-x-0 opacity-100"
                : "invisible translate-x-6 opacity-0"
            }`}
          >
            <div
              className="absolute inset-0"
              style={{
                background: `linear-gradient(135deg, color-mix(in srgb, ${slide.color}, white 14%), ${slide.color} 55%, color-mix(in srgb, ${slide.color}, black 34%))`,
              }}
            />
            <div className="absolute inset-0 lg:left-auto lg:right-0 lg:w-[56%] lg:[mask-image:linear-gradient(90deg,transparent,#000_24%)]">
              {slide.art}
            </div>
            <div
              aria-hidden
              className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-black/10 lg:bg-gradient-to-r lg:from-black/45 lg:via-transparent lg:to-transparent"
            />
            <div className="absolute inset-x-0 bottom-0 z-10 p-6 pb-16 sm:p-10 sm:pb-20 lg:inset-y-0 lg:flex lg:w-[54%] lg:flex-col lg:justify-center lg:p-12 lg:pb-16">
              {slide.content}
            </div>
          </div>
        );
      })}

      <div className="absolute bottom-5 left-6 right-6 z-20 flex items-center justify-between gap-4 sm:left-10 sm:right-10 lg:left-14 lg:right-14">
        <div className="flex items-center gap-1.5" role="tablist">
          {slides.map((slide, i) => (
            <button
              key={slide.id}
              type="button"
              role="tab"
              aria-selected={i === active}
              aria-label={`${i + 1} / ${slides.length}`}
              onClick={() => goTo(i)}
              className="flex h-8 items-center px-0.5"
            >
              <span
                className={`block h-1.5 rounded-full transition-all duration-500 ${
                  i === active ? "w-8 bg-white" : "w-1.5 bg-white/45"
                }`}
              />
            </button>
          ))}
        </div>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => goTo(active - 1)}
            aria-label={t.prev}
            className="flex h-11 w-11 items-center justify-center rounded-full bg-white/15 backdrop-blur-md transition hover:bg-white hover:text-black active:scale-90"
          >
            ←
          </button>
          <button
            type="button"
            onClick={() => goTo(active + 1)}
            aria-label={t.next}
            className="flex h-11 w-11 items-center justify-center rounded-full bg-white/15 backdrop-blur-md transition hover:bg-white hover:text-black active:scale-90"
          >
            →
          </button>
        </div>
      </div>
    </div>
  );
}
