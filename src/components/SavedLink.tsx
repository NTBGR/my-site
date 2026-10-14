"use client";

import Link from "next/link";
import { useT } from "@/components/LangProvider";
import { useFavorites } from "@/lib/favorites";

// ზედა პანელში გული და შენახულების რაოდენობა
export default function SavedLink() {
  const t = useT().savedPage;
  const { list } = useFavorites();
  return (
    <Link
      href="/saved"
      aria-label={t.title}
      className="relative ml-auto inline-flex h-11 w-11 items-center justify-center rounded-full text-text transition-colors hover:bg-accent-soft lg:ml-0"
    >
      <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinejoin="round" aria-hidden>
        <path d="M12 20.5s-7.5-4.6-7.5-10.2A4.3 4.3 0 0 1 12 7.7a4.3 4.3 0 0 1 7.5 2.6c0 5.6-7.5 10.2-7.5 10.2Z" />
      </svg>
      {list.length > 0 ? (
        <span className="absolute right-1 top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-accent px-1 text-[10px] font-semibold leading-none text-on-accent">
          {list.length}
        </span>
      ) : null}
    </Link>
  );
}
