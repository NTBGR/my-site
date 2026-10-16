import { NextResponse, type NextRequest } from "next/server";
import { getArtistBySlug } from "@/data/artists";
import { isBot, recordView } from "@/lib/clicks";
import { allowed, clientIp } from "@/lib/ratelimit";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// ხელოვანის პროფილის ნახვის დათვლა: გვერდი მას ბრაუზერიდან გზავნის (ბოტების უმრავლესობა JS-ს არ ასრულებს)
export async function POST(req: NextRequest) {
  const done = () => new NextResponse(null, { status: 204, headers: { "Cache-Control": "no-store" } });
  if (isBot(req.headers.get("user-agent"))) return done();

  const body = await req.json().catch(() => null);
  const slug = typeof body?.slug === "string" ? body.slug : "";
  if (!getArtistBySlug(slug)) return done();

  // ერთი IP-დან საათში 300 ნახვაზე მეტი დათვლაში არ მიდის (გაბერვის წინააღმდეგ)
  const ip = clientIp(req.headers);
  const cookieId = req.cookies.get("vid")?.value;
  const visitor = cookieId ? `c:${cookieId}` : `ip:${ip}|${req.headers.get("user-agent")}`;
  try {
    await Promise.race([
      (async () => {
        if (await allowed(`view:ip:${ip}`, 300, 3600)) await recordView(slug, visitor);
      })(),
      new Promise((resolve) => setTimeout(resolve, 1500)),
    ]);
  } catch (error) {
    console.error("view record failed", error);
  }
  return done();
}
