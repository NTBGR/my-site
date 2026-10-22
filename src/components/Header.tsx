"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { FormEvent, useEffect, useRef, useState } from "react";
import Button from "@/components/ui/Button";
import Preferences from "@/components/Preferences";
import SavedLink from "@/components/SavedLink";
import CategoryBar, { type BarTag } from "@/components/CategoryBar";
import ComingSoonCountdown from "@/components/ComingSoonCountdown";
import SocialIcons from "@/components/SocialIcons";
import SearchBox from "@/components/SearchBox";
import type { SearchItem } from "@/lib/searchIndex";
import LogoLink from "@/components/LogoLink";
import { useLang, useT } from "@/components/LangProvider";
import { categories, categoryColor, localizeCategory } from "@/data/categories";
import { RIBBON } from "@/lib/tones";

const navHrefs = ["/artists", "/categories", "/blog", "/about"] as const;

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

export default function Header({ tags, searchIndex }: { tags: BarTag[]; searchIndex: SearchItem[] }) {
  const router = useRouter();
  const t = useT();
  const lang = useLang();
  const pathname = usePathname();
  const [query, setQuery] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

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
    setSearchOpen(false);
    setQuery("");
  }, [pathname]);

  // ძებნის ველი იხურება Esc-ით ან გარეთ დაჭერით და ტექსტი იწმინდება
  const headerRef = useRef<HTMLElement | null>(null);
  useEffect(() => {
    if (!searchOpen) return;
    const close = () => {
      setSearchOpen(false);
      setQuery("");
    };
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") close();
    };
    const onPointer = (event: PointerEvent) => {
      if (headerRef.current && !headerRef.current.contains(event.target as Node)) close();
    };
    window.addEventListener("keydown", onKey);
    document.addEventListener("pointerdown", onPointer);
    return () => {
      window.removeEventListener("keydown", onKey);
      document.removeEventListener("pointerdown", onPointer);
    };
  }, [searchOpen]);

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
    // ძებნის შემდეგ ველი სუფთაა: შემდეგ გახსნაზე ძველი ტექსტი აღარ დარჩება
    setQuery("");
    (document.activeElement as HTMLElement | null)?.blur();
    router.push(q ? `/artists?q=${encodeURIComponent(q)}` : "/artists");
  }

  // ძებნა შეირჩა ავტოშეთავაზებიდან: ველი იხურება და ტექსტი იწმინდება
  const afterPick = () => {
    setSearchOpen(false);
    setMenuOpen(false);
    setQuery("");
  };

  return (
    <>
      <header ref={headerRef} className="sticky top-0 z-40 border-b border-border bg-[color-mix(in_srgb,var(--bg)_80%,transparent)] backdrop-blur-xl">
        {/* ფერების ლენტი: საიტის პალიტრა ერთ ხაზზე */}
        <div aria-hidden className="absolute inset-x-0 top-0 h-[3px]" style={{ background: RIBBON }} />
        <div className="mx-auto flex max-w-7xl items-center gap-1.5 px-4 py-3.5 max-[359px]:px-3 sm:gap-3 sm:px-6 lg:gap-5 lg:px-10">
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
                      ? "bg-accent font-semibold text-on-accent shadow-[0_8px_16px_-10px_var(--accent)]"
                      : "text-muted hover:bg-accent-soft hover:text-accent"
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>

          <form onSubmit={onSearch} className="hidden w-52 xl:block 2xl:w-64">
            <SearchBox query={query} setQuery={setQuery} index={searchIndex} variant="desktop" onNavigate={afterPick} />
          </form>

          <div className="hidden lg:block">
            <Preferences />
          </div>

          <div className="hidden lg:block">
            <Button href="/join" className="glow-btn gap-2">
              <span aria-hidden>✦</span>
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
              setQuery("");
              setMenuOpen(false);
            }}
          >
            <SearchIcon />
          </button>

          <SavedLink />

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
            <form onSubmit={onSearch}><SearchBox query={query} setQuery={setQuery} index={searchIndex} variant="panel" autoFocus onNavigate={afterPick} /></form>
          </div>
        ) : null}
      </header>

      <CategoryBar tags={tags} />

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
          <div aria-hidden className="absolute inset-x-0 top-0 h-1" style={{ background: RIBBON }} />
          <div className="mb-3 mt-1 flex items-center justify-between">
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
                className={`flex min-h-12 items-center rounded-2xl px-4 text-base font-medium transition duration-200 ${
                  active
                    ? "bg-accent font-semibold text-on-accent"
                    : "text-text hover:bg-accent-soft hover:text-accent"
                }`}
              >
                {link.label}
              </Link>
            );
          })}

          {tags.length > 0 ? (
            <div className="mt-2 border-t border-border pt-2">
              <ul className="flex flex-col">
                <li>
                  <Link
                    href="/quiz"
                    onClick={() => setMenuOpen(false)}
                    className="flex min-h-11 items-center rounded-2xl px-4 text-sm font-semibold text-accent transition-colors hover:bg-accent-soft"
                  >
                    <span aria-hidden className="mr-2">🎯</span>
                    {t.quiz.title}
                  </Link>
                </li>
                {tags.map((tag) => tag.opensAtMs ? (
                  <li key={tag.slug}>
                    <span aria-disabled="true" className="flex min-h-11 cursor-not-allowed select-none items-center rounded-2xl px-4 text-sm font-medium text-muted/70">
                      <span aria-hidden className="mr-2 opacity-70 grayscale">{tag.emoji}</span>
                      {tag.name}
                      <span className="ml-auto rounded-full bg-accent-soft px-2 py-0.5 text-xs font-semibold text-accent tabular-nums">
                        <ComingSoonCountdown opensAtMs={tag.opensAtMs} />
                      </span>
                    </span>
                  </li>
                ) : (
                  <li key={tag.slug}>
                    <Link
                      href={`/gifts/${tag.slug}`}
                      onClick={() => setMenuOpen(false)}
                      className="flex min-h-11 items-center rounded-2xl px-4 text-sm font-medium text-text transition-colors hover:bg-accent-soft hover:text-accent"
                    >
                      <span aria-hidden className="mr-2">{tag.emoji}</span>
                      {tag.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ) : null}

          <div className="mt-2 border-t border-border pt-2">
            <p className="px-4 pb-1 pt-1 text-xs font-semibold text-muted">{t.nav.categories}</p>
            <ul className="flex flex-col">
              {categories.map((raw) => {
                const category = localizeCategory(raw, lang);
                return (
                  <li key={category.slug}>
                    <Link
                      href={`/categories/${category.slug}`}
                      onClick={() => setMenuOpen(false)}
                      className="flex min-h-11 items-center rounded-2xl px-4 text-sm font-medium text-text transition-colors hover:bg-accent-soft hover:text-accent"
                    >
                      <span aria-hidden className="mr-3 h-2.5 w-2.5 shrink-0 rounded-full" style={{ background: categoryColor(category.slug) }} />
                      {category.name}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>

          <div className="mt-2 border-t border-border px-4 pb-1 pt-3">
            <SocialIcons size="sm" />
          </div>

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
