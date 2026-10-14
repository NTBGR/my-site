import { ImageResponse } from "next/og";
import { SITE_HOST } from "@/lib/site";
import { dictionary } from "@/lib/dictionary";

// გაზიარების სურათი (ფეისბუქი, მესენჯერი, ვაიბერი...): ბოტებს ენის ქუქი არ აქვთ, ამიტომ ქართულია
export const runtime = "edge";
export const alt = dictionary.ka.meta.shareTitle;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

// ბილდმა ფონტები რომ იპოვოს, მისამართები სტატიკური უნდა იყოს
const loadFont = (url: URL) => fetch(url).then((res) => res.arrayBuffer());

const toDataUrl = async (url: URL) => {
  const buffer: ArrayBuffer = await (await fetch(url)).arrayBuffer();
  const bytes = new Uint8Array(buffer);
  let binary = "";
  for (let i = 0; i < bytes.length; i += 0x8000) binary += String.fromCharCode(...bytes.subarray(i, i + 0x8000));
  return "data:image/jpeg;base64," + btoa(binary);
};

const BG = "#f6f1ea";
const TEXT = "#1d1a17";
const MUTED = "#6a6158";
const ACCENT = "#a84f2c";

function Photo({
  src,
  rotate,
  top,
  left,
  width,
  height,
}: {
  src: string;
  rotate: number;
  top: number;
  left: number;
  width: number;
  height: number;
}) {
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

export default async function OpengraphImage() {
  const [photoA, photoB, photoC] = await Promise.all([
    toDataUrl(new URL("../assets/og-images/a.jpg", import.meta.url)),
    toDataUrl(new URL("../assets/og-images/b.jpg", import.meta.url)),
    toDataUrl(new URL("../assets/og-images/c.jpg", import.meta.url)),
  ]);
  const [serif, sans] = await Promise.all([
    loadFont(new URL("../assets/og-fonts/NotoSerifGeorgian-Bold.ttf", import.meta.url)),
    loadFont(new URL("../assets/og-fonts/NotoSansGeorgian-Medium.ttf", import.meta.url)),
  ]);
  const { meta } = dictionary.ka;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          position: "relative",
          background: BG,
          fontFamily: "Sans",
        }}
      >
        {/* ტექსტი */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            padding: "72px 0 64px 80px",
            width: 640,
          }}
        >
          <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-start" }}>
            <div style={{ display: "flex", fontFamily: "Serif", fontSize: 56, color: TEXT }}>
              ხელოვანი<span style={{ color: ACCENT }}>.</span>
            </div>
            <svg width="250" height="14" viewBox="0 0 86 7" style={{ marginTop: 4 }}>
              <path
                d="M2 5 C20 1, 40 1, 84 3"
                stroke={ACCENT}
                strokeWidth="2.8"
                fill="none"
                strokeLinecap="round"
              />
            </svg>
          </div>

          <div style={{ display: "flex", flexDirection: "column" }}>
            <div
              style={{
                fontFamily: "Serif",
                fontSize: 92,
                lineHeight: 1.05,
                color: TEXT,
                letterSpacing: -1,
              }}
            >
              {meta.ogTagline}
            </div>
            <div style={{ marginTop: 22, fontSize: 32, lineHeight: 1.35, color: MUTED }}>
              {meta.ogText}
            </div>
          </div>

          <div style={{ fontSize: 24, color: MUTED }}>{SITE_HOST}</div>
        </div>

        {/* ფოტოები: კერამიკა, ნახატი, სამკაული */}
        <Photo src={photoA} rotate={-6} top={64} left={690} width={270} height={340} />
        <Photo src={photoB} rotate={5} top={96} left={950} width={220} height={285} />
        <Photo src={photoC} rotate={-3} top={372} left={760} width={290} height={235} />
      </div>
    ),
    {
      ...size,
      fonts: [
        { name: "Serif", data: serif, weight: 700, style: "normal" },
        { name: "Sans", data: sans, weight: 500, style: "normal" },
      ],
    },
  );
}
