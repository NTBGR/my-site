import { ImageResponse } from "next/og";
import { getArtistBySlug, localizeArtist, pricing } from "@/data/artists";
import { SITE_HOST, SITE_URL } from "@/lib/site";
import { dictionary } from "@/lib/dictionary";

// ხელოვანის გაზიარების ბარათი (ფეისბუქი, მესენჯერი, ვაიბერი...): მისი სახელი და ნამუშევრების ფოტოები.
// ბოტებს ენის ქუქი არ აქვთ, ამიტომ ქართულია.
// დინამიკურია: ფოტოები საიტიდან მოგვაქვს, ბილდის დროს კი ახალი ხელოვანის ფოტო საიტზე ჯერ არ არის
export const runtime = "edge";
export const dynamic = "force-dynamic";
export const alt = dictionary.ka.meta.shareTitle;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

// ბილდმა ფონტები რომ იპოვოს, მისამართები სტატიკური უნდა იყოს
const loadFont = (url: URL) => fetch(url).then((res) => res.arrayBuffer());

// ფოტო პატარა ზომით (Next-ის ოპტიმიზატორიდან, 384px) და base64-ად, რომ edge ფუნქცია მსუბუქი დარჩეს.
// ფოტო ვერ ჩაიტვირთა: ბარათი ფოტოს გარეშეც გამოვა
async function toDataUrl(origin: string, image: string): Promise<string | null> {
  try {
    const res = await fetch(`${origin}/_next/image?url=${encodeURIComponent(image)}&w=384&q=75`, { headers: { Accept: "image/jpeg" } });
    if (!res.ok) return null;
    const type = res.headers.get("content-type") ?? "";
    if (!/jpe?g|png/.test(type)) return null;
    const bytes = new Uint8Array(await res.arrayBuffer());
    let binary = "";
    for (let i = 0; i < bytes.length; i += 0x8000) binary += String.fromCharCode(...bytes.subarray(i, i + 0x8000));
    return `data:${type.split(";")[0]};base64,` + btoa(binary);
  } catch {
    return null;
  }
}

const BG = "#f6f1ea";
const TEXT = "#1d1a17";
const MUTED = "#6a6158";
const ACCENT = "#b84a24";

function Photo({ src, rotate, top, left, width, height }: { src: string; rotate: number; top: number; left: number; width: number; height: number }) {
  return (
    <div
      style={{
        position: "absolute",
        top,
        left,
        width,
        height,
        display: "flex",
        borderRadius: 34,
        overflow: "hidden",
        transform: `rotate(${rotate}deg)`,
        boxShadow: "0 28px 56px rgba(60, 40, 20, 0.28)",
        border: "8px solid #fffdf9",
        background: "#fffdf9",
      }}
    >
      {/* eslint-disable-next-line @next/next/no-img-element, jsx-a11y/alt-text */}
      <img src={src} width={width - 16} height={height - 16} style={{ width: "100%", height: "100%", objectFit: "cover", borderRadius: 26 }} />
    </div>
  );
}

export default async function ArtistOpengraphImage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const raw = getArtistBySlug(slug);
  const artist = raw ? localizeArtist(raw, "ka") : undefined;
  const [serif, sans] = await Promise.all([
    loadFont(new URL("../../../assets/og-fonts/NotoSerifGeorgian-Bold.ttf", import.meta.url)),
    loadFont(new URL("../../../assets/og-fonts/NotoSansGeorgian-Medium.ttf", import.meta.url)),
  ]);

  // ფოტოები: ხელოვანის ბოლო ნამუშევრები (პირველი ფოტოს მიხედვით ქავერიც), მაქსიმუმ სამი
  const origin = process.env.NODE_ENV === "development" ? `http://localhost:${process.env.PORT ?? 3000}` : SITE_URL;
  const sources = artist
    ? [artist.cover, ...artist.works.map((work) => work.image)].filter((src, i, all): src is string => Boolean(src) && all.indexOf(src) === i).slice(0, 3)
    : [];
  const photos = (await Promise.all(sources.map((src) => toDataUrl(origin, src)))).filter((src): src is string => Boolean(src));
  const salePercent = artist ? artist.works.map((work) => pricing(artist, work)?.percent).find(Boolean) : undefined;
  const name = artist?.name ?? dictionary.ka.meta.title;
  const subtitle = artist ? [artist.category, artist.city].filter(Boolean).join(" · ") : "";
  const count = artist ? dictionary.ka.artists.worksCount(artist.works.length) : "";

  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", position: "relative", background: BG, fontFamily: "Sans" }}>
        <div style={{ display: "flex", flexDirection: "column", justifyContent: "space-between", padding: "72px 0 64px 80px", width: 660 }}>
          <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-start" }}>
            <div style={{ display: "flex", fontFamily: "Serif", fontSize: 48, color: TEXT }}>
              ხელოვანი<span style={{ color: ACCENT }}>.</span>
            </div>
            <svg width="215" height="12" viewBox="0 0 86 7" style={{ marginTop: 4 }}>
              <path d="M2 5 C20 1, 40 1, 84 3" stroke={ACCENT} strokeWidth="2.8" fill="none" strokeLinecap="round" />
            </svg>
          </div>

          <div style={{ display: "flex", flexDirection: "column" }}>
            {salePercent ? (
              <div style={{ display: "flex", marginBottom: 20 }}>
                <div style={{ display: "flex", background: "#c4302b", color: "#fff", fontSize: 30, padding: "6px 22px", borderRadius: 40 }}>-{salePercent}%</div>
              </div>
            ) : null}
            <div style={{ fontFamily: "Serif", fontSize: name.length > 18 ? 68 : 84, lineHeight: 1.05, color: TEXT, letterSpacing: -1 }}>{name}</div>
            <div style={{ marginTop: 22, fontSize: 32, lineHeight: 1.35, color: MUTED }}>{subtitle}</div>
            <div style={{ marginTop: 6, fontSize: 28, color: MUTED }}>{count}</div>
          </div>

          <div style={{ fontSize: 24, color: MUTED }}>{SITE_HOST}</div>
        </div>

        {photos[0] ? <Photo src={photos[0]} rotate={-6} top={64} left={700} width={270} height={340} /> : null}
        {photos[1] ? <Photo src={photos[1]} rotate={5} top={96} left={950} width={220} height={285} /> : null}
        {photos[2] ? <Photo src={photos[2]} rotate={-3} top={372} left={770} width={290} height={235} /> : null}
      </div>
    ),
    {
      ...size,
      // ბარათი დინამიკურია, ამიტომ CDN-ში ვინახავთ: ბოტები (ფეისბუქი, ვაიბერი) მყისიერად მიიღებენ, ხელოვანის ცვლილება კი დღე-ღამეში გამოჩნდება
      headers: { "Cache-Control": "public, max-age=3600, s-maxage=86400, stale-while-revalidate=604800" },
      fonts: [
        { name: "Serif", data: serif, weight: 700, style: "normal" },
        { name: "Sans", data: sans, weight: 500, style: "normal" },
      ],
    },
  );
}
