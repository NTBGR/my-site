"use client";

import { createContext, useContext, type ReactNode } from "react";
import { dictionary, type Lang } from "@/lib/dictionary";

const LangContext = createContext<Lang>("ka");

export function LangProvider({
  lang,
  children,
}: {
  lang: Lang;
  children: ReactNode;
}) {
  return <LangContext.Provider value={lang}>{children}</LangContext.Provider>;
}

export function useLang() {
  return useContext(LangContext);
}

export function useT() {
  return dictionary[useContext(LangContext)];
}
