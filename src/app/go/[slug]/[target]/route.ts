import { NextResponse, type NextRequest } from "next/server";
import { getArtistBySlug } from "@/data/artists";
import { isBot, recordClick, type ClickTarget } from "@/lib/clicks";
import { allowed, clientIp } from "@/lib/ratelimit";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// /go/<ხელოვანი>/instagram | facebook | w<ნომერი> (ნამუშევარი)
// ითვლის გადასვლას და მაშინვე გადაჰყავს ხელოვანის გვერდზე
export async function GET(req: NextRequest, { params }: { params: { slug: string; target: string } }) {
  const artist = getArtistBySlug(params.slug);
  if (!artist) return NextResponse.redirect(new URL("/artists", req.url));

  let url: string | undefined;
  if (params.target === "instagram") url = artist.instagram;
  else if (params.target === "facebook") url = artist.facebook;
  else if (/^w\d+$/.test(params.target)) {
    const work = artist.works[Number(params.target.slice(1))];
    url = work?.url || artist.instagram || artist.facebook;
  }
  if (!url) return NextResponse.redirect(new URL(`/artists/${artist.slug}`, req.url));

  // ნამუშევრის ბმული ითვლება იმ ქსელად, სადაც მიდის
  const target: ClickTarget = /facebook\.com|fb\.com|fb\.me/i.test(url) ? "facebook" : "instagram";
  const ua = req.headers.get("user-agent");
  // ერთი IP-დან საათში 60 გადასვლაზე მეტი დათვლაში აღარ მიდის (კლიკების გაბერვის წინააღმდეგ), გადასვლა კი ჩვეულებრივ მუშაობს (იხ. allowed ქვემოთ)
  if (!isBot(ua)) {
    // ადამიანის ამოცნობა: ბრაუზერის ანონიმური ქუქი; თუ ქუქი არ არის (დაბლოკილია), IP + ბრაუზერი
    const cookieId = req.cookies.get("vid")?.value;
    const ip = (req.headers.get("x-forwarded-for") || "").split(",")[0].trim() || req.ip || "unknown";
    const visitor = cookieId ? `c:${cookieId}` : `ip:${ip}|${ua}`;
    try {
      // დათვლის შეცდომამ გადასვლა არ უნდა შეაფერხოს
      await Promise.race([
        (async () => {
          if (await allowed(`go:ip:${clientIp(req.headers)}`, 60, 3600)) await recordClick(artist.slug, target, visitor);
        })(),
        new Promise((resolve) => setTimeout(resolve, 1500)),
      ]);
    } catch (error) {
      console.error("click record failed", error);
    }
  }

  const res = NextResponse.redirect(url, 302);
  res.headers.set("Cache-Control", "no-store");
  res.headers.set("X-Robots-Tag", "noindex");
  return res;
}
