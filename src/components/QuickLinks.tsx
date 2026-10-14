"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useT } from "@/components/LangProvider";

// სწრაფი ბმულები ჰედერის ქვეშ (ეთსის „Gifts / Home Favorites“ რიგის მსგავსად), ცენტრში
export default function QuickLinks() {
  const t = useT();
  const pathname = usePathname();
  const links = [
    { href: "/search?f=new", label: t.ui.newWorks, icon: "✦" },
    { href: "/artists", label: t.nav.artists },
    { href: "/about", label: t.footer.about },
  ];
  return (
    <nav aria-label="quick links" className="border-b border-border">
      <ul className="mx-auto flex max-w-7xl gap-1 overflow-x-auto px-4 py-1 [scrollbar-width:none] sm:px-6 lg:justify-center lg:px-10 [&::-webkit-scrollbar]:hidden">
        {links.map((link) => (
          <li key={link.href} className="shrink-0">
            <Link
              href={link.href}
              aria-current={pathname === link.href.split("?")[0] && link.href === "/artists" ? "page" : undefined}
              className="inline-flex min-h-11 items-center gap-1.5 rounded-full px-3 text-sm font-medium text-text transition-colors hover:bg-accent-soft hover:text-accent sm:px-4"
            >
              {link.icon ? <span aria-hidden className="text-accent">{link.icon}</span> : null}
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
