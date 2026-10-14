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
    const next = current.includes(id) ? current.filter((x) => x !== id) : [...current, id];
    try {
      localStorage.setItem(KEY, JSON.stringify(next));
    } catch {}
    window.dispatchEvent(new Event(EVENT));
  }, []);
  return { list, has: (id: string) => list.includes(id), toggle };
}
