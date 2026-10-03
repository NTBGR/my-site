"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import Button from "@/components/ui/Button";

const navLinks = [
  { href: "/artists", label: "ხელოვანები" },
  { href: "/categories", label: "კატეგორიები" },
  { href: "/blog", label: "ბლოგი" },
];

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
      placeholder="ძებნა..."
      className="h-11 w-full rounded-card border border-border bg-surface px-4 text-sm text-text placeholder:text-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
      aria-label="ძებნა"
    />
  );

  return (
    <header className="border-b border-border bg-surface/90 backdrop-blur-sm">
      <div className="mx-auto flex max-w-6xl items-center gap-3 px-4 py-3 sm:px-6">
        <Link
          href="/"
          className="font-serif text-xl font-semibold tracking-tight text-text sm:text-2xl"
        >
          khelovani
        </Link>

        <form onSubmit={onSearch} className="hidden min-w-0 flex-1 md:block">
          {searchField}
        </form>

        <nav className="hidden items-center gap-5 md:flex" aria-label="მთავარი">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="inline-flex min-h-11 items-center text-sm text-accent hover:text-accent-hover"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <Link
          href="/favorites"
          className="inline-flex h-11 w-11 items-center justify-center rounded-card text-text hover:text-accent"
          aria-label="რჩეულები"
        >
          <HeartIcon />
        </Link>

        <div className="hidden md:block">
          <Button href="/join">გახდი პარტნიორი</Button>
        </div>

        <button
          type="button"
          className="inline-flex h-11 w-11 items-center justify-center rounded-card text-text md:hidden"
          aria-label="ძებნა"
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
          className="inline-flex h-11 w-11 items-center justify-center rounded-card text-text md:hidden"
          aria-label={menuOpen ? "მენიუს დახურვა" : "მენიუ"}
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
        <div className="border-t border-border px-4 py-3 md:hidden">
          <form onSubmit={onSearch}>{searchField}</form>
        </div>
      ) : null}

      {menuOpen ? (
        <nav
          id="mobile-menu"
          className="space-y-1 border-t border-border px-4 py-3 md:hidden"
          aria-label="მობილური"
        >
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="flex min-h-11 items-center text-accent hover:text-accent-hover"
              onClick={() => setMenuOpen(false)}
            >
              {link.label}
            </Link>
          ))}
          <Link
            href="/favorites"
            className="flex min-h-11 items-center text-accent hover:text-accent-hover"
            onClick={() => setMenuOpen(false)}
          >
            რჩეულები
          </Link>
          <Button href="/join" className="mt-2 w-full">
            გახდი პარტნიორი
          </Button>
        </nav>
      ) : null}
    </header>
  );
}
