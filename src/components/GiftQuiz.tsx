"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import HeartButton from "@/components/HeartButton";
import { useT } from "@/components/LangProvider";
import Photo from "@/components/Photo";

export type QuizWork = {
  key: string;
  title: string;
  price?: number;
  image?: string;
  artistName: string;
  artistSlug: string;
  tags: string[];
  kind: "jewelry" | "bouquet" | "poster" | "other";
  isNew: boolean;
};

type Who = "her" | "him" | "fans" | "any";
type Budget = "b50" | "b100" | "b150" | "any";
type Kind = "jewelry" | "bouquet" | "poster" | "any";

const WHO: { id: Who; emoji: string; tag?: string }[] = [
  { id: "her", emoji: "💐", tag: "for-her" },
  { id: "him", emoji: "🎁", tag: "for-him" },
  { id: "fans", emoji: "⚽", tag: "for-fans" },
  { id: "any", emoji: "✨" },
];
const BUDGET: { id: Budget; emoji: string; max?: number }[] = [
  { id: "b50", emoji: "🏷️", max: 50 },
  { id: "b100", emoji: "🏷️", max: 100 },
  { id: "b150", emoji: "🏷️", max: 150 },
  { id: "any", emoji: "✨" },
];
const KIND: { id: Kind; emoji: string }[] = [
  { id: "jewelry", emoji: "💍" },
  { id: "bouquet", emoji: "🌷" },
  { id: "poster", emoji: "🖼️" },
  { id: "any", emoji: "✨" },
];

const optionClass =
  "flex min-h-14 w-full items-center gap-3 rounded-2xl border-[1.5px] border-[color-mix(in_srgb,var(--text)_18%,transparent)] bg-bg px-4 text-left text-base font-medium text-text transition duration-200 hover:border-accent hover:bg-accent-soft active:scale-[0.99]";

