"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

// ბანერის ფილაში ნამუშევრები ერთმანეთს ცვლის (ნელი გადაქრქალებით).
// თუ ფოტო ერთია ან ადამიანს ანიმაციები გამორთული აქვს, ფოტო უძრავია.
export default function BannerPhotos({
  images,
  sizes,
  priority = false,
  interval = 3500,
}: {
  images: string[];
  sizes: string;
  priority?: boolean;
  interval?: number;
}) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (images.length < 2) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const timer = setInterval(() => setIndex((i) => (i + 1) % images.length), interval);
    return () => clearInterval(timer);
  }, [images.length, interval]);

  return (
    <div className="relative aspect-[3/4]">
      {images.map((src, i) => (
        <Image
          key={src}
          src={src}
          alt=""
          fill
          sizes={sizes}
          priority={priority && i === 0}
          className={`object-cover transition-opacity duration-1000 ${i === index ? "opacity-100" : "opacity-0"}`}
        />
      ))}
    </div>
  );
}
