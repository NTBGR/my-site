"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import ArtTile from "@/components/ArtTile";
import { useT } from "@/components/LangProvider";
import ArrowButton from "@/components/ui/ArrowButton";
import { copyText } from "@/lib/copy";
import { socialVariant } from "@/components/ui/socialStyles";

export type GalleryWork = {
  title: string;
  color: string;
  variant: number;
  url?: string;
  // სად მიდის ბმული: ღილაკის წარწერისთვის
  network?: "instagram" | "facebook";
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
  const [copied, setCopied] = useState(false);
  const touchX = useRef<number | null>(null);

  useEffect(() => setMounted(true), []);
  // სხვა ნამუშევარზე გადასვლისას „დაკოპირდა“ ქრება
  useEffect(() => setCopied(false), [open]);

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
      <ul className="grid grid-cols-2 gap-x-3 gap-y-5 sm:grid-cols-3 sm:gap-x-4 sm:gap-y-6 lg:grid-cols-4 xl:grid-cols-5">
        {works.map((work, i) => (
          <li key={`${work.title}-${i}`}>
            {/* ფოტო ზემოთ, სახელი ქვემოთ: სახელი ნამუშევარს აღარ ფარავს */}
            <button
              type="button"
              onClick={() => setOpen(i)}
              aria-label={work.title}
              className="group block w-full text-left"
            >
              <span className="relative block aspect-[3/4] w-full overflow-hidden rounded-[1.25rem] bg-surface shadow-sm transition duration-300 group-hover:-translate-y-1 group-hover:shadow-2xl sm:rounded-[1.5rem]">
                {work.image ? (
                  <Image
                    src={work.image}
                    alt={work.title}
                    fill
                    sizes="(min-width: 1280px) 240px, (min-width: 1024px) 290px, (min-width: 640px) 33vw, 50vw"
                    className="object-cover transition duration-500 group-hover:scale-[1.04]"
                  />
                ) : (
                  <ArtTile color={work.color} variant={work.variant} className="absolute inset-0 h-full w-full" />
                )}
              </span>
              <span className="mt-2 block px-1 text-sm font-medium leading-snug tracking-tight text-text transition-colors group-hover:text-accent sm:text-base">
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

              {/* ქვედა ზოლი: [←] სახელი [→] ერთ რიგში (მობილურზე ისრებით), ქვეშ ყიდვის ღილაკი */}
              <div
                className="flex shrink-0 flex-col items-center gap-3 px-4 pb-[max(1.25rem,env(safe-area-inset-bottom))] pt-4"
                onClick={(event) => event.stopPropagation()}
              >
                <div className="flex w-full items-center gap-3 sm:w-auto">
                  {works.length > 1 ? (
                    <ArrowButton direction="prev" variant="glass" size="sm" label={t.home.prev} onClick={() => step(-1)} className="shrink-0 sm:hidden" />
                  ) : null}
                  <p className="line-clamp-2 min-w-0 flex-1 text-center text-base font-semibold leading-snug tracking-tight sm:text-lg">
                    {current.title}
                  </p>
                  {works.length > 1 ? (
                    <ArrowButton direction="next" variant="glass" size="sm" label={t.home.next} onClick={() => step(1)} className="shrink-0 sm:hidden" />
                  ) : null}
                </div>
                {current.url ? (
                  <div className="flex w-full shrink-0 flex-col items-center gap-1.5 sm:w-auto">
                    {/* დაჭერისას მზა შეტყობინება კოპირდება, მერე იხსნება ავტორის გვერდი */}
                    <a
                      href={current.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={() => {
                        setCopied(copyText(t.artist.dmMessage(current.title)));
                      }}
                      className={`inline-flex min-h-11 w-full items-center justify-center gap-1.5 rounded-full border px-5 text-sm font-medium transition duration-300 hover:-translate-y-0.5 active:scale-95 sm:w-auto ${socialVariant[current.network ?? "instagram"]}`}
                    >
                      {current.network === "facebook" ? t.artist.messageOnFacebook : current.network === "instagram" ? t.artist.messageOnInstagram : t.artist.openWork} ↗
                    </a>
                    {/* წარწერა მხოლოდ დაჭერის შემდეგ: ავტორის გვერდიდან რომ დაბრუნდები, ნახავ, რომ ტექსტი დაკოპირდა */}
                    <span aria-live="polite" className="text-xs text-white/80">
                      {copied ? t.artist.dmCopied : null}
                    </span>
                  </div>
                ) : null}
              </div>
            </div>,
            document.body,
          )
        : null}
    </>
  );
}
