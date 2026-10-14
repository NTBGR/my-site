"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useT } from "@/components/LangProvider";
import { useFavorites } from "@/lib/favorites";

const icon = (d: string) => (
  <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
    <path d={d} />
  </svg>
);

// ტელეფონზე ქვედა ნავიგაცია: მთავარი, ძებნა, შენახული, ხელოვანებისთვის (ნამუშევრის გვერდზე დამალულია, იქ ქვედა ღილაკია)
export default function BottomNav() {
  const t = useT().ui;
  const pathname = usePathname();
  const { list } = useFavorites();
  if (pathname.startsWith("/works/")) return null;

  const items = [
    { href: "/", label: t.navHome, d: "M4 11l8-7 8 7v8a1 1 0 0 1-1 1h-4v-6H9v6H5a1 1 0 0 1-1-1v-8Z" },
    { href: "/search", label: t.navSearch, d: "M11 4a7 7 0 1 0 0 14 7 7 0 0 0 0-14Zm5.5 12.5L20 20" },
    { href: "/saved", label: t.navSaved, d: "M12 20.5s-7.5-4.6-7.5-10.2A4.3 4.3 0 0 1 12 7.7a4.3 4.3 0 0 1 7.5 2.6c0 5.6-7.5 10.2-7.5 10.2Z", badge: list.length },
    { href: "/join", label: t.navMakers, d: "M12 5v14M5 12h14" },
  ];
  const active = (href: string) => (href === "/" ? pathname === "/" : pathname === href || pathname.startsWith(`${href}/`));

  return (
    <nav
      aria-label="mobile"
      className="fixed inset-x-0 bottom-0 z-40 border-t border-border bg-[color-mix(in_srgb,var(--bg)_92%,transparent)] pb-[env(safe-area-inset-bottom)] backdrop-blur-xl lg:hidden"
    >
      <ul className="mx-auto grid max-w-md grid-cols-4">
        {items.map((item) => (
          <li key={item.href}>
            <Link
              href={item.href}
              aria-current={active(item.href) ? "page" : undefined}
              className={`relative flex min-h-14 flex-col items-center justify-center gap-0.5 text-[11px] font-medium transition-colors ${
                active(item.href) ? "text-accent" : "text-muted"
              }`}
            >
              {icon(item.d)}
              <span>{item.label}</span>
              {item.badge ? (
                <span className="absolute right-[28%] top-1.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-accent px-1 text-[10px] font-semibold leading-none text-on-accent">
                  {item.badge}
                </span>
              ) : null}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
