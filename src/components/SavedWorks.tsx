"use client";

import Link from "next/link";
import WorkCard, { type WorkCardData } from "@/components/WorkCard";
import { useT } from "@/components/LangProvider";
import { useFavorites } from "@/lib/favorites";

// შენახული ნამუშევრები (ბრაუზერიდან)
export default function SavedWorks({ cards }: { cards: WorkCardData[] }) {
  const t = useT().savedPage;
  const { list } = useFavorites();
  const saved = cards.filter((card) => list.includes(card.key));

  if (saved.length === 0) {
    return (
      <div className="mt-8 rounded-[1.75rem] border border-dashed border-border bg-surface p-8 text-center">
        <p className="mx-auto max-w-md text-muted">{t.empty}</p>
        <Link
          href="/search"
          className="mt-5 inline-flex min-h-11 items-center rounded-full bg-accent px-6 text-sm font-medium text-on-accent transition duration-300 hover:bg-accent-hover"
        >
          {t.browse}
        </Link>
      </div>
    );
  }
  return (
    <>
      <ul className="mt-6 grid grid-cols-2 gap-x-3 gap-y-5 sm:grid-cols-3 sm:gap-x-4 sm:gap-y-6 lg:grid-cols-4 xl:grid-cols-5">
        {saved.map((card) => (
          <li key={card.key}>
            <WorkCard card={card} />
          </li>
        ))}
      </ul>
      <p className="mt-8 text-xs text-muted">{t.note}</p>
    </>
  );
}
