"use client";

import Image from "next/image";
import Link from "next/link";
import ArtTile from "@/components/ArtTile";
import HeartButton from "@/components/HeartButton";
import { useT } from "@/components/LangProvider";
import { BLUR_DATA_URL } from "@/lib/blur";
import { formatPrice } from "@/lib/price";
import type { WorkCardData } from "@/lib/workCard";

// ნამუშევრის ბარათი (ყველგან ერთნაირი): ფოტო 4:5, ❤️ კუთხეში, ნიშნულები, სახელი 2 ხაზამდე, ავტორი, ფასი.
// კომპიუტერზე მაუსის მიტანისას მეორე ფოტო ჩანს (თუ არის)
export default function WorkCard({ card, priority = false }: { card: WorkCardData; priority?: boolean }) {
  const t = useT().ui;
  const badges = [card.isNew ? t.isNew : null, card.unique ? t.unique : null, card.madeToOrder ? t.madeToOrder : null].filter(Boolean) as string[];
  return (
    <div className="group relative">
      <Link href={card.href} className="block">
        <span className="relative block aspect-[4/5] w-full overflow-hidden rounded-[1.25rem] bg-surface shadow-sm transition duration-300 group-hover:-translate-y-1 group-hover:shadow-2xl sm:rounded-[1.5rem]">
          {card.image ? (
            <>
              <Image
                src={card.image}
                alt={card.title}
                fill
                priority={priority}
                placeholder="blur"
                blurDataURL={BLUR_DATA_URL}
                sizes="(min-width: 1280px) 240px, (min-width: 1024px) 22vw, (min-width: 640px) 33vw, 50vw"
                className={`object-cover transition duration-300 ${card.image2 ? "lg:group-hover:opacity-0" : "group-hover:scale-[1.04]"}`}
              />
              {card.image2 ? (
                <Image
                  src={card.image2}
                  alt=""
                  fill
                  sizes="(min-width: 1280px) 240px, 22vw"
                  className="hidden object-cover opacity-0 transition duration-300 lg:block lg:group-hover:opacity-100"
                />
              ) : null}
            </>
          ) : (
            <ArtTile color={card.color} variant={0} className="absolute inset-0 h-full w-full" />
          )}
          {badges.length > 0 ? (
            <span className="absolute bottom-2 left-2 z-10 flex flex-wrap gap-1">
              {badges.slice(0, 2).map((label, i) => (
                <span
                  key={label}
                  className={`rounded-full px-2.5 py-0.5 text-[11px] font-medium backdrop-blur sm:text-xs ${
                    i === 0 && card.isNew ? "bg-accent text-on-accent" : "bg-white/90 text-black"
                  }`}
                >
                  {label}
                </span>
              ))}
            </span>
          ) : null}
        </span>
        <span className="mt-2 block line-clamp-2 px-1 text-sm font-medium leading-snug text-text transition-colors group-hover:text-accent sm:text-base">
          {card.title}
        </span>
        <span className="block truncate px-1 text-xs text-muted sm:text-sm">{card.artistName}</span>
        <span className="mt-0.5 block px-1 text-sm font-semibold text-text">
          {card.price ? formatPrice(card.price) : <span className="font-normal text-muted">{t.priceOnRequest}</span>}
        </span>
      </Link>
      <HeartButton
        id={card.key}
        className="absolute right-2 top-2 z-10 h-10 w-10 bg-white/90 text-text shadow-sm backdrop-blur transition after:absolute after:-inset-1 after:content-[''] hover:text-accent"
      />
    </div>
  );
}
