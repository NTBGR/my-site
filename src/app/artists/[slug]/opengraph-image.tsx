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

  // ფოტოები: ქავერი და ნამუშევრები, მაქსიმუმ ოთხი (კიდეებზე: მესენჯერი და ვაიბერი სურათს შუიდან ჭრიან, ტექსტი ამიტომ ცენტრშია)
  const origin = process.env.NODE_ENV === "development" ? `http://localhost:${process.env.PORT ?? 3000}` : SITE_URL;
  const sources = artist
    ? [artist.cover, ...artist.works.map((work) => work.image)].filter((src, i, all): src is string => Boolean(src) && all.indexOf(src) === i).slice(0, 4)
    : [];
  const photos = (await Promise.all(sources.map((src) => toDataUrl(origin, src)))).filter((src): src is string => Boolean(src));
  const salePercent = artist ? artist.works.map((work) => pricing(artist, work)?.percent).find(Boolean) : undefined;
  const name = artist?.name ?? dictionary.ka.meta.title;
  const subtitle = artist ? [artist.category, artist.city].filter(Boolean).join(" · ") : "";
  const count = artist ? dictionary.ka.artists.worksCount(artist.works.length) : "";

  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", position: "relative", background: BG, fontFamily: "Sans" }}>
        {photos[0] ? <Photo src={photos[0]} rotate={-7} top={58} left={34} width={220} height={280} /> : null}
        {photos[1] ? <Photo src={photos[1]} rotate={6} top={52} left={946} width={210} height={270} /> : null}
        {photos[2] ? <Photo src={photos[2]} rotate={5} top={360} left={70} width={200} height={220} /> : null}
        {photos[3] ? <Photo src={photos[3]} rotate={-4} top={350} left={930} width={210} height={240} /> : null}

        <div
          style={{
            position: "absolute",
            top: 0,
            bottom: 0,
            left: 300,
            width: 600,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            textAlign: "center",
          }}
        >
          <div style={{ display: "flex", fontFamily: "Serif", fontSize: 46, color: TEXT }}>
            ხელოვანი<span style={{ color: ACCENT }}>.</span>
          </div>
          <svg width="205" height="12" viewBox="0 0 86 7" style={{ marginTop: 4 }}>
            <path d="M2 5 C20 1, 40 1, 84 3" stroke={ACCENT} strokeWidth="2.8" fill="none" strokeLinecap="round" />
          </svg>
          {salePercent ? (
            <div style={{ display: "flex", marginTop: 30, background: "#c4302b", color: "#fff", fontSize: 30, padding: "6px 22px", borderRadius: 40 }}>-{salePercent}%</div>
          ) : null}
          <div style={{ marginTop: salePercent ? 18 : 40, fontFamily: "Serif", fontSize: name.length > 16 ? 64 : 80, lineHeight: 1.06, color: TEXT, letterSpacing: -1 }}>{name}</div>
          <div style={{ marginTop: 22, fontSize: 32, lineHeight: 1.35, color: MUTED }}>{subtitle}</div>
          <div style={{ marginTop: 6, fontSize: 28, color: MUTED }}>{count}</div>
          <div style={{ marginTop: 26, fontSize: 24, color: ACCENT }}>{SITE_HOST}</div>
        </div>
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
