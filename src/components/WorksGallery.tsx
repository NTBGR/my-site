"use client";

import Image from "next/image";
import Link from "next/link";
import HeartButton from "@/components/HeartButton";
import SeeAllCard from "@/components/SeeAllCard";
import Photo from "@/components/Photo";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import ArtTile from "@/components/ArtTile";
import { useT } from "@/components/LangProvider";
import ArrowButton from "@/components/ui/ArrowButton";
import ShareButton from "@/components/ShareButton";
import { copyText } from "@/lib/copy";
import { socialVariant } from "@/components/ui/socialStyles";

export type GalleryWork = {
  title: string;
  color: string;
  variant: number;
  url?: string;
  // ფასი ლარში (ფასდაკლებისას უკვე შემცირებული)
  price?: number;
  // ფასდაკლებისას: ძველი ფასი და პროცენტი
  oldPrice?: number;
  salePercent?: number;
  // ბოლო 30 დღეში დამატებული
  isNew?: boolean;
  // ❤️ შენახვის გასაღები ("ავტორი/ნამუშევარი") და alt ტექსტი
  favKey?: string;
  // სხვადასხვა ხელოვანის სიაში: ავტორის სახელი და გვერდი
  artistName?: string;
  artistHref?: string;
  // პატარა წარწერა ფოტოს ქვედა კუთხეში (მაგ. „❤ 2“)
  badge?: string;
  // ბარათზე ფოტოს ცენტრის წერტილი („x% y%“)
  focal?: string;
  alt?: string;
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

const GRID = "grid grid-cols-2 gap-x-3 gap-y-5 sm:gap-x-4 sm:gap-y-6";
const ROW =
  "-mx-4 flex snap-x snap-mandatory scroll-px-4 gap-3 overflow-x-auto px-4 pb-2 [scrollbar-width:none] sm:mx-0 sm:grid sm:gap-4 sm:overflow-visible sm:px-0 [&::-webkit-scrollbar]:hidden";

export default function WorksGallery({
  works: source,
  shareUrl,
  shareTitle,
  showSort = true,
  layout = "grid",
  columns = "sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5",
  featureFirst = false,
  seeAll,
}: {
  works: GalleryWork[];
  shareUrl?: string;
  shareTitle?: string;
  // ფასით დალაგების არჩევანი (სიას, რომელსაც თავისი დალაგება აქვს, არ სჭირდება)
  showSort?: boolean;
  // grid: ბადე; row: ტელეფონზე გვერდზე გადასახვევი ზოლი (მთავარზე)
  layout?: "grid" | "row";
  columns?: string;
  // პირველი ნამუშევარი დიდია (2×2 ბადეში, ტელეფონზე ჩვეულებრივი); ბადე ორ სავსე რიგად იკვრება: პლანშეტზე 5 ნამუშევარი, დესკტოპზე 7
  featureFirst?: boolean;
  // ზოლის რეჟიმში, ტელეფონზე: ბოლო ბარათი „ყველას ნახვა“
  seeAll?: { href: string; label: string };
}) {
  const t = useT();
  // დახარისხება ფასით (ფასის გარეშე ნამუშევრები ბოლოშია)
  const [sort, setSort] = useState<"default" | "asc" | "desc">("default");
  const works = useMemo(() => {
    if (sort === "default") return source;
    const price = (w: GalleryWork) => w.price ?? Number.POSITIVE_INFINITY;
    return [...source].sort((a, b) => (sort === "asc" ? price(a) - price(b) : (b.price ?? -1) - (a.price ?? -1)));
  }, [source, sort]);
  const pricedCount = source.filter((w) => w.price).length;
  const [open, setOpen] = useState<number | null>(null);
  const [mounted, setMounted] = useState(false);
  const [copied, setCopied] = useState(false);
  const touchX = useRef<number | null>(null);
  // ზოლის რეჟიმი (მთავარზე): წერტილები გადასახვევი ზოლის ქვეშ, ტელეფონზე
  const rowRef = useRef<HTMLUListElement | null>(null);
  const [rowActive, setRowActive] = useState(0);
  const ROW_GAP = 12;
  const rowStep = useCallback(() => {
    const first = rowRef.current?.children[0] as HTMLElement | undefined;
    return first ? first.getBoundingClientRect().width + ROW_GAP : 0;
  }, []);
  const rowGoTo = useCallback(
    (index: number) => rowRef.current?.scrollTo({ left: index * rowStep(), behavior: "smooth" }),
    [rowStep],
  );
  useEffect(() => {
    const track = rowRef.current;
    if (!track || layout !== "row") return;
    const onScroll = () => {
      const stepPx = rowStep();
      if (stepPx <= 0) return;
      // ბოლოში ბოლო წერტილი ინათება (ბოლო ბარათი სქროლის ბოლოს თავში ვერ დგება)
      const atEnd = track.scrollLeft + track.clientWidth >= track.scrollWidth - 4;
      // „ყველას ნახვა“ ბარათს წერტილი არ აქვს: ვითვლით მხოლოდ ნამუშევრებს
      const count = track.querySelectorAll(":scope > li[data-work]").length;
      setRowActive(atEnd ? count - 1 : Math.min(count - 1, Math.round(track.scrollLeft / stepPx)));
    };
    track.addEventListener("scroll", onScroll, { passive: true });
    return () => track.removeEventListener("scroll", onScroll);
  }, [layout, rowStep]);

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

  // სია შეიძლება შემცირდეს გახსნილი ნახვისას (მაგ. რჩეულებიდან ამოღება): მაშინ ნახვა თავისით იხურება
  const current = open === null ? null : (works[open] ?? null);
  const isOpen = current !== null;

  useEffect(() => {
    if (!isOpen) return;
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
  }, [isOpen, close, step]);

  return (
    <>
      {/* ერთნაირი 3:4 ბარათები (ტელეფონის ფოტოს ფორმატი); სრული ფოტო იხსნება დაჭერით */}
      {showSort && pricedCount >= 3 ? (
        <div
          role="group"
          aria-label={t.sort.label}
          className="mb-4 inline-flex max-w-full overflow-x-auto rounded-full border-[1.5px] border-border bg-surface p-1 text-[13px] font-medium [scrollbar-width:none] sm:text-sm [&::-webkit-scrollbar]:hidden"
        >
          {(
            [
              ["default", t.sort.default],
              ["asc", t.sort.short.asc],
              ["desc", t.sort.short.desc],
            ] as const
          ).map(([value, label]) => (
            <button
              key={value}
              type="button"
              aria-pressed={sort === value}
              onClick={() => setSort(value)}
              className={`min-h-8 shrink-0 whitespace-nowrap rounded-full px-3 transition ${
                sort === value ? "bg-accent font-semibold text-on-accent shadow-[0_6px_14px_-8px_var(--accent)]" : "text-muted hover:text-accent"
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      ) : null}
      <ul ref={rowRef} className={`${layout === "row" ? ROW : GRID} ${columns}`}>
        {works.map((work, i) => (
          <li
            key={`${work.favKey ?? work.title}-${i}`}
            data-work
            className={`group relative ${layout === "row" ? "w-[58%] shrink-0 snap-start sm:w-auto" : ""} ${featureFirst && i === 0 ? "sm:col-span-2 sm:row-span-2" : ""} ${featureFirst && i >= 5 ? "sm:max-lg:hidden" : ""} ${featureFirst && i >= 7 ? "lg:hidden" : ""}`}
          >
            {/* ფოტო ზემოთ, სახელი ქვემოთ: სახელი ნამუშევარს აღარ ფარავს */}
            <button
              type="button"
              onClick={() => setOpen(i)}
              aria-label={work.title}
              className={`block w-full text-left ${featureFirst && i === 0 ? "sm:flex sm:h-full sm:flex-col" : ""}`}
            >
              <span className={`${featureFirst && i === 0 ? "sm:flex-1" : ""} block rounded-[1.35rem] border border-border bg-surface p-1.5 shadow-[0_14px_28px_-22px_rgb(60_40_20/0.55)] transition duration-300 group-hover:-translate-y-1 group-hover:border-accent group-hover:shadow-[0_26px_40px_-22px_rgb(184_74_36/0.6)] sm:rounded-[1.6rem]`}>
              <span className={`relative block aspect-[3/4] w-full overflow-hidden rounded-[1rem] bg-surface-2 sm:rounded-[1.2rem] ${featureFirst && i === 0 ? "sm:aspect-auto sm:h-full" : ""}`}>
                {work.isNew || work.salePercent ? (
                  <span className="absolute left-2 top-2 z-10 flex flex-col items-start gap-1">
                    {work.salePercent ? <span className="rounded-full bg-[#c4302b] px-2.5 py-1 text-[11px] font-bold text-white shadow-sm">−{work.salePercent}%</span> : null}
                    {work.isNew ? <span className="rounded-full bg-accent px-2.5 py-1 text-[11px] font-semibold text-on-accent shadow-sm">{t.newBadge}</span> : null}
                  </span>
                ) : null}
                {work.image ? (
                  <Photo src={work.image} alt={work.alt ?? work.title} focal={work.focal} sizes="(min-width:1280px) 240px, (min-width:1024px) 23vw, (min-width:640px) 31vw, 46vw" hoverZoom />
                ) : (
                  <ArtTile color={work.color} variant={work.variant} className="absolute inset-0 h-full w-full" />
                )}
                {work.badge ? (
                  <span className="absolute bottom-2 left-2 z-10 rounded-full bg-black/45 px-2.5 py-1 text-xs font-semibold text-white backdrop-blur-md">
                    {work.badge}
                  </span>
                ) : null}
              </span>
              </span>
              <span className={`mt-2 block line-clamp-3 h-[4.5em] sm:line-clamp-2 sm:h-[3em] px-1 text-sm font-medium leading-snug tracking-tight text-text transition-colors group-hover:text-accent sm:text-base`}>
                {work.title}
              </span>
              {work.price ? (
                <span className="mt-0.5 block px-1 text-sm font-bold text-text sm:text-base">
                  <span className={work.oldPrice ? "text-[#c4302b]" : undefined}>{work.price} ₾</span>
                  {work.oldPrice ? <s className="ml-1.5 text-xs font-normal text-muted sm:text-sm">{work.oldPrice} ₾</s> : null}
                </span>
              ) : (
                <span className="mt-0.5 block px-1 text-sm font-medium text-muted sm:text-base">{t.priceByAgreement}</span>
              )}
              {work.artistName ? <span className="block truncate px-1 text-xs text-muted sm:text-sm">{work.artistName}</span> : null}
            </button>
            {work.favKey ? (
              <HeartButton
                id={work.favKey}
                className="absolute right-2 top-2 z-10 h-9 w-9 bg-white/90 text-text shadow-sm backdrop-blur transition after:absolute after:-inset-1 after:content-[''] hover:scale-110 hover:bg-white hover:text-accent hover:shadow-md"
              />
            ) : null}
          </li>
        ))}
        {layout === "row" && seeAll ? (
          <li className="w-[58%] shrink-0 snap-start sm:hidden">
            <SeeAllCard href={seeAll.href} label={seeAll.label} />
          </li>
        ) : null}
      </ul>

      {layout === "row" && works.length > 1 ? (
        <div className="mt-4 flex items-center gap-1.5 sm:hidden" role="tablist" aria-label={t.home.next}>
          {works.map((work, i) => (
            <button
              key={work.favKey ?? i}
              type="button"
              role="tab"
              aria-selected={i === rowActive}
              aria-label={String(i + 1)}
              onClick={() => rowGoTo(i)}
              className="flex h-6 items-center px-0.5"
            >
              <span className={`block h-1.5 rounded-full transition-all duration-300 ${i === rowActive ? "w-6 bg-accent" : "w-1.5 bg-border"}`} />
            </button>
          ))}
        </div>
      ) : null}

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
                <div className="ml-auto mr-2 flex items-center gap-2">
                  {current.artistHref || shareUrl ? (
                    <ShareButton
                      url={current.artistHref ?? shareUrl!}
                      title={`${current.title}${current.artistName ?? shareTitle ? ` - ${current.artistName ?? shareTitle}` : ""}`}
                      variant="icon"
                    />
                  ) : null}
                  {current.favKey ? (
                    <HeartButton id={current.favKey} className="h-11 w-11 border border-white/25 bg-white/10 text-white backdrop-blur-md hover:bg-white hover:text-black" />
                  ) : null}
                </div>
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

                {/* წინა და შემდეგი ფოტო წინასწარ იტვირთება (უხილავად), რომ ფურცვლისას მყისიერად გამოჩნდეს */}
                {works.length > 1
                  ? [1, -1].map((direction) => {
                      const neighbor = works[(open! + direction + works.length) % works.length];
                      if (!neighbor?.image || neighbor.image === current.image) return null;
                      return (
                        <Image
                          key={neighbor.image}
                          src={neighbor.image}
                          alt=""
                          aria-hidden
                          width={neighbor.width ?? 1000}
                          height={neighbor.height ?? 1250}
                          sizes="(min-width: 1024px) 70vw, 95vw"
                          loading="eager"
                          className="pointer-events-none absolute h-px w-px opacity-0"
                        />
                      );
                    })
                  : null}

                {works.length > 1 ? (
                  <div onClick={(event) => event.stopPropagation()}>
                    <ArrowButton
                      direction="prev"
                      variant="glass"
                      size="sm"
                      label={t.home.prev}
                      onClick={() => step(-1)}
                      className="absolute left-2 top-1/2 flex -translate-y-1/2 sm:left-6 sm:h-11 sm:w-11"
                    />
                    <ArrowButton
                      direction="next"
                      variant="glass"
                      size="sm"
                      label={t.home.next}
                      onClick={() => step(1)}
                      className="absolute right-2 top-1/2 flex -translate-y-1/2 sm:right-6 sm:h-11 sm:w-11"
                    />
                  </div>
                ) : null}
              </div>

              {/* ქვედა ზოლი: სახელი, ქვეშ ყიდვის ღილაკი (ისრები ფოტოს გვერდებზეა) */}
              <div
                className="flex shrink-0 flex-col items-center gap-3 px-4 pb-[max(1.25rem,env(safe-area-inset-bottom))] pt-4"
                onClick={(event) => event.stopPropagation()}
              >
                <div className="flex w-full items-center gap-3 sm:w-auto">
                  <p className="line-clamp-2 min-w-0 flex-1 text-center text-base font-semibold leading-snug tracking-tight sm:text-lg">
                    {current.title}
                    {current.price ? (
                      <span className="ml-2 font-bold">
                        · {current.price} ₾
                        {current.oldPrice ? <s className="ml-1.5 text-sm font-normal text-white/60">{current.oldPrice} ₾</s> : null}
                        {current.salePercent ? <span className="ml-1.5 rounded-full bg-[#c4302b] px-2 py-0.5 text-xs font-bold">−{current.salePercent}%</span> : null}
                      </span>
                    ) : (
                      <span className="ml-2 text-sm font-medium text-white/70">· {t.priceByAgreement}</span>
                    )}
                  </p>
                </div>
                <div className="flex flex-wrap items-center justify-center gap-x-5 gap-y-1 text-sm font-medium text-white/80">
                  {current.artistHref && current.artistName ? (
                    <Link href={current.artistHref} className="underline decoration-white/40 underline-offset-4 transition hover:text-white hover:decoration-white">
                      {current.artistName}
                    </Link>
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
