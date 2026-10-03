import { cookies } from "next/headers";
import { dictionary, LANG_COOKIE, normalizeLang, type Lang } from "./dictionary";

export function getLang(): Lang {
  return normalizeLang(cookies().get(LANG_COOKIE)?.value);
}

export function getT() {
  return dictionary[getLang()];
}
