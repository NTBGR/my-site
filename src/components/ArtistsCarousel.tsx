"use client";

import { Children, useCallback, useEffect, useRef, useState, type ReactNode } from "react";
import { useT } from "@/components/LangProvider";
import ArrowButton from "@/components/ui/ArrowButton";

const GAP = 16;

// ხელოვანების ბარათები: მობილურზე გადასაფურცლი (ისრები და წერტილები), დიდ ეკრანზე ბადე
export default function ArtistsCarousel({ children }: { children: ReactNode }) {
  const t = useT().home;
  const items = Children.toArray(children);
  const trackRef = useRef<HTMLUListElement | null>(null);
  const [active, setActive] = useState(0);

  const step = useCallback(() => {
    const first = trackRef.current?.children[0] as HTMLElement | undefined;
    return first ? first.getBoundingClientRect().width + GAP : 0;
  }, []);

  const goTo = useCallback(
    (index: number) => {
      const track = trackRef.current;
      if (!track) return;
      const next = Math.min(items.length - 1, Math.max(0, index));
      track.scrollTo({ left: next * step(), behavior: "smooth" });
    },
    [items.length, step],
  );

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    const onScroll = () => {
      const s = step();
      if (s <= 0) return;
      // ბოლო ბარათი სქროლის ბოლოს თავში ვერ დგება, ამიტომ ბოლოს ბოლო წერტილი გავანათოთ
      const atEnd = track.scrollLeft + track.clientWidth >= track.scrollWidth - 4;
      setActive(atEnd ? items.length - 1 : Math.min(items.length - 1, Math.round(track.scrollLeft / s)));
    };
    track.addEventListener("scroll", onScroll, { passive: true });
    return () => track.removeEventListener("scroll", onScroll);
  }, [items.length, step]);

  return (
    <div>
      <ul
        ref={trackRef}
        className="-mx-4 flex snap-x snap-mandatory scroll-px-4 gap-4 overflow-x-auto px-4 pb-2 [scrollbar-width:none] sm:mx-0 sm:grid sm:grid-cols-2 sm:gap-5 sm:overflow-visible sm:px-0 sm:pb-0 lg:grid-cols-3 [&::-webkit-scrollbar]:hidden"
      >
        {items.map((item, i) => (
          <li key={i} className="w-[78%] shrink-0 snap-start sm:w-auto">
            {item}
          </li>
        ))}
      </ul>

      <div className="mt-5 flex items-center justify-between gap-4 sm:hidden">
        <div className="flex items-center gap-1.5" role="tablist">
          {items.map((_, i) => (
            <button
              key={i}
              type="button"
              role="tab"
              aria-selected={i === active}
              aria-label={String(i + 1)}
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
          <ArrowButton direction="prev" label={t.prev} onClick={() => goTo(active - 1)} />
          <ArrowButton direction="next" label={t.next} onClick={() => goTo(active + 1)} />
        </div>
      </div>
    </div>
  );
}
