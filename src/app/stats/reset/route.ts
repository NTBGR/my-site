import { NextResponse, type NextRequest } from "next/server";
import { resetStats } from "@/lib/clicks";
import { STATS_COOKIE, tokenValid } from "@/lib/statsAuth";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// სტატისტიკის გაანულება: მხოლოდ პაროლით შესულს (ქუქის გზა /stats, ამიტომ ეს მისამართი /stats/reset-ზეა) და
// მხოლოდ მაშინ, თუ ველში სიტყვა „გაანულება“ ზუსტად არის ჩაწერილი
export async function POST(req: NextRequest) {
  const back = (query: string) => NextResponse.redirect(new URL(`/stats?${query}`, req.url), 303);
  if (!tokenValid(req.cookies.get(STATS_COOKIE)?.value)) return back("");

  const form = await req.formData().catch(() => null);
  if (String(form?.get("confirm") ?? "").trim() !== "გაანულება") return back("reset=confirm");

  try {
    const deleted = await resetStats();
    const res = back(`reset=${deleted}`);
    res.headers.set("Cache-Control", "no-store");
    return res;
  } catch (error) {
    console.error("stats reset failed", error);
    return back("reset=error");
  }
}
