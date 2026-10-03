"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { FormEvent, useEffect, useState } from "react";
import Button from "@/components/ui/Button";
import Preferences from "@/components/Preferences";
import CategoryBar from "@/components/CategoryBar";
import LogoLink from "@/components/LogoLink";
import { useT } from "@/components/LangProvider";

const navHrefs = ["/artists", "/categories", "/blog"] as const;

function SearchIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      className="h-5 w-5"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      aria-hidden
    >
      <circle cx="11" cy="11" r="6.5" />
      <path strokeLinecap="round" d="M16.5 16.5 20 20" />
    </svg>
  );
}

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

export default function Header() {
  const router = useRouter();
  const t = useT();
  const pathname = usePathname();
  const [query, setQuery] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

  const navLinks = [
    { href: "/", label: t.nav.home },
    { href: navHrefs[0], label: t.nav.artists },
    { href: navHrefs[1], label: t.nav.categories },
    { href: navHrefs[2], label: t.nav.blog },
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

  function onSearch(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const q = query.trim();
    setMenuOpen(false);
    setSearchOpen(false);
    router.push(q ? `/artists?q=${encodeURIComponent(q)}` : "/artists");
  }

  const searchField = (
    <input
      type="search"
      name="q"
      value={query}
      onChange={(event) => setQuery(event.target.value)}
      placeholder={t.nav.search}
      className="h-11 w-full rounded-full border border-border bg-surface px-5 text-base text-text transition-shadow placeholder:text-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent sm:text-sm"
      aria-label={t.nav.searchLabel}
    />
  );

  return (
    <>
      <header className="sticky top-0 z-40 border-b border-border bg-[color-mix(in_srgb,var(--bg)_80%,transparent)] backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center gap-1.5 px-4 py-3 max-[359px]:px-3 sm:gap-3 sm:px-6 lg:gap-5 lg:px-10">
          <LogoLink />

          <nav
            className="hidden items-center gap-1 lg:ml-auto lg:flex"
            aria-label={t.nav.main}
          >
            {navLinks
              .slice(1)
              .filter((link) => link.href !== "/categories")
              .map((link) => {
              const active = isActive(link.href);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  aria-current={active ? "page" : undefined}
                  className={`inline-flex min-h-10 items-center rounded-full px-4 text-sm font-medium transition-colors ${
                    active
                      ? "bg-accent-soft text-accent"
                      : "text-muted hover:bg-accent-soft hover:text-accent"
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>

          <form onSubmit={onSearch} className="hidden w-52 xl:block 2xl:w-64">
            {searchField}
          </form>

          <div className="hidden lg:block">
            <Preferences />
          </div>

          <div className="hidden lg:block">
            <Button href="/join" variant="secondary">
              {t.nav.join}
            </Button>
          </div>

          <button
            type="button"
            className="ml-auto inline-flex h-11 w-11 items-center justify-center rounded-full text-text transition-colors hover:bg-accent-soft lg:ml-0 xl:hidden"
            aria-label={t.nav.searchLabel}
            aria-expanded={searchOpen}
            onClick={() => {
              setSearchOpen((open) => !open);
              setMenuOpen(false);
            }}
          >
            <SearchIcon />
          </button>

          <button
            type="button"
            className="inline-flex h-11 w-11 items-center justify-center rounded-full text-text transition-colors hover:bg-accent-soft lg:hidden"
            aria-label={t.nav.menu}
            aria-expanded={menuOpen}
            aria-controls="mobile-menu"
            onClick={() => {
              setMenuOpen(true);
              setSearchOpen(false);
            }}
          >
            <MenuIcon open={false} />
          </button>
        </div>

        {searchOpen ? (
          <div className="menu-enter border-t border-border px-4 py-3 xl:hidden">
            <form onSubmit={onSearch}>{searchField}</form>
          </div>
        ) : null}
      </header>

      <CategoryBar />

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
