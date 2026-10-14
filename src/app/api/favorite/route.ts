import { NextResponse, type NextRequest } from "next/server";
import { isBot } from "@/lib/clicks";
import { isWorkKey, recordFavorite } from "@/lib/favoriteStats";
import { allowed, clientIp } from "@/lib/ratelimit";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// ბრაუზერი აქ აცნობებს, რომ ნამუშევარი ფავორიტებში დაემატა (რეპორტისთვის). მონიშვნა თავად ბრაუზერშია და ამაზე არ არის დამოკიდებული.
export async function POST(req: NextRequest) {
  const site = req.headers.get("sec-fetch-site");
  if (site && site !== "same-origin") return new NextResponse(null, { status: 403 });
  const ua = req.headers.get("user-agent");
  if (isBot(ua)) return new NextResponse(null, { status: 204 });

  const ip = clientIp(req.headers);
  if (!(await allowed(`fav:ip:${ip}`, 120, 3600))) return NextResponse.json({ error: "rateLimited" }, { status: 429 });

  let key: unknown;
  try {
    key = ((await req.json()) as { key?: unknown }).key;
  } catch {
    return new NextResponse(null, { status: 400 });
  }
  if (!isWorkKey(key)) return new NextResponse(null, { status: 400 });

  const cookieId = req.cookies.get("vid")?.value;
  try {
    await recordFavorite(key, cookieId ? `c:${cookieId}` : `ip:${ip}|${ua}`);
  } catch (error) {
    console.error("favorite record failed", error);
  }
  return new NextResponse(null, { status: 204, headers: { "Cache-Control": "no-store" } });
}
