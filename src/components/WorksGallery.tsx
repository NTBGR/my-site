"use client";

import Image from "next/image";
import { useCallback, useEffect, useState } from "react";
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

const FALLBACK_RATIO = 9 / 16;

function ratioOf(work: GalleryWork) {
  return work.width && work.height ? work.width / work.height : FALLBACK_RATIO;
}

export default function WorksGallery({ works }: { works: GalleryWork[] }) {
  const t = useT();
  const [open, setOpen] = useState<number | null>(null);

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
      {/* ერთნაირი 9:16 ბარათები; სრული ფოტო იხსნება დაჭერით */}
      <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-4 xl:grid-cols-5">
        {works.map((work, i) => (
          <li key={`${work.title}-${i}`}>
            <button
              type="button"
              onClick={() => setOpen(i)}
              aria-label={work.title}
              className="group relative block aspect-[9/16] w-full overflow-hidden rounded-[1.25rem] bg-surface text-left shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-2xl sm:rounded-[1.75rem]"
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

      {/* სრულეკრანიანი ნახვა */}
      {current ? (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={current.title}
          className="fixed inset-0 z-[60] flex flex-col items-center justify-center bg-black/85 p-4 backdrop-blur-sm"
          onClick={close}
        >
          <div
            className="flex max-h-full max-w-5xl flex-col items-center gap-4"
            onClick={(event) => event.stopPropagation()}
          >
            {current.image ? (
              <Image
                src={current.image}
                alt={current.title}
                width={current.width ?? 1000}
                height={current.height ?? 1250}
                sizes="90vw"
                className="h-auto max-h-[72vh] w-auto max-w-full rounded-2xl object-contain"
                priority
              />
            ) : (
              <div
                className="max-w-full overflow-hidden rounded-2xl"
                style={{
                  aspectRatio: ratioOf(current),
                  height: "min(72vh, 640px)",
                }}
              >
                <ArtTile
                  color={current.color}
                  variant={current.variant}
                  className="h-full w-full"
                />
              </div>
            )}
            <div className="flex flex-wrap items-center justify-center gap-3 text-white">
              <p className="text-lg font-semibold tracking-tight">{current.title}</p>
              {current.url ? (
                <a
                  href={current.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex min-h-10 items-center gap-1.5 rounded-full border border-white/30 bg-white/10 px-4 text-sm font-medium backdrop-blur-md transition hover:bg-white hover:text-black"
                >
                  {t.artist.openWork} ↗
                </a>
              ) : null}
            </div>
          </div>

          <button
            type="button"
            onClick={close}
            aria-label={t.artist.close}
            className="absolute right-4 top-4 flex h-11 w-11 items-center justify-center rounded-full border border-white/25 bg-white/15 text-white backdrop-blur-md transition hover:bg-white hover:text-black"
          >
            <svg
              viewBox="0 0 24 24"
              className="h-5 w-5"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.9"
              strokeLinecap="round"
              aria-hidden
            >
              <path d="M6 6l12 12M18 6 6 18" />
            </svg>
          </button>

          {works.length > 1 ? (
            <>
              <ArrowButton
                direction="prev"
                variant="glass"
                label={t.home.prev}
                onClick={() => step(-1)}
                className="absolute left-3 top-1/2 -translate-y-1/2 sm:left-6"
              />
              <ArrowButton
                direction="next"
                variant="glass"
                label={t.home.next}
                onClick={() => step(1)}
                className="absolute right-3 top-1/2 -translate-y-1/2 sm:right-6"
              />
            </>
          ) : null}
        </div>
      ) : null}
    </>
  );
}
