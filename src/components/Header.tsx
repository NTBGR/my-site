"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import Button from "@/components/ui/Button";
import Preferences from "@/components/Preferences";
import SavedLink from "@/components/SavedLink";
import SearchBox, { type SearchIndex } from "@/components/SearchBox";
import CategoriesMenu, { type MenuCategory } from "@/components/CategoriesMenu";
import QuickLinks from "@/components/QuickLinks";
import LogoLink from "@/components/LogoLink";
import { useT } from "@/components/LangProvider";

const navHrefs = ["/artists", "/categories", "/blog", "/about"] as const;

function MenuIcon({ open }: { open: boolean }) {
  return (
    <svg
      viewBox="0 0 24 24"
      className="h-5 w-5"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      aria-hidden
    >
      {open ? (
        <path strokeLinecap="round" d="M6 6l12 12M18 6 6 18" />
      ) : (
        <path strokeLinecap="round" d="M4 7h16M4 12h16M4 17h16" />
      )}
    </svg>
  );
}

export default function Header({ searchIndex, menuCategories }: { searchIndex: SearchIndex; menuCategories: MenuCategory[] }) {
  const t = useT();
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);

  const navLinks = [
    { href: "/", label: t.nav.home },
    { href: navHrefs[0], label: t.nav.artists },
    { href: navHrefs[1], label: t.nav.categories },
    // ბლოგი ჰედერში ჯერ არ ჩანს (ფუტერშია), სანამ სტატიები გამოჩნდება
    { href: navHrefs[3], label: t.footer.about },
  ];
  const isActive = (href: string) =>
    href === "/"
      ? pathname === "/"
      : pathname === href || pathname.startsWith(`${href}/`);

  // გვერდის შეცვლისას პანელი იხურება
  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  // პანელის გახსნისას გვერდის სქროლი იბლოკება; Esc ხურავს
  useEffect(() => {
    if (!menuOpen) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setMenuOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = previous;
      window.removeEventListener("keydown", onKey);
    };
  }, [menuOpen]);


  return (
    <>
      <header className="sticky top-0 z-40 border-b border-border bg-[color-mix(in_srgb,var(--bg)_80%,transparent)] backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center gap-1.5 px-4 py-3 max-[359px]:px-3 sm:gap-3 sm:px-6 lg:gap-5 lg:px-10">
          <LogoLink />

          <CategoriesMenu items={menuCategories} />

          <SearchBox index={searchIndex} className="hidden min-w-0 flex-1 lg:block" />

          <div className="hidden lg:block">
            <Preferences />
          </div>

          <div className="hidden lg:block">
            <Button href="/join" className="glow-btn gap-2">
              <span aria-hidden>✦</span>
              {t.nav.join}
            </Button>
          </div>

          <SavedLink />

          <button
            type="button"
            className="inline-flex h-11 w-11 items-center justify-center rounded-full text-text transition-colors hover:bg-accent-soft lg:hidden"
            aria-label={t.nav.menu}
            aria-expanded={menuOpen}
            aria-controls="mobile-menu"
            onClick={() => {
              setMenuOpen(true);
                          }}
          >
            <MenuIcon open={false} />
          </button>
        </div>

        <div className="px-4 pb-3 lg:hidden">
          <SearchBox index={searchIndex} />
        </div>
      </header>

      <QuickLinks />

      {/* მობილური მენიუ: გვერდიდან გამოსვლადი პანელი */}
      <div
        className={`fixed inset-0 z-50 lg:hidden ${
          menuOpen ? "visible" : "invisible transition-[visibility] delay-300"
        }`}
        aria-hidden={!menuOpen}
      >
        <button
          type="button"
          tabIndex={menuOpen ? 0 : -1}
          aria-label={t.nav.menuClose}
          onClick={() => setMenuOpen(false)}
          className={`absolute inset-0 bg-black/55 backdrop-blur-sm transition-opacity duration-300 ${
            menuOpen ? "opacity-100" : "opacity-0"
          }`}
        />
        <nav
          id="mobile-menu"
          aria-label={t.nav.mobile}
          className={`absolute right-0 top-0 flex h-full w-[84%] max-w-sm flex-col gap-1 overflow-y-auto bg-bg p-4 shadow-2xl transition-transform duration-300 ease-out ${
            menuOpen ? "translate-x-0" : "translate-x-full"
          }`}
        >
          <div className="mb-3 flex items-center justify-between">
            <span className="font-serif text-2xl font-semibold leading-none tracking-tight text-text">
              ხელოვანი<span className="text-accent">.</span>
            </span>
            <button
              type="button"
              onClick={() => setMenuOpen(false)}
              aria-label={t.nav.menuClose}
              className="inline-flex h-11 w-11 items-center justify-center rounded-full text-text transition-colors hover:bg-accent-soft"
            >
              <MenuIcon open />
            </button>
          </div>

          {navLinks.map((link) => {
            const active = isActive(link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                aria-current={active ? "page" : undefined}
                onClick={() => setMenuOpen(false)}
                className={`flex min-h-12 items-center rounded-2xl px-4 text-base font-medium transition-colors ${
                  active
                    ? "bg-accent-soft text-accent"
                    : "text-text hover:bg-accent-soft hover:text-accent"
                }`}
              >
                {link.label}
              </Link>
            );
          })}

          <div className="mt-2 border-t border-border pt-3">
            <Preferences />
          </div>

          <Button
            href="/join"
            className="glow-btn mt-auto w-full"
          >
            {t.nav.join}
          </Button>
        </nav>
      </div>
    </>
  );
}
