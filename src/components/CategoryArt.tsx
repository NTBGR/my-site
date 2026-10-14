import type { ReactNode } from "react";
import Photo from "@/components/Photo";
import { categoryPhotos } from "@/data/categoryPhotos";

// კატეგორიის სურათი: ნამდვილი ფოტო ხელოვანის ნამუშევრიდან; თუ კატეგორიას ჯერ ფოტო არ აქვს,
// მშვიდი ერთფერი ფონი (ილუსტრაციის გარეშე). ზომას და ფორმას მშობლის className განსაზღვრავს (მაგ. aspect-[4/3]).
export default function CategoryArt({
  slug,
  color,
  className = "",
  still = false,
  children,
}: {
  slug: string;
  color: string;
  className?: string;
  // ძველი პარამეტრი (ილუსტრაციისთვის), ახლა გავლენა არ აქვს
  fit?: "cover" | "contain";
  // ბარათებზე ფოტო უძრავია (მოძრაობა მხოლოდ ბანერებზეა)
  still?: boolean;
  children?: ReactNode;
}) {
  const photo = categoryPhotos[slug];
  const position = className.includes("absolute") ? "" : "relative";
  // ყოველ სურათს საკუთარი ფაზა
  const phase = Array.from(slug).reduce((sum, ch) => sum + ch.charCodeAt(0), 0) % 8 * 2;

  if (photo) {
    return (
      <div className={`${position} overflow-hidden bg-surface-2 ${className}`.trim()}>
        {/* ნელი მოძრაობა; ყოველ კატეგორიას საკუთარი ფაზა, რომ ყველა ერთდროულად ერთნაირად არ მოძრაობდეს */}
        <div className={`${still ? "" : "art-drift"} absolute inset-0`} style={still ? undefined : { animationDelay: `-${phase}s` }} aria-hidden>
          <Photo src={photo.src} alt="" sizes="(min-width:1024px) 480px, 70vw" fit="cover" focal={photo.focal} />
        </div>
        {children ? <div className="relative z-10 h-full">{children}</div> : null}
      </div>
    );
  }

  return (
    <div
      className={`${position} overflow-hidden ${className}`.trim()}
      style={{ background: `color-mix(in srgb, ${color}, white 82%)` }}
    >
      {children ? <div className="relative z-10 h-full">{children}</div> : null}
    </div>
  );
}
