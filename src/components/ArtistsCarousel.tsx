"use client";

import { Children, useCallback, useEffect, useRef, useState, type ReactNode } from "react";
import Link from "next/link";
import { useT } from "@/components/LangProvider";
import ArrowButton from "@/components/ui/ArrowButton";

const GAP = 16;

// ხელოვანების ბარათები: მობილურზე გადასაფურცლი (ისრები და წერტილები) და ბოლოს „ყველა ხელოვანი“ ბარათი,
// დიდ ეკრანზე ბადე (ხუთამდე ბარათი, ერთი რიგი)
export default function ArtistsCarousel({ children }: { children: ReactNode }) {
  const t = useT().home;
  const artistItems = Children.toArray(children);
  // ბოლო „ყველა ხელოვანი“ ბარათი ტელეფონზე ერთ-ერთი გვერდია (წერტილიც აქვს და ისრითაც მიიღწევა)
  const total = artistItems.length + 1;
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
      const next = Math.min(total - 1, Math.max(0, index));
      track.scrollTo({ left: next * step(), behavior: "smooth" });
    },
    [total, step],
  );

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    const onScroll = () => {
      const s = step();
      if (s <= 0) return;
      // ბოლო ბარათი სქროლის ბოლოს თავში ვერ დგება, ამიტომ ბოლოს ბოლო წერტილი გავანათოთ
      const atEnd = track.scrollLeft + track.clientWidth >= track.scrollWidth - 4;
      setActive(atEnd ? total - 1 : Math.min(total - 1, Math.round(track.scrollLeft / s)));
    };
    track.addEventListener("scroll", onScroll, { passive: true });
    return () => track.removeEventListener("scroll", onScroll);
  }, [total, step]);

  return (
    <div>
      <ul
        ref={trackRef}
        className="-mx-4 flex snap-x snap-mandatory scroll-px-4 gap-4 overflow-x-auto -mt-2 pt-2 -mb-5 px-4 pb-7 [scrollbar-width:none] sm:mx-0 sm:mt-0 sm:mb-0 sm:grid sm:grid-cols-2 sm:gap-5 lg:gap-4 sm:overflow-visible sm:px-0 sm:pt-0 sm:pb-0 lg:grid-cols-5 [&::-webkit-scrollbar]:hidden"
      >
        {artistItems.map((item, i) => (
          <li key={i} className="w-[58%] shrink-0 snap-start sm:w-auto lg:[&:nth-child(n+6)]:hidden">
            {item}
          </li>
        ))}
        <li className="w-[58%] shrink-0 snap-start sm:hidden">
          <Link
            href="/artists"
            className="group flex h-full min-h-48 flex-col items-center justify-center gap-3 rounded-[1.5rem] border border-dashed border-border bg-surface p-4 text-center transition duration-300 active:scale-[0.99]"
          >
            <span className="flex h-12 w-12 items-center justify-center rounded-full bg-accent-soft text-xl text-accent" aria-hidden>
              →
            </span>
            <span className="text-base font-semibold leading-snug text-text">{t.fullList}</span>
          </Link>
        </li>
      </ul>

      <div className="mt-5 flex items-center justify-between gap-4 sm:hidden">
        <div className="flex items-center gap-1.5" role="tablist">
          {Array.from({ length: total }, (_, i) => (
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
