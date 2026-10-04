"use client";

import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";

const STORAGE_KEY = "scroll-positions";

// ასქროლვის დამახსოვრებული პოზიციები გვერდების მიხედვით (ტაბის ფარგლებში), რომ „უკან“ ზუსტად იქ დაგაბრუნოს, სადაც იყავი
function loadPositions(): Record<string, number> {
  try {
    return JSON.parse(sessionStorage.getItem(STORAGE_KEY) || "{}");
  } catch {
    return {};
  }
}

function savePosition(path: string, y: number) {
  try {
    const all = loadPositions();
    all[path] = Math.round(y);
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(all));
  } catch {}
}

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
// „უკან/წინ“ ღილაკზე ვაბრუნებთ ზუსტად იმ პოზიციას, სადაც ამ გვერდიდან წახვედი, მყისიერად და ცურვის გარეშე.
export default function ScrollToTop() {
  const pathname = usePathname();
  const first = useRef(true);
  const fromHistory = useRef(false);
  // „უკან/წინ“-ზე პოზიცია ვიმახსოვრებთ მაშინვე, სანამ გვერდის გამოცვლამ ახალი ასქროლვის მოვლენა არ გამოიწვია
  const pendingY = useRef<number | undefined>(undefined);
  // ამჟამინდელი გვერდი: „უკან/წინ“-ზე მისამართი უკვე ახალია, ამიტომ ძველ გვერდს ამით ვიცნობთ
  const currentPath = useRef(pathname);

  useEffect(() => {
    // პოზიციას თვითონ ვმართავთ: ბრაუზერის საკუთარი აღდგენა გვიან და ნელი ცურვით ხდებოდა
    history.scrollRestoration = "manual";

    const onPop = () => {
      fromHistory.current = true;
      savePosition(currentPath.current, window.scrollY);
      pendingY.current = loadPositions()[location.pathname];
    };
    let timer: ReturnType<typeof setTimeout> | undefined;
    const saveNow = () => savePosition(location.pathname, window.scrollY);
    const onScroll = () => {
      clearTimeout(timer);
      timer = setTimeout(saveNow, 80);
    };

    window.addEventListener("popstate", onPop);
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("pagehide", saveNow);
    // ბმულზე დაჭერისას პოზიციას მაშინვე ვინახავთ, გადასვლამდე
    document.addEventListener("click", saveNow, true);
    return () => {
      window.removeEventListener("popstate", onPop);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("pagehide", saveNow);
      document.removeEventListener("click", saveNow, true);
      clearTimeout(timer);
    };
  }, []);

  useEffect(() => {
    currentPath.current = pathname;
    if (first.current) {
      first.current = false;
      const nav = performance.getEntriesByType("navigation")[0] as PerformanceNavigationTiming | undefined;
      if (nav?.type === "back_forward") {
        jump(loadPositions()[pathname] ?? 0);
      } else {
        jump(startY(pathname));
      }
      return;
    }
    if (fromHistory.current) {
      fromHistory.current = false;
      const saved = pendingY.current ?? loadPositions()[pathname];
      pendingY.current = undefined;
      jump(saved ?? startY(pathname));
      return;
    }
    jump(startY(pathname));
  }, [pathname]);

  return null;
}
