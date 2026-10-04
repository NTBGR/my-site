"use client";

import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";

// ახალ გვერდზე გადასვლისას გვერდი მაშინვე თავიდან იწყება (კატეგორიების ზოლიც ჩანს).
// Next.js მხოლოდ ახალი გვერდის კონტენტის თავამდე ასქროლავს და ზედა ზოლი ზემოთ რჩება.
// „უკან/წინ“ ღილაკზე ბრაუზერის დამახსოვრებულ პოზიციას არ ვეხებით.
export default function ScrollToTop() {
  const pathname = usePathname();
  const first = useRef(true);
  const fromHistory = useRef(false);

  useEffect(() => {
    const onPop = () => {
      fromHistory.current = true;
    };
    window.addEventListener("popstate", onPop);
    return () => window.removeEventListener("popstate", onPop);
  }, []);

  useEffect(() => {
    if (first.current) {
      first.current = false;
      return;
    }
    if (fromHistory.current) {
      fromHistory.current = false;
      return;
    }
    window.scrollTo({ top: 0, left: 0, behavior: "instant" });
  }, [pathname]);

  return null;
}
