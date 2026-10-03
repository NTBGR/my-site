"use client";

import { useRouter } from "next/navigation";
import { useLang, useT } from "@/components/LangProvider";
import { LANG_COOKIE } from "@/lib/dictionary";

const buttonClass =
  "inline-flex h-11 min-w-11 items-center justify-center rounded-full px-2.5 hover:bg-accent-soft text-sm font-medium text-text transition hover:text-accent active:scale-90";

function SunIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      className="theme-icon-sun h-5 w-5"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      aria-hidden
    >
      <circle cx="12" cy="12" r="4" />
      <path
        strokeLinecap="round"
        d="M12 3v2M12 19v2M3 12h2M19 12h2M5.6 5.6l1.4 1.4M17 17l1.4 1.4M18.4 5.6 17 7M7 17l-1.4 1.4"
      />
    </svg>
  );
}

function MoonIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      className="theme-icon-moon h-5 w-5"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      aria-hidden
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M20 14.5A8 8 0 0 1 9.5 4a8 8 0 1 0 10.5 10.5Z"
      />
    </svg>
  );
}

export default function Preferences() {
  const router = useRouter();
  const lang = useLang();
  const t = useT();

  function toggleTheme() {
    const root = document.documentElement;
    const next = root.dataset.theme === "dark" ? "light" : "dark";
    root.dataset.theme = next;
    try {
      localStorage.setItem("theme", next);
    } catch {
      // შენახვა ვერ მოხერხდა, თემა მხოლოდ ამ გვერდზე იმუშავებს
    }
  }

  function toggleLang() {
    const next = lang === "ka" ? "en" : "ka";
    document.cookie = `${LANG_COOKIE}=${next}; path=/; max-age=31536000; samesite=lax`;
    router.refresh();
  }

  return (
    <div className="flex items-center">
      <button
        type="button"
        onClick={toggleLang}
        className={buttonClass}
        aria-label={t.nav.language}
        title={t.nav.language}
      >
        {t.nav.languageShort}
      </button>
      <button
        type="button"
        onClick={toggleTheme}
        className={buttonClass}
        aria-label={t.nav.theme}
        title={t.nav.theme}
      >
        <SunIcon />
        <MoonIcon />
      </button>
    </div>
  );
}
