"use client";

import { useMemo, useState } from "react";
import WorkCard from "@/components/WorkCard";
import { useT } from "@/components/LangProvider";
import type { WorkCardData } from "@/lib/workCard";

type Sort = "relevant" | "new" | "asc" | "desc";
type PriceBucket = "any" | "0" | "1" | "2";

const inBucket = (price: number | undefined, bucket: PriceBucket) => {
  if (bucket === "any") return true;
  if (price === undefined) return false;
  if (bucket === "0") return price < 50;
  if (bucket === "1") return price >= 50 && price < 150;
  return price >= 150;
};

const chip = (active: boolean) =>
  `inline-flex min-h-11 shrink-0 items-center whitespace-nowrap rounded-full border px-4 text-sm font-medium transition duration-300 ${
    active ? "border-transparent bg-accent text-on-accent" : "border-border bg-surface text-text hover:border-accent hover:text-accent"
  }`;

// ნამუშევრების სია ფილტრებით (ფასი, ქალაქი, შეკვეთით) და დალაგებით; ტელეფონზე ფილტრი ქვემოდან ამოსრიალებული პანელია
export default function WorksBrowser({ cards, emptyHint, initialSort = "relevant" }: { cards: WorkCardData[]; emptyHint?: string; initialSort?: Sort }) {
  const t = useT().ui;
  const [price, setPrice] = useState<PriceBucket>("any");
  const [city, setCity] = useState("");
  const [mto, setMto] = useState(false);
  const [sort, setSort] = useState<Sort>(initialSort);
  const [sheet, setSheet] = useState(false);

  const cities = useMemo(() => Array.from(new Set(cards.map((c) => c.city).filter(Boolean))), [cards]);
  const shown = useMemo(() => {
    const list = cards.filter((c) => inBucket(c.price, price) && (!city || c.city === city) && (!mto || c.madeToOrder));
    if (sort === "new") return [...list].sort((a, b) => b.order - a.order);
    if (sort === "asc") return [...list].sort((a, b) => (a.price ?? Infinity) - (b.price ?? Infinity));
    if (sort === "desc") return [...list].sort((a, b) => (b.price ?? -1) - (a.price ?? -1));
    return list;
  }, [cards, price, city, mto, sort]);

  const hasPrices = cards.some((c) => c.price !== undefined);
  const hasMto = cards.some((c) => c.madeToOrder);
  const activeCount = (price !== "any" ? 1 : 0) + (city ? 1 : 0) + (mto ? 1 : 0);
  const reset = () => {
    setPrice("any");
    setCity("");
    setMto(false);
    setSort("relevant");
  };

  const priceOptions: { value: PriceBucket; label: string }[] = [
    { value: "any", label: t.priceAny },
    { value: "0", label: t.price0 },
    { value: "1", label: t.price1 },
    { value: "2", label: t.price2 },
  ];

  const controls = (
    <>
      <fieldset>
        <legend className="mb-2 text-sm font-semibold text-text">{t.price}</legend>
        <div className="flex flex-wrap gap-2">
          {priceOptions.map((o) => (
            <button key={o.value} type="button" onClick={() => setPrice(o.value)} className={chip(price === o.value)} aria-pressed={price === o.value}>
              {o.label}
            </button>
          ))}
        </div>
      </fieldset>
      {cities.length > 1 ? (
        <fieldset>
          <legend className="mb-2 text-sm font-semibold text-text">{t.city}</legend>
          <div className="flex flex-wrap gap-2">
            <button type="button" onClick={() => setCity("")} className={chip(!city)} aria-pressed={!city}>
              {t.priceAny}
            </button>
            {cities.map((c) => (
              <button key={c} type="button" onClick={() => setCity(c)} className={chip(city === c)} aria-pressed={city === c}>
                {c}
              </button>
            ))}
          </div>
        </fieldset>
      ) : null}
      <fieldset>
        <div className="flex flex-wrap gap-2">
          <button type="button" onClick={() => setMto((v) => !v)} className={chip(mto)} aria-pressed={mto}>
            {t.madeToOrderFilter}
          </button>
        </div>
      </fieldset>
    </>
  );

  return (
    <div>
      <div className="mt-5 flex flex-wrap items-center gap-2 sm:gap-3">
        <button type="button" onClick={() => setSheet(true)} className={`${chip(activeCount > 0)} ${hasPrices || hasMto || cities.length > 1 ? "" : "hidden"} sm:hidden`}>
          {t.filters}
          {activeCount > 0 ? ` · ${activeCount}` : ""}
        </button>
        <div className="hidden flex-wrap items-center gap-2 sm:flex">
          {(hasPrices ? priceOptions.slice(1) : []).map((o) => (
            <button key={o.value} type="button" onClick={() => setPrice(price === o.value ? "any" : o.value)} className={chip(price === o.value)} aria-pressed={price === o.value}>
              {o.label}
            </button>
          ))}
          {cities.length > 1
            ? cities.map((c) => (
                <button key={c} type="button" onClick={() => setCity(city === c ? "" : c)} className={chip(city === c)} aria-pressed={city === c}>
                  {c}
                </button>
              ))
            : null}
          <button type="button" onClick={() => setMto((v) => !v)} className={chip(mto)} aria-pressed={mto}>
            {t.madeToOrderFilter}
          </button>
        </div>
        <label className="ml-auto flex items-center gap-2 text-sm text-muted">
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value as Sort)}
            aria-label={t.sort}
            className="min-h-11 rounded-full border border-border bg-surface px-4 text-sm font-medium text-text focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
          >
            <option value="relevant">{t.sort}</option>
            <option value="new">{t.sortNew}</option>
            <option value="asc">{t.sortPriceAsc}</option>
            <option value="desc">{t.sortPriceDesc}</option>
          </select>
        </label>
      </div>

      <p className="mt-4 text-sm text-muted" aria-live="polite">
        {t.results(shown.length)}
      </p>

      {shown.length === 0 ? (
        <div className="mt-6 rounded-[1.75rem] border border-dashed border-border bg-surface p-8 text-center">
          <p className="text-muted">{emptyHint}</p>
          {activeCount > 0 ? (
            <button type="button" onClick={reset} className="mt-4 inline-flex min-h-11 items-center rounded-full border border-border bg-bg px-5 text-sm font-medium text-text hover:border-accent hover:text-accent">
              {t.reset}
            </button>
          ) : null}
        </div>
      ) : (
        <ul className="mt-3 grid grid-cols-2 gap-x-3 gap-y-5 sm:grid-cols-3 sm:gap-x-4 sm:gap-y-6 lg:grid-cols-4 xl:grid-cols-5">
          {shown.map((card, i) => (
            <li key={card.key}>
              <WorkCard card={card} priority={i < 4} />
            </li>
          ))}
        </ul>
      )}

      {/* ტელეფონზე ფილტრი: ქვემოდან ამოსრიალებული პანელი */}
      {sheet ? (
        <div className="fixed inset-0 z-[60] sm:hidden" role="dialog" aria-modal="true" aria-label={t.filters}>
          <button type="button" aria-label={t.close} onClick={() => setSheet(false)} className="absolute inset-0 bg-black/55 backdrop-blur-sm" />
          <div className="menu-enter absolute inset-x-0 bottom-0 max-h-[85vh] space-y-5 overflow-y-auto rounded-t-[1.75rem] border-t border-border bg-bg p-5 pb-[max(1.25rem,env(safe-area-inset-bottom))] shadow-2xl">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-text">{t.filters}</h2>
              <button type="button" onClick={() => setSheet(false)} aria-label={t.close} className="inline-flex h-11 w-11 items-center justify-center rounded-full hover:bg-accent-soft">
                ✕
              </button>
            </div>
            {controls}
            <div className="flex gap-3 pt-1">
              <button type="button" onClick={reset} className="min-h-12 flex-1 rounded-full border border-border bg-surface text-sm font-medium text-text">
                {t.reset}
              </button>
              <button type="button" onClick={() => setSheet(false)} className="min-h-12 flex-[2] rounded-full bg-accent text-sm font-medium text-on-accent">
                {t.showResults} · {shown.length}
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
