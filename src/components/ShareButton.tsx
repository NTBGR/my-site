"use client";

import { useEffect, useRef, useState } from "react";
import { useT } from "@/components/LangProvider";
import { copyText } from "@/lib/copy";

function ShareIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M12 15V4m0 0L8 8m4-4 4 4" />
      <path d="M5 12v6a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-6" />
    </svg>
  );
}

// გაზიარება: ტელეფონზე სისტემის საკუთარი ფანჯარა (Messenger, Viber, WhatsApp...), კომპიუტერზე მცირე მენიუ და ბმულის კოპირება
export default function ShareButton({
  url,
  title,
  variant = "pill",
  className = "",
}: {
  url: string;
  title: string;
  variant?: "pill" | "icon";
  className?: string;
}) {
  const t = useT().share;
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const rootRef = useRef<HTMLSpanElement | null>(null);

  useEffect(() => {
    if (!open) return;
    const onPointer = (event: PointerEvent) => {
      if (rootRef.current && !rootRef.current.contains(event.target as Node)) setOpen(false);
    };
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    document.addEventListener("pointerdown", onPointer);
    window.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("pointerdown", onPointer);
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const absolute = () => new URL(url, window.location.origin).toString();

  async function onClick() {
    const link = absolute();
    if (typeof navigator.share === "function") {
      try {
        await navigator.share({ title, text: title, url: link });
        return;
      } catch (error) {
        // ადამიანმა თვითონ გააუქმა: მენიუს აღარ ვაჩვენებთ
        if (error instanceof DOMException && error.name === "AbortError") return;
      }
    }
    setOpen((value) => !value);
  }

  function links() {
    const link = absolute();
    const text = encodeURIComponent(`${title} ${link}`);
    return [
      { label: "WhatsApp", href: `https://wa.me/?text=${text}` },
      { label: "Viber", href: `viber://forward?text=${text}` },
      { label: "Telegram", href: `https://t.me/share/url?url=${encodeURIComponent(link)}&text=${encodeURIComponent(title)}` },
      { label: "Facebook", href: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(link)}` },
    ];
  }

  const base =
    variant === "icon"
      ? "inline-flex h-11 w-11 items-center justify-center rounded-full border border-white/25 bg-white/10 text-white backdrop-blur-md transition hover:bg-white hover:text-black"
      : "inline-flex min-h-10 items-center gap-2 rounded-full border border-white/40 bg-white/15 px-4 text-sm font-medium text-white backdrop-blur-md transition hover:bg-white hover:text-black";

  return (
    <span ref={rootRef} className="relative inline-flex">
      <button type="button" onClick={onClick} aria-label={t.button} aria-expanded={open} className={`${base} ${className}`.trim()}>
        <ShareIcon />
        {variant === "pill" ? t.button : null}
      </button>
      {open ? (
        <div role="menu" className="absolute right-0 top-full z-[60] mt-2 w-52 rounded-2xl border border-border bg-bg p-1.5 text-text shadow-2xl">
          {links().map((item) => (
            <a
              key={item.label}
              role="menuitem"
              href={item.href}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => setOpen(false)}
              className="flex min-h-11 items-center rounded-xl px-3 text-sm font-medium transition-colors hover:bg-accent-soft hover:text-accent"
            >
              {item.label}
            </a>
          ))}
          <button
            type="button"
            role="menuitem"
            onClick={() => {
              setCopied(copyText(absolute()));
              window.setTimeout(() => setCopied(false), 1800);
            }}
            className="flex min-h-11 w-full items-center rounded-xl px-3 text-left text-sm font-medium transition-colors hover:bg-accent-soft hover:text-accent"
          >
            {copied ? t.copied : t.copy}
          </button>
        </div>
      ) : null}
    </span>
  );
}
