"use client";

import { useCallback, useEffect, useRef, useState, type ReactNode } from "react";
import { useT } from "@/components/LangProvider";
import ArrowButton from "@/components/ui/ArrowButton";

export type BannerSlide = {
  id: string;
  color: string;
  art: ReactNode;
  content: ReactNode;
};

const AUTOPLAY_MS = 6000;

// სლაიდერი მშობლიურ გადაფურცვლაზეა აგებული (scroll-snap): ტელეფონზე სლაიდი
// თითს მიჰყვება და ბოლოს გლუვად ჯდება ადგილზე
export default function HeroBanner({ slides }: { slides: BannerSlide[] }) {
  const t = useT().home;
  const trackRef = useRef<HTMLDivElement | null>(null);
  const activeRef = useRef(0);
  const pausedRef = useRef(false);
  const resumeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [active, setActive] = useState(0);

  const goTo = useCallback(
    (index: number) => {
      const track = trackRef.current;
      if (!track) return;
      const next = (index + slides.length) % slides.length;
      track.scrollTo({ left: next * track.clientWidth, behavior: "smooth" });
    },
    [slides.length],
  );

  // აქტიური წერტილი სქროლის მიხედვით
  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    const onScroll = () => {
      const width = track.clientWidth;
      if (width <= 0) return;
      const index = Math.min(
        slides.length - 1,
        Math.max(0, Math.round(track.scrollLeft / width)),
      );
      activeRef.current = index;
      setActive(index);
    };
    track.addEventListener("scroll", onScroll, { passive: true });
    return () => track.removeEventListener("scroll", onScroll);
  }, [slides.length]);

  // ავტომატური გადასვლა (პაუზა ჰოვერზე/შეხებაზე, არ ირთვება თუ ანიმაცია გამორთულია)
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const id = setInterval(() => {
      if (pausedRef.current || document.hidden) return;
      goTo(activeRef.current + 1);
    }, AUTOPLAY_MS);
    return () => clearInterval(id);
  }, [goTo]);

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
      className="relative overflow-hidden rounded-[1.25rem] rounded-br-[2.75rem] rounded-tl-[2.75rem] text-white shadow-xl lg:rounded-[1.5rem] lg:rounded-br-[4rem] lg:rounded-tl-[4rem]"
      onMouseEnter={pause}
      onMouseLeave={() => resume()}
      onFocus={pause}
      onBlur={() => resume()}
      onTouchStart={pause}
      onTouchEnd={() => resume(8000)}
      role="region"
      aria-roledescription="carousel"
      aria-label={t.badge}
    >
      <div
        ref={trackRef}
        className="flex snap-x snap-mandatory overflow-x-auto overscroll-x-contain [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {slides.map((slide, i) => (
          <div
            key={slide.id}
            aria-hidden={i !== active}
            className="relative min-h-[17.5rem] w-full shrink-0 snap-center snap-always sm:min-h-[22rem] lg:min-h-[28rem]"
          >
            <div
              className="absolute inset-0"
              style={{
                background: `linear-gradient(135deg, color-mix(in srgb, ${slide.color}, white 14%), ${slide.color} 55%, color-mix(in srgb, ${slide.color}, black 18%))`,
              }}
            />
            <div className="absolute inset-0 lg:left-auto lg:right-0 lg:w-[56%] lg:[mask-image:linear-gradient(90deg,transparent,#000_24%)]">
              {slide.art}
            </div>
            <div
              aria-hidden
              className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/15 to-transparent lg:bg-gradient-to-r lg:from-black/35 lg:via-transparent lg:to-transparent"
            />
            <div className="absolute inset-x-0 bottom-0 z-10 p-6 pb-[4.75rem] sm:p-10 sm:pb-20 sm:pl-20 lg:inset-y-0 lg:flex lg:w-[64%] lg:flex-col lg:justify-center lg:p-10 lg:pb-20 lg:pl-20">
              {slide.content}
            </div>
          </div>
        ))}
      </div>

      <div className="pointer-events-none absolute bottom-5 left-6 right-6 z-20 flex items-center sm:left-10 sm:right-10 lg:left-20 lg:right-20">
        <div className="pointer-events-auto flex items-center gap-1.5" role="tablist">
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
      </div>

      {/* ისრები გვერდებზე, შუაში (ტელეფონზე გადაფურცვლა საკმარისია) */}
      <div className="pointer-events-none absolute inset-y-0 left-3 z-20 hidden items-center sm:flex lg:left-5">
        <ArrowButton
          direction="prev"
          variant="glass"
          label={t.prev}
          className="pointer-events-auto"
          onClick={() => goTo(active - 1)}
        />
      </div>
      <div className="pointer-events-none absolute inset-y-0 right-3 z-20 hidden items-center sm:flex lg:right-5">
        <ArrowButton
          direction="next"
          variant="glass"
          label={t.next}
          className="pointer-events-auto"
          onClick={() => goTo(active + 1)}
        />
      </div>
    </div>
  );
}
