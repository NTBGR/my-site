import { cookies } from "next/headers";
import { dictionary, LANG_COOKIE, normalizeLang, type Lang } from "./dictionary";

export async function getLang(): Promise<Lang> {
  return normalizeLang((await cookies()).get(LANG_COOKIE)?.value);
}

export async function getT() {
  return dictionary[await getLang()];
}
