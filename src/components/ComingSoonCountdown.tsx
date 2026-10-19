"use client";

import { useSyncExternalStore } from "react";
import { useT } from "@/components/LangProvider";

const subscribe = (onChange: () => void) => {
  const id = window.setInterval(onChange, 20_000);
  return () => window.clearInterval(id);
};
const getSnapshot = () => Math.floor(Date.now() / 60_000);
const getServerSnapshot = () => null;

// „მალე · 42 დ 03 სთ 12 წთ“: გამოუშვებელი (დაბლოკილი) ჩიპის ჩვენება, ათვლა გახსნის დრომდე.
// სერვერზე მხოლოდ „მალე“ ჩანს, რომ ბრაუზერის რენდერი არ ეჯახებოდეს (საათი ბრაუზერზეა დამოკიდებული)
export default function ComingSoonCountdown({ opensAtMs }: { opensAtMs: number }) {
  const t = useT().home.countdown;
  const minuteNow = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  if (minuteNow === null) return <>{t.soon}</>;
  const left = Math.max(0, opensAtMs - minuteNow * 60_000);
  const days = Math.floor(left / 86_400_000);
  const hours = Math.floor((left % 86_400_000) / 3_600_000);
  const minutes = Math.floor((left % 3_600_000) / 60_000);
  return (
    <>
      {t.soon} · {days} {t.dShort} {String(hours).padStart(2, "0")} {t.hShort} {String(minutes).padStart(2, "0")} {t.mShort}
    </>
  );
}
