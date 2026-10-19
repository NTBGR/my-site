"use client";

import { useSyncExternalStore } from "react";
import { useT } from "@/components/LangProvider";

// 1 იანვარი 2027, 00:00 თბილისის დროით (UTC+4)
const NEW_YEAR = Date.parse("2026-12-31T20:00:00Z");

const subscribe = (onChange: () => void) => {
  const id = window.setInterval(onChange, 20_000);
  return () => window.clearInterval(id);
};
// წუთებით დამრგვალებული რიცხვი: სერვერზე null (ჰიდრატაციის შეუსაბამობა რომ არ იყოს), ბრაუზერში სტაბილური მნიშვნელობა
const getSnapshot = () => Math.floor(Date.now() / 60_000);
const getServerSnapshot = () => null;

// „ახალ წლამდე დარჩა“: დღე, საათი, წუთი. როცა ახალი წელი დადგა, არაფერს აჩვენებს.
export default function NewYearCountdown() {
  const t = useT().home.countdown;
  const minuteNow = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  if (minuteNow === null) return <div aria-hidden className="mt-3 h-12" />;

  const left = Math.max(0, NEW_YEAR - minuteNow * 60_000);
  if (left === 0) return null;
  const days = Math.floor(left / 86_400_000);
  const hours = Math.floor((left % 86_400_000) / 3_600_000);
  const minutes = Math.floor((left % 3_600_000) / 60_000);

  return (
    <div className="mt-3">
      <p className="text-xs font-medium text-white/80">{t.label}</p>
      <div className="mt-1 flex items-center gap-2" role="timer" aria-label={`${days} ${t.days}, ${hours} ${t.hours}, ${minutes} ${t.minutes}`}>
        {[
          [days, t.days],
          [hours, t.hours],
          [minutes, t.minutes],
        ].map(([value, label]) => (
          <span key={label as string} className="flex min-w-[3.25rem] flex-col items-center rounded-xl bg-white/15 px-2 py-1 backdrop-blur-sm">
            <span className="text-lg font-semibold leading-tight tabular-nums sm:text-xl">{String(value).padStart(2, "0")}</span>
            <span className="text-[11px] leading-tight text-white/80">{label}</span>
          </span>
        ))}
      </div>
    </div>
  );
}
