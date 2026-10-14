"use client";

import { useCallback, useSyncExternalStore } from "react";

// შენახული ნამუშევრები მხოლოდ ამ ბრაუზერში (localStorage), შესვლის გარეშე
const KEY = "saved-works";
const EVENT = "saved-works-change";

function read(): string[] {
  try {
    const parsed = JSON.parse(localStorage.getItem(KEY) || "[]");
    return Array.isArray(parsed) ? parsed.filter((x) => typeof x === "string") : [];
  } catch {
    return [];
  }
}

let cache: { raw: string; list: string[] } = { raw: "[]", list: [] };
function snapshot(): string[] {
  let raw = "[]";
  try {
    raw = localStorage.getItem(KEY) || "[]";
  } catch {}
  if (raw !== cache.raw) cache = { raw, list: read() };
  return cache.list;
}

function subscribe(callback: () => void) {
  window.addEventListener(EVENT, callback);
  window.addEventListener("storage", callback);
  return () => {
    window.removeEventListener(EVENT, callback);
    window.removeEventListener("storage", callback);
  };
}

const EMPTY: string[] = [];

export function useFavorites() {
  const list = useSyncExternalStore(subscribe, snapshot, () => EMPTY);
  const toggle = useCallback((id: string) => {
    const current = read();
    const adding = !current.includes(id);
    const next = adding ? [...current, id] : current.filter((x) => x !== id);
    try {
      localStorage.setItem(KEY, JSON.stringify(next));
    } catch {}
    // დამატებას ანონიმურად ვითვლით ხელოვანის თვიური რეპორტისთვის; შეცდომას მნიშვნელობა არ აქვს
    if (adding) {
      fetch("/api/favorite", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ key: id }),
        keepalive: true,
      }).catch(() => {});
    }
    window.dispatchEvent(new Event(EVENT));
  }, []);
  return { list, has: (id: string) => list.includes(id), toggle };
}
