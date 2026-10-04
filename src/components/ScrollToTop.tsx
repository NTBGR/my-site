"use client";

import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";

// სად იწყება გვერდი: ხელოვანის გვერდზე კატეგორიების ზოლი ზემოთ დამალულია (ზევით ასქროლვაზე ჩანს),
// დანარჩენ გვერდებზე ბოლომდე ზემოდან.
function startY(pathname: string) {
  if (!/^\/artists\/[^/]+$/.test(pathname)) return 0;
  const header = document.querySelector("header");
  const main = document.querySelector("main");
  if (!header || !main) return 0;
  return Math.max(0, Math.round(main.getBoundingClientRect().top + window.scrollY - header.getBoundingClientRect().height));
}

function jump(y: number) {
  window.scrollTo({ top: y, left: 0, behavior: "instant" });
}

// ახალ გვერდზე გადასვლისას და განახლებისას (refresh) გვერდი თავიდან იწყება და არა იქ, სადაც იდექი.
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
      const nav = performance.getEntriesByType("navigation")[0] as PerformanceNavigationTiming | undefined;
      if (nav?.type === "back_forward") return;
      jump(startY(pathname));
      return;
    }
    if (fromHistory.current) {
      fromHistory.current = false;
      return;
    }
    jump(startY(pathname));
  }, [pathname]);

  return null;
}
