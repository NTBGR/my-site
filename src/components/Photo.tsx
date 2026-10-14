import Image from "next/image";
import { imageMeta } from "@/lib/imageMeta";
import { BLUR_DATA_URL } from "@/lib/blur";

// ფოტოს ჩვენების წესი (ერთი ადგილი ყველასთვის):
// 4:5-ის მსგავსი ვერტიკალური ფოტო (თანაფარდობა 0.7–0.85) ავსებს ჩარჩოს (cover, focal წერტილით);
// სხვა ფორმის ფოტო (კვადრატული პოსტერი, ჰორიზონტალური ნახატი) მთლიანად ჩანს მქრქალ (matte) ფონზე და არაფერი იჭრება.
// მშობელს უნდა ჰქონდეს `relative` და ზომა (მაგ. aspect-[4/5]).
export default function Photo({
  src,
  alt,
  sizes,
  priority = false,
  focal = "50% 50%",
  fit = "auto",
  className = "",
  hoverZoom = false,
}: {
  src: string;
  alt: string;
  sizes: string;
  priority?: boolean;
  focal?: string;
  fit?: "auto" | "cover" | "contain";
  className?: string;
  hoverZoom?: boolean;
}) {
  const meta = imageMeta(src);
  const ratio = meta ? meta.w / meta.h : undefined;
  const contain = fit === "contain" || (fit === "auto" && ratio !== undefined && (ratio < 0.7 || ratio > 0.85));
  const zoom = hoverZoom ? "transition duration-300 [@media(hover:hover)]:group-hover:scale-[1.03]" : "";

  if (contain) {
    return (
      <span className={`absolute inset-0 block bg-surface-2 p-[6%] ${className}`}>
        <span className="relative block h-full w-full">
          <Image
            src={src}
            alt={alt}
            fill
            sizes={sizes}
            quality={80}
            priority={priority}
            placeholder="blur"
            blurDataURL={meta?.blur ?? BLUR_DATA_URL}
            className={`object-contain ${zoom}`}
          />
        </span>
      </span>
    );
  }
  return (
    <Image
      src={src}
      alt={alt}
      fill
      sizes={sizes}
      quality={80}
      priority={priority}
      placeholder="blur"
      blurDataURL={meta?.blur ?? BLUR_DATA_URL}
      style={{ objectPosition: focal }}
      className={`object-cover ${zoom} ${className}`}
    />
  );
}
