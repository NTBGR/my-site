"use client";

import { useState } from "react";
import { useT } from "@/components/LangProvider";
import { useFavorites } from "@/lib/favorites";
import { haptic } from "@/lib/haptic";

// გულის ღილაკი: ნამუშევრის შენახვა/ამოღება
export default function HeartButton({ id, className = "", label }: { id: string; className?: string; label?: boolean }) {
  const t = useT().workPage;
  const { has, toggle } = useFavorites();
  const saved = has(id);
  const [pop, setPop] = useState(false);
  return (
    <button
      type="button"
      onClick={(event) => {
        event.preventDefault();
        event.stopPropagation();
        toggle(id);
        // დამატებისას: გულის პულსი და მსუბუქი ვიბრაცია (Android-ზე და iPhone-ზე iOS 17.4+)
        if (!saved) {
          haptic(30);
          setPop(true);
          window.setTimeout(() => setPop(false), 450);
        }
      }}
      aria-pressed={saved}
      // შენახულ გულს ყოველთვის წითელი ფერი აქვს (კლასის ფერს ჩაანაცვლებს), რომ მკაფიოდ ჩანდეს, რომ დაემატა
      style={saved ? { color: "#e11d48" } : undefined}
      aria-label={saved ? t.unsave : t.save}
      className={`inline-flex items-center justify-center gap-2 rounded-full transition duration-300 active:scale-90 ${className}`}
    >
      <svg viewBox="0 0 24 24" className={`h-5 w-5 ${pop ? "heart-pop" : ""}`} fill={saved ? "currentColor" : "none"} stroke="currentColor" strokeWidth="1.9" strokeLinejoin="round" aria-hidden>
        <path d="M12 20.5s-7.5-4.6-7.5-10.2A4.3 4.3 0 0 1 12 7.7a4.3 4.3 0 0 1 7.5 2.6c0 5.6-7.5 10.2-7.5 10.2Z" />
      </svg>
      {label ? <span className="text-sm font-medium">{saved ? t.unsave : t.save}</span> : null}
    </button>
  );
}
