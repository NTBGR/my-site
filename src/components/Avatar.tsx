import Image from "next/image";
import { imageMeta } from "@/lib/imageMeta";
import { BLUR_DATA_URL } from "@/lib/blur";

// ხელოვანის ავატარი: ცალკე ფოტო (ლოგო/პორტრეტი); თუ არ არის, მონოგრამა (სახელის 1-2 ასო) ტერაკოტა წრეზე.
// ნამუშევრის ფოტო ავატარად არასოდეს გამოიყენება.
export function initials(name: string): string {
  const words = name.replace(/[^\p{L}\p{N}\s]/gu, " ").split(/\s+/).filter(Boolean);
  const letters = words.slice(0, 2).map((w) => Array.from(w)[0]);
  return letters.join("").toUpperCase();
}

export default function Avatar({
  name,
  src,
  sizePx,
  className = "",
  priority = false,
}: {
  name: string;
  src?: string;
  sizePx: number;
  className?: string;
  priority?: boolean;
}) {
  const meta = imageMeta(src);
  return (
    <span
      className={`relative inline-flex shrink-0 items-center justify-center overflow-hidden rounded-full bg-accent text-on-accent ${className}`}
      style={{ width: sizePx, height: sizePx, fontSize: sizePx * 0.38 }}
    >
      {src ? (
        <Image
          src={src}
          alt={name}
          fill
          sizes={`${sizePx}px`}
          quality={80}
          priority={priority}
          placeholder="blur"
          blurDataURL={meta?.blur ?? BLUR_DATA_URL}
          className="object-cover"
        />
      ) : (
        <span aria-hidden className="font-semibold leading-none">
          {initials(name)}
        </span>
      )}
    </span>
  );
}
