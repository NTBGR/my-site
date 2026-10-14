"use client";

import Image from "next/image";
import { useRef, useState } from "react";
import { BLUR_DATA_URL } from "@/lib/blur";

type Photo = { src: string; width?: number; height?: number };

// ნამუშევრის ფოტოგალერეა: ტელეფონზე გადასაფურცლი (სვაიპი, წერტილებით), კომპიუტერზე მინიატიურებით
export default function WorkGallery({ photos, title }: { photos: Photo[]; title: string }) {
  const [active, setActive] = useState(0);
  const trackRef = useRef<HTMLDivElement | null>(null);

  const goTo = (i: number) => {
    setActive(i);
    const track = trackRef.current;
    if (track) track.scrollTo({ left: i * track.clientWidth, behavior: "smooth" });
  };

  return (
    <div className="flex flex-col gap-3 lg:flex-row-reverse">
      <div className="min-w-0 flex-1">
        {/* ტელეფონი: სვაიპი; კომპიუტერი: არჩეული ფოტო */}
        <div
          ref={trackRef}
          onScroll={(e) => {
            const el = e.currentTarget;
            if (el.clientWidth > 0) setActive(Math.round(el.scrollLeft / el.clientWidth));
          }}
          className="flex snap-x snap-mandatory overflow-x-auto rounded-[1.5rem] bg-surface shadow-sm [scrollbar-width:none] lg:block lg:overflow-hidden [&::-webkit-scrollbar]:hidden"
        >
          {photos.map((photo, i) => (
            <div key={photo.src} className={`w-full shrink-0 snap-center ${i === active ? "" : "lg:hidden"}`}>
              <Image
                src={photo.src}
                alt={i === 0 ? title : `${title} (${i + 1})`}
                width={photo.width ?? 1000}
                height={photo.height ?? 1250}
                sizes="(min-width: 1024px) 50vw, 100vw"
                priority={i === 0}
                placeholder="blur"
                blurDataURL={BLUR_DATA_URL}
                className="mx-auto h-auto max-h-[80vh] w-auto max-w-full object-contain"
              />
            </div>
          ))}
        </div>
        {photos.length > 1 ? (
          <div className="mt-3 flex justify-center gap-1.5 lg:hidden" role="tablist">
            {photos.map((photo, i) => (
              <button key={photo.src} type="button" role="tab" aria-selected={i === active} aria-label={String(i + 1)} onClick={() => goTo(i)} className="flex h-6 items-center px-0.5">
                <span className={`block h-1.5 rounded-full transition-all duration-300 ${i === active ? "w-6 bg-accent" : "w-1.5 bg-border"}`} />
              </button>
            ))}
          </div>
        ) : null}
      </div>

      {photos.length > 1 ? (
        <div className="hidden gap-2 lg:flex lg:w-20 lg:flex-col">
          {photos.map((photo, i) => (
            <button
              key={photo.src}
              type="button"
              onClick={() => goTo(i)}
              aria-label={`${title} (${i + 1})`}
              className={`relative aspect-[4/5] w-full overflow-hidden rounded-xl border-2 transition ${i === active ? "border-accent" : "border-transparent opacity-70 hover:opacity-100"}`}
            >
              <Image src={photo.src} alt="" fill sizes="80px" className="object-cover" />
            </button>
          ))}
        </div>
      ) : null}
    </div>
  );
}
