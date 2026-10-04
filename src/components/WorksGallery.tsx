"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import ArtTile from "@/components/ArtTile";
import { useT } from "@/components/LangProvider";
import ArrowButton from "@/components/ui/ArrowButton";

export type GalleryWork = {
  title: string;
  color: string;
  variant: number;
  url?: string;
  // ნამდვილი ფოტო (public საქაღალდიდან) და მისი ზომები; თუ არ არის, ჩანს ადგილმჭერი
  image?: string;
  width?: number;
  height?: number;
};

const FALLBACK_RATIO = 3 / 4;

function ratioOf(work: GalleryWork) {
  return work.width && work.height ? work.width / work.height : FALLBACK_RATIO;
}

export default function WorksGallery({ works }: { works: GalleryWork[] }) {
  const t = useT();
  const [open, setOpen] = useState<number | null>(null);
  const [mounted, setMounted] = useState(false);
  const touchX = useRef<number | null>(null);

  useEffect(() => setMounted(true), []);

  const close = useCallback(() => setOpen(null), []);
  const step = useCallback(
    (direction: 1 | -1) =>
      setOpen((current) =>
        current === null ? null : (current + direction + works.length) % works.length,
      ),
    [works.length],
  );

  useEffect(() => {
    if (open === null) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") close();
      if (event.key === "ArrowRight") step(1);
      if (event.key === "ArrowLeft") step(-1);
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = previous;
      window.removeEventListener("keydown", onKey);
    };
  }, [open, close, step]);

  const current = open === null ? null : works[open];

  return (
    <>
      {/* ერთნაირი 3:4 ბარათები (ტელეფონის ფოტოს ფორმატი); სრული ფოტო იხსნება დაჭერით */}
      <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-4 xl:grid-cols-5">
        {works.map((work, i) => (
          <li key={`${work.title}-${i}`}>
            <button
              type="button"
              onClick={() => setOpen(i)}
              aria-label={work.title}
              className="group relative block aspect-[3/4] w-full overflow-hidden rounded-[1.25rem] bg-surface text-left shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-2xl sm:rounded-[1.75rem]"
            >
              {work.image ? (
                <Image
                  src={work.image}
                  alt={work.title}
                  fill
                  sizes="(min-width: 1280px) 240px, (min-width: 1024px) 290px, (min-width: 640px) 33vw, 50vw"
                  className="object-cover transition duration-500 group-hover:scale-[1.04]"
                />
              ) : (
                <ArtTile
                  color={work.color}
                  variant={work.variant}
                  className="absolute inset-0 h-full w-full"
                />
              )}
              <div
                aria-hidden
                className="absolute inset-0 bg-gradient-to-t from-black/55 via-transparent to-transparent opacity-90 transition-opacity duration-300 group-hover:opacity-100"
              />
              <span className="absolute inset-x-0 bottom-0 p-3 text-sm font-semibold tracking-tight text-white sm:p-4 sm:text-base">
                {work.title}
              </span>
            </button>
          </li>
        ))}
      </ul>

      {/* სრულეკრანიანი ნახვა: პორტალით body-ში, რომ გვერდის ანიმაცია (transform) პოზიციას არ ცვლიდეს */}
      {current && mounted
        ? createPortal(
            <div
              role="dialog"
              aria-modal="true"
              aria-label={current.title}
              className="fixed inset-0 z-[100] flex flex-col bg-black/90 text-white backdrop-blur-sm"
              onClick={close}
              onTouchStart={(event) => {
                touchX.current = event.touches[0].clientX;
              }}
              onTouchEnd={(event) => {
                if (touchX.current === null) return;
                const dx = event.changedTouches[0].clientX - touchX.current;
                touchX.current = null;
                // გასმა: ფურცვლა და არა დახურვა
                if (Math.abs(dx) > 50 && works.length > 1) {
                  event.preventDefault();
                  step(dx < 0 ? 1 : -1);
                }
              }}
            >
              {/* ზედა ზოლი: მრიცხველი და დახურვა */}
              <div
                className="flex shrink-0 items-center justify-between px-4 pb-2 pt-[max(1rem,env(safe-area-inset-top))] sm:px-6"
                onClick={(event) => event.stopPropagation()}
              >
                <span className="text-sm font-medium text-white/70 tabular-nums">
                  {open! + 1} / {works.length}
                </span>
                <button
                  type="button"
                  onClick={close}
                  aria-label={t.artist.close}
                  className="flex h-11 w-11 items-center justify-center rounded-full border border-white/25 bg-white/10 backdrop-blur-md transition hover:bg-white hover:text-black"
                >
                  <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" aria-hidden>
                    <path d="M6 6l12 12M18 6 6 18" />
                  </svg>
                </button>
              </div>

              {/* სურათი: ყოველთვის მთლიანად ეტევა ეკრანზე */}
              <div className="relative flex min-h-0 flex-1 items-center justify-center px-4 sm:px-20">
                <div
                  className="flex h-full w-full items-center justify-center"
                  onClick={(event) => {
                    if (event.target !== event.currentTarget) event.stopPropagation();
                  }}
                >
                  {current.image ? (
                    <Image
                      key={current.image}
                      src={current.image}
                      alt={current.title}
                      width={current.width ?? 1000}
                      height={current.height ?? 1250}
                      sizes="(min-width: 1024px) 70vw, 95vw"
                      className="h-auto max-h-full w-auto max-w-full rounded-2xl object-contain shadow-2xl"
                      priority
                    />
                  ) : (
                    <div
                      className="max-h-full max-w-full overflow-hidden rounded-2xl shadow-2xl"
                      style={{ aspectRatio: ratioOf(current), height: "100%" }}
                    >
                      <ArtTile color={current.color} variant={current.variant} className="h-full w-full" />
                    </div>
                  )}
                </div>

                {works.length > 1 ? (
                  <div onClick={(event) => event.stopPropagation()}>
                    <ArrowButton
                      direction="prev"
                      variant="glass"
                      label={t.home.prev}
                      onClick={() => step(-1)}
                      className="absolute left-6 top-1/2 hidden -translate-y-1/2 sm:flex"
                    />
                    <ArrowButton
                      direction="next"
                      variant="glass"
                      label={t.home.next}
                      onClick={() => step(1)}
                      className="absolute right-6 top-1/2 hidden -translate-y-1/2 sm:flex"
                    />
                  </div>
                ) : null}
              </div>

              {/* ქვედა ზოლი: სახელი, ყიდვის ღილაკი, მობილურზე ისრები */}
              <div
                className="flex shrink-0 flex-wrap items-center justify-center gap-3 px-4 pb-[max(1.25rem,env(safe-area-inset-bottom))] pt-4"
                onClick={(event) => event.stopPropagation()}
              >
                {works.length > 1 ? (
                  <ArrowButton direction="prev" variant="glass" size="sm" label={t.home.prev} onClick={() => step(-1)} className="sm:hidden" />
                ) : null}
                <p className="min-w-0 text-center text-base font-semibold tracking-tight sm:text-lg">{current.title}</p>
                {works.length > 1 ? (
                  <ArrowButton direction="next" variant="glass" size="sm" label={t.home.next} onClick={() => step(1)} className="sm:hidden" />
                ) : null}
                {current.url ? (
                  <a
                    href={current.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex min-h-11 w-full items-center justify-center gap-1.5 rounded-full bg-white px-5 text-sm font-medium text-black transition hover:-translate-y-0.5 hover:shadow-xl sm:w-auto"
                  >
                    {t.artist.openWork} ↗
                  </a>
                ) : null}
              </div>
            </div>,
            document.body,
          )
        : null}
    </>
  );
}
