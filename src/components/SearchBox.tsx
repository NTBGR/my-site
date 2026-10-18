"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMemo, useState, type KeyboardEvent } from "react";
import { useT } from "@/components/LangProvider";
import { suggest, type SearchItem } from "@/lib/searchIndex";

// ჰედერის ძებნის ველი ავტოშეთავაზებით: საჩუქრები (მათ შორის „დედისთვის“, „football“...), კატეგორიები, ხელოვანები, ნამუშევრები.
// ისრებით შეარჩევ, Enter გახსნის; Enter არჩევის გარეშე ძველებურად ხსნის ძებნის შედეგებს
export default function SearchBox({
  query,
  setQuery,
  index,
  autoFocus = false,
  variant,
  onNavigate,
}: {
  query: string;
  setQuery: (value: string) => void;
  index: SearchItem[];
  autoFocus?: boolean;
  // desktop: ფანჯარა ველის ქვეშ ჰაერშია; panel: ტელეფონის პანელში სიის სახით
  variant: "desktop" | "panel";
  // არჩევის შემდეგ მშობელი ხურავს ძებნას და წმენდს ტექსტს
  onNavigate: () => void;
}) {
  const t = useT();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(-1);
  const results = useMemo(() => suggest(index, query), [index, query]);
  const showList = open && results.length > 0;
  const current = active >= 0 && active < results.length ? active : -1;

  function go(item: SearchItem) {
    setOpen(false);
    onNavigate();
    router.push(item.href);
  }

  function onKeyDown(event: KeyboardEvent<HTMLInputElement>) {
    if (event.key === "ArrowDown" && results.length > 0) {
      event.preventDefault();
      setOpen(true);
      setActive((value) => Math.min(results.length - 1, value + 1));
    } else if (event.key === "ArrowUp" && results.length > 0) {
      event.preventDefault();
      setActive((value) => Math.max(-1, value - 1));
    } else if (event.key === "Enter" && current >= 0) {
      event.preventDefault();
      go(results[current]);
    } else if (event.key === "Escape") {
      setOpen(false);
    }
  }

  return (
    <div
      className="relative"
      onBlur={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget as Node | null)) setOpen(false);
      }}
    >
      <input
        type="search"
        name="q"
        value={query}
        autoFocus={autoFocus}
        autoComplete="off"
        onChange={(event) => {
          setQuery(event.target.value);
          setOpen(true);
          setActive(-1);
        }}
        onFocus={() => setOpen(true)}
        onKeyDown={onKeyDown}
        placeholder={t.nav.search}
        role="combobox"
        aria-expanded={showList}
        aria-autocomplete="list"
        aria-controls="search-suggestions"
        aria-activedescendant={current >= 0 ? `search-option-${current}` : undefined}
        className="h-11 w-full rounded-full border border-border bg-surface px-5 text-base text-text transition-shadow placeholder:text-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent sm:text-sm"
        aria-label={t.nav.searchLabel}
      />
      {showList ? (
        <ul
          id="search-suggestions"
          role="listbox"
          className={`z-[60] overflow-hidden rounded-2xl border border-border bg-bg p-1.5 ${
            variant === "desktop" ? "absolute left-0 top-full mt-2 w-[min(24rem,90vw)] shadow-2xl" : "mt-2"
          }`}
        >
          {results.map((item, i) => (
            <li key={`${item.kind}-${item.href}`} role="presentation">
              <Link
                id={`search-option-${i}`}
                role="option"
                aria-selected={i === current}
                href={item.href}
                onClick={() => {
                  setOpen(false);
                  onNavigate();
                }}
                className={`flex min-h-11 items-center justify-between gap-3 rounded-xl px-3 py-2 transition-colors ${
                  i === current ? "bg-accent-soft text-accent" : "text-text hover:bg-accent-soft hover:text-accent"
                }`}
              >
                <span className="min-w-0">
                  <span className="block truncate text-sm font-medium">{item.label}</span>
                  {item.sub ? <span className="block truncate text-xs text-muted">{item.sub}</span> : null}
                </span>
                <span className="shrink-0 rounded-full bg-surface px-2 py-0.5 text-[11px] font-medium text-muted">{t.nav.suggestKinds[item.kind]}</span>
              </Link>
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}
