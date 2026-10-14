"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { FormEvent, useEffect, useMemo, useRef, useState } from "react";
import { useT } from "@/components/LangProvider";

export type SearchIndex = {
  categories: { label: string; text: string; href: string }[];
  artists: { label: string; text: string; href: string }[];
  works: { label: string; sub: string; text: string; href: string }[];
};

// ძებნის ველი ჩამოსაშლელი ვარიანტებით: კატეგორიები, ხელოვანები და ნამუშევრები
export default function SearchBox({ index, className = "" }: { index: SearchIndex; className?: string }) {
  const router = useRouter();
  const pathname = usePathname();
  const t = useT();
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const wrapRef = useRef<HTMLDivElement | null>(null);

  const needle = query.trim().toLowerCase();
  const suggestions = useMemo(() => {
    if (!needle) return null;
    const pick = <T extends { text: string }>(list: T[], n: number) => list.filter((x) => x.text.toLowerCase().includes(needle)).slice(0, n);
    return { categories: pick(index.categories, 3), artists: pick(index.artists, 3), works: pick(index.works, 5) };
  }, [needle, index]);
  const hasAny = suggestions && (suggestions.categories.length || suggestions.artists.length || suggestions.works.length);

  // ძებნის გვერდზე ველში ჩანს ჩაწერილი სიტყვა
  useEffect(() => {
    if (pathname === "/search") setQuery(new URLSearchParams(window.location.search).get("q") ?? "");
    else setQuery("");
  }, [pathname]);

  useEffect(() => {
    const onDown = (event: MouseEvent) => {
      if (wrapRef.current && !wrapRef.current.contains(event.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", onDown);
    return () => document.removeEventListener("mousedown", onDown);
  }, []);

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const q = query.trim();
    setOpen(false);
    router.push(q ? `/search?q=${encodeURIComponent(q)}` : "/search");
  }

  const row = "flex min-h-11 items-center justify-between gap-3 rounded-xl px-3 text-sm text-text hover:bg-accent-soft";
  const group = (title: string) => <p className="px-3 pb-1 pt-2 text-xs font-semibold uppercase tracking-wide text-muted">{title}</p>;

  return (
    <div ref={wrapRef} className={`relative ${className}`}>
      <form onSubmit={submit} role="search">
        <input
          type="search"
          name="q"
          value={query}
          onChange={(event) => {
            setQuery(event.target.value);
            setOpen(true);
          }}
          onFocus={() => setOpen(true)}
          onKeyDown={(event) => {
            if (event.key === "Escape") setOpen(false);
          }}
          placeholder={t.searchPage.placeholder}
          aria-label={t.nav.searchLabel}
          autoComplete="off"
          className="h-12 w-full rounded-full border-2 border-text/80 bg-surface pl-5 pr-14 text-base text-text shadow-sm transition-shadow placeholder:text-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
        />
        <button
          type="submit"
          aria-label={t.searchPage.button}
          className="absolute right-1.5 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-accent text-on-accent transition duration-300 hover:bg-accent-hover active:scale-95"
        >
          <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden>
            <circle cx="11" cy="11" r="6.5" />
            <path d="M16.5 16.5 20 20" />
          </svg>
        </button>
      </form>

      {open && suggestions ? (
        <div className="absolute inset-x-0 top-full z-50 mt-2 max-h-[70vh] overflow-y-auto rounded-2xl border border-border bg-bg p-2 shadow-2xl">
          {hasAny ? (
            <>
              {suggestions.categories.length ? group(t.ui.suggestCategories) : null}
              {suggestions.categories.map((c) => (
                <Link key={c.href} href={c.href} onClick={() => setOpen(false)} className={row}>
                  {c.label}
                </Link>
              ))}
              {suggestions.artists.length ? group(t.ui.suggestArtists) : null}
              {suggestions.artists.map((a) => (
                <Link key={a.href} href={a.href} onClick={() => setOpen(false)} className={row}>
                  {a.label}
                </Link>
              ))}
              {suggestions.works.length ? group(t.ui.suggestWorks) : null}
              {suggestions.works.map((w) => (
                <Link key={w.href} href={w.href} onClick={() => setOpen(false)} className={row}>
                  <span className="min-w-0 truncate">{w.label}</span>
                  <span className="shrink-0 truncate text-xs text-muted">{w.sub}</span>
                </Link>
              ))}
            </>
          ) : (
            <p className="px-3 py-3 text-sm text-muted">{t.searchPage.none.replace(/:$/, "")}</p>
          )}
          <Link
            href={`/search?q=${encodeURIComponent(query.trim())}`}
            onClick={() => setOpen(false)}
            className="mt-1 flex min-h-11 items-center rounded-xl px-3 text-sm font-medium text-accent hover:bg-accent-soft"
          >
            {t.ui.suggestAll} →
          </Link>
        </div>
      ) : null}
    </div>
  );
}
