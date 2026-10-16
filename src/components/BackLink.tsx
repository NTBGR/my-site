"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useSyncExternalStore } from "react";
import { useT } from "@/components/LangProvider";
import { getNavDepth } from "@/lib/navDepth";

const subscribe = () => () => {};

// „უკან“ ისარი: თუ საიტის შიგნით მოვედი (საჩუქრებიდან, მთავარიდან, შერჩევიდან...), იქვე ბრუნდება, სადაც ვიყავი.
// თუ გვერდზე პირდაპირ მოვედი, ჩვეულებრივი ბმულია ხელოვანების სიაზე.
export default function BackLink({ href, className }: { href: string; className?: string }) {
  const t = useT().artist;
  const router = useRouter();
  const inApp = useSyncExternalStore(subscribe, () => getNavDepth() > 0, () => false);

  return (
    <Link
      href={href}
      className={className}
      onClick={(event) => {
        if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
        if (getNavDepth() > 0) {
          event.preventDefault();
          router.back();
        }
      }}
    >
      {inApp ? t.backShort : t.back}
    </Link>
  );
}