export default function GiftQuiz({ works }: { works: QuizWork[] }) {
  const t = useT().quiz;
  const [step, setStep] = useState(0);
  const [who, setWho] = useState<Who>("any");
  const [budget, setBudget] = useState<Budget>("any");
  const [kind, setKind] = useState<Kind>("any");

  const { results, exact } = useMemo(() => {
    const maxPrice = BUDGET.find((b) => b.id === budget)?.max;
    const tag = WHO.find((w) => w.id === who)?.tag;
    const match = (work: QuizWork, useKind: boolean, useBudget: boolean) =>
      (!tag || work.tags.includes(tag)) &&
      (!useBudget || maxPrice === undefined || (work.price !== undefined && work.price <= maxPrice)) &&
      (!useKind || kind === "any" || work.kind === kind);
    const strict = works.filter((work) => match(work, true, true));
    if (strict.length > 0) return { results: strict.slice(0, 8), exact: true };
    // ზუსტი დამთხვევა არ არის: ჯერ სახეობას ვარბილებთ, მერე ბიუჯეტსაც
    const loose = works.filter((work) => match(work, false, true));
    if (loose.length > 0) return { results: loose.slice(0, 8), exact: false };
    return { results: works.filter((work) => match(work, false, false)).slice(0, 8), exact: false };
  }, [works, who, budget, kind]);

  const restart = () => {
    setStep(0);
    setWho("any");
    setBudget("any");
    setKind("any");
  };

  const progress = (
    <div className="mb-5 flex items-center gap-3">
      <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-surface-2" aria-hidden>
        <div className="h-full rounded-full bg-accent transition-all duration-300" style={{ width: `${Math.min(step, 3) * 33.4}%` }} />
      </div>
      <span className="text-sm text-muted tabular-nums">{t.step(Math.min(step + 1, 3), 3)}</span>
    </div>
  );

  const back = step > 0 ? (
    <button type="button" onClick={() => setStep(step - 1)} className="mt-4 inline-flex min-h-11 items-center text-sm font-medium text-muted transition hover:text-accent">
      ← {t.back}
    </button>
  ) : null;

  if (step === 0)
    return (
      <div>
        {progress}
        <h2 className="mb-4 text-2xl font-semibold tracking-tight text-text">{t.q1}</h2>
        <div className="grid gap-3 sm:grid-cols-2">
          {WHO.map((option) => (
            <button key={option.id} type="button" className={optionClass} onClick={() => { setWho(option.id); setStep(1); }}>
              <span aria-hidden className="text-2xl">{option.emoji}</span>
              {t.who[option.id]}
            </button>
          ))}
        </div>
      </div>
    );

  if (step === 1)
    return (
      <div>
        {progress}
        <h2 className="mb-4 text-2xl font-semibold tracking-tight text-text">{t.q2}</h2>
        <div className="grid gap-3 sm:grid-cols-2">
          {BUDGET.map((option) => (
            <button key={option.id} type="button" className={optionClass} onClick={() => { setBudget(option.id); setStep(2); }}>
              <span aria-hidden className="text-2xl">{option.emoji}</span>
              {t.budget[option.id]}
            </button>
          ))}
        </div>
        {back}
      </div>
    );

  if (step === 2)
    return (
      <div>
        {progress}
        <h2 className="mb-4 text-2xl font-semibold tracking-tight text-text">{t.q3}</h2>
        <div className="grid gap-3 sm:grid-cols-2">
          {KIND.map((option) => (
            <button key={option.id} type="button" className={optionClass} onClick={() => { setKind(option.id); setStep(3); }}>
              <span aria-hidden className="text-2xl">{option.emoji}</span>
              {t.kind[option.id]}
            </button>
          ))}
        </div>
        {back}
      </div>
    );

  return (
    <div>
      <h2 className="text-2xl font-semibold tracking-tight text-text">{t.resultTitle}</h2>
      {exact ? null : <p className="mt-2 text-muted">{t.closest}</p>}
      <ul className="mt-5 grid grid-cols-2 gap-x-3 gap-y-5 sm:grid-cols-3 sm:gap-x-4 lg:grid-cols-4">
        {results.map((work) => (
          <li key={work.key} className="group relative">
            <Link href={`/artists/${work.artistSlug}`} className="block">
              <span className="relative block aspect-[3/4] w-full overflow-hidden rounded-[1.25rem] bg-surface-2 shadow-sm">
                {work.image ? (
                  <Photo src={work.image} alt={`${work.title} - ${work.artistName}`} sizes="(min-width:1024px) 240px, (min-width:640px) 31vw, 46vw" hoverZoom />
                ) : null}
              </span>
              <span className="mt-2 block line-clamp-3 h-[4.5em] px-1 text-sm font-medium leading-snug text-text sm:line-clamp-2 sm:h-[3em] sm:text-base">{work.title}</span>
              {work.price ? <span className="block px-1 text-sm font-semibold text-text sm:text-base">{work.price} ₾</span> : null}
              <span className="block truncate px-1 text-xs text-muted sm:text-sm">{work.artistName}</span>
            </Link>
            <HeartButton
              id={work.key}
              className="absolute right-2 top-2 z-10 h-9 w-9 bg-white/90 text-text shadow-sm backdrop-blur transition after:absolute after:-inset-1 after:content-[''] hover:text-accent"
            />
          </li>
        ))}
      </ul>
      <div className="mt-8 flex flex-wrap items-center gap-3">
        <button type="button" onClick={restart} className="inline-flex min-h-11 items-center rounded-full bg-accent px-6 text-sm font-medium text-on-accent transition hover:bg-accent-hover">
          {t.restart}
        </button>
        <Link href="/gifts/under-100" className="inline-flex min-h-11 items-center rounded-full border-[1.5px] border-[color-mix(in_srgb,var(--text)_18%,transparent)] bg-bg px-6 text-sm font-medium text-text transition hover:border-accent hover:text-accent">
          {t.seeAll}
        </Link>
      </div>
    </div>
  );
}
