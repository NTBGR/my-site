"use client";

import { useT } from "@/components/LangProvider";
import { useFavorites } from "@/lib/favorites";

// გულის ღილაკი: ნამუშევრის შენახვა/ამოღება
export default function HeartButton({ id, className = "", label }: { id: string; className?: string; label?: boolean }) {
  const t = useT().workPage;
  const { has, toggle } = useFavorites();
  const saved = has(id);
  return (
    <button
      type="button"
      onClick={(event) => {
        event.preventDefault();
        event.stopPropagation();
        toggle(id);
      }}
      aria-pressed={saved}
      aria-label={saved ? t.unsave : t.save}
      className={`inline-flex items-center justify-center gap-2 rounded-full transition duration-300 active:scale-90 ${className}`}
    >
      <svg viewBox="0 0 24 24" className="h-5 w-5" fill={saved ? "currentColor" : "none"} stroke="currentColor" strokeWidth="1.9" strokeLinejoin="round" aria-hidden>
        <path d="M12 20.5s-7.5-4.6-7.5-10.2A4.3 4.3 0 0 1 12 7.7a4.3 4.3 0 0 1 7.5 2.6c0 5.6-7.5 10.2-7.5 10.2Z" />
      </svg>
      {label ? <span className="text-sm font-medium">{saved ? t.unsave : t.save}</span> : null}
    </button>
  );
}
