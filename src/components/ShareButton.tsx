"use client";

import { useState } from "react";
import { useT } from "@/components/LangProvider";
import { copyText } from "@/lib/copy";

// გაზიარება: ტელეფონზე სისტემური გაზიარების ფანჯარა, სხვაგან ბმულის კოპირება
export default function ShareButton({ title, className = "" }: { title: string; className?: string }) {
  const t = useT().workPage;
  const [copied, setCopied] = useState(false);

  async function share() {
    const url = window.location.href;
    if (typeof navigator.share === "function") {
      try {
        await navigator.share({ title, url });
        return;
      } catch {
        // გაუქმდა: ვცდით კოპირებას
      }
    }
    setCopied(copyText(url));
    setTimeout(() => setCopied(false), 2500);
  }

  return (
    <button type="button" onClick={share} className={`inline-flex items-center justify-center gap-2 rounded-full transition duration-300 active:scale-95 ${className}`}>
      <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
        <path d="M12 4v11M8 8l4-4 4 4M5 13v6h14v-6" />
      </svg>
      <span className="text-sm font-medium" aria-live="polite">{copied ? t.shareCopied : t.share}</span>
    </button>
  );
}
