"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useSyncExternalStore } from "react";
import { useT } from "@/components/LangProvider";
import { getNavDepth } from "@/lib/navDepth";

const subscribe = () => () => {};

// „უკან“ ისარი: თუ საიტის შიგნით მოვედი (საჩუქრებიდან, მთავარიდან, შერჩევიდან...), იქვე ბრუნდება, სადაც ვიყავი.
// თუ გვერდზე პირდაპირ მოვედი, ჩვეულებრივი ბმულია ხელოვანების სიაზე.
const DEFAULT_CLASS = "mb-1 inline-flex min-h-9 items-center text-sm font-medium text-muted transition-colors hover:text-accent";

// fallback: წარწერა, როცა გვერდზე პირდაპირ მოვედი (მაგ. "← ყველა კატეგორია"); home: ამის ნაცვლად „← მთავარი“
export default function BackLink({ href, className, fallback, home }: { href: string; className?: string; fallback?: string; home?: boolean }) {
  const all = useT();
  const t = all.artist;
  const router = useRouter();
  const inApp = useSyncExternalStore(subscribe, () => getNavDepth() > 0, () => false);

  return (
    <Link
      href={href}
      className={className ?? DEFAULT_CLASS}
      onClick={(event) => {
        if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
        if (getNavDepth() > 0) {
          event.preventDefault();
          router.back();
        }
      }}
    >
      {inApp ? t.backShort : (fallback ?? (home ? all.backHome : t.back))}
    </Link>
  );
}
