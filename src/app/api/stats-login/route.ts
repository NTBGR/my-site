import { NextResponse, type NextRequest } from "next/server";
import { allowed, clientIp } from "@/lib/ratelimit";
import { passwordMatches, STATS_COOKIE, STATS_COOKIE_MAX_AGE, statsConfigured, statsToken } from "@/lib/statsAuth";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// სტატისტიკის გვერდზე შესვლა: პაროლი სწორია, ჩაიწერება დაცული ქუქი და ბრუნდება /stats-ზე
export async function POST(req: NextRequest) {
  const back = (error?: string) => {
    const url = new URL("/stats", req.url);
    if (error) url.searchParams.set("error", error);
    return NextResponse.redirect(url, 303);
  };
  if (!statsConfigured()) return back("config");

  // ერთი IP-დან 10 წუთში 5 ცდა (პაროლის გამოცნობის წინააღმდეგ)
  if (!(await allowed(`stats-login:${clientIp(req.headers)}`, 5, 600))) return back("wait");

  const form = await req.formData().catch(() => null);
  const password = String(form?.get("password") ?? "");
  if (!passwordMatches(password)) return back("1");

  const res = back();
  res.cookies.set(STATS_COOKIE, statsToken(), {
    httpOnly: true,
    sameSite: "strict",
    secure: req.nextUrl.protocol === "https:",
    path: "/stats",
    maxAge: STATS_COOKIE_MAX_AGE,
  });
  res.headers.set("Cache-Control", "no-store");
  return res;
}
