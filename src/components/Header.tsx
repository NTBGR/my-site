"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import Button from "@/components/ui/Button";
import Preferences from "@/components/Preferences";
import { useT } from "@/components/LangProvider";

const navHrefs = ["/artists", "/categories", "/blog"] as const;

function HeartIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      className="h-5 w-5"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      aria-hidden
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M12 20s-7-4.4-7-9.2A4.2 4.2 0 0 1 12 7.5a4.2 4.2 0 0 1 7 3.3C19 15.6 12 20 12 20Z"
      />
    </svg>
  );
}

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
  if (open) {
    return (
      <svg
        viewBox="0 0 24 24"
        className="h-5 w-5"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        aria-hidden
      >
        <path strokeLinecap="round" d="M6 6l12 12M18 6 6 18" />
      </svg>
    );
  }

  return (
    <svg
      viewBox="0 0 24 24"
      className="h-5 w-5"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      aria-hidden
    >
      <path strokeLinecap="round" d="M4 7h16M4 12h16M4 17h16" />
    </svg>
  );
}

export default function Header() {
  const router = useRouter();
  const t = useT();
  const navLinks = [
    { href: navHrefs[0], label: t.nav.artists },
    { href: navHrefs[1], label: t.nav.categories },
    { href: navHrefs[2], label: t.nav.blog },
  ];
  const pathname = usePathname();
  const isActive = (href: string) =>
    pathname === href || pathname.startsWith(`${href}/`);
  const [query, setQuery] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

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
      className="h-11 w-full rounded-full border border-border bg-surface px-5 text-sm text-text transition-shadow placeholder:text-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
      aria-label={t.nav.searchLabel}
    />
  );

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-[color-mix(in_srgb,var(--bg)_80%,transparent)] backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center gap-3 px-4 py-3 sm:px-6">
        <Link
          href="/"
          className="group flex items-center gap-2 font-serif text-xl font-semibold tracking-tight text-text sm:text-2xl"
        >
          <span
            aria-hidden
            className="inline-block h-3 w-3 rounded-full bg-accent transition-transform duration-500 group-hover:rotate-180 group-hover:scale-125"
          />
          khelovani
        </Link>

        <form onSubmit={onSearch} className="hidden min-w-0 flex-1 xl:block">
          {searchField}
        </form>

        <nav className="hidden items-center gap-1 lg:ml-auto lg:flex xl:ml-0" aria-label={t.nav.main}>
          {navLinks.map((link) => {
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

        <Link
          href="/favorites"
          className="ml-auto inline-flex h-11 w-11 items-center justify-center rounded-full text-text transition hover:scale-110 hover:bg-accent-soft hover:text-accent active:scale-95 lg:ml-0"
          aria-label={t.nav.favorites}
        >
          <HeartIcon />
        </Link>

        <div className="hidden lg:block">
          <Button href="/join">{t.nav.join}</Button>
        </div>

        <div className="hidden lg:block">
          <Preferences />
        </div>

        <button
          type="button"
          className="inline-flex h-11 w-11 items-center justify-center rounded-full text-text transition-colors hover:bg-accent-soft xl:hidden"
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
          aria-label={menuOpen ? t.nav.menuClose : t.nav.menu}
          aria-expanded={menuOpen}
          aria-controls="mobile-menu"
          onClick={() => {
            setMenuOpen((open) => !open);
            setSearchOpen(false);
          }}
        >
          <MenuIcon open={menuOpen} />
        </button>
      </div>

      {searchOpen ? (
        <div className="menu-enter border-t border-border px-4 py-3 xl:hidden">
          <form onSubmit={onSearch}>{searchField}</form>
        </div>
      ) : null}

      {menuOpen ? (
        <nav
          id="mobile-menu"
          className="menu-enter space-y-1 border-t border-border px-4 py-3 lg:hidden"
          aria-label={t.nav.mobile}
        >
          {navLinks.map((link) => {
            const active = isActive(link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                aria-current={active ? "page" : undefined}
                className={`flex min-h-12 items-center rounded-2xl px-4 text-base font-medium transition-colors ${
                  active
                    ? "bg-accent-soft text-accent"
                    : "text-text hover:bg-accent-soft hover:text-accent"
                }`}
                onClick={() => setMenuOpen(false)}
              >
                {link.label}
              </Link>
            );
          })}
          <Link
            href="/favorites"
            aria-current={isActive("/favorites") ? "page" : undefined}
            className={`flex min-h-12 items-center rounded-2xl px-4 text-base font-medium transition-colors ${
              isActive("/favorites")
                ? "bg-accent-soft text-accent"
                : "text-text hover:bg-accent-soft hover:text-accent"
            }`}
            onClick={() => setMenuOpen(false)}
          >
            {t.nav.favorites}
          </Link>
          <Preferences />
          <Button href="/join" className="mt-2 w-full">
            {t.nav.join}
          </Button>
        </nav>
      ) : null}
    </header>
  );
}
