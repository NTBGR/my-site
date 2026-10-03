import { ImageResponse } from "next/og";
import { dictionary } from "@/lib/dictionary";

// გაზიარების სურათი (ფეისბუქი, მესენჯერი, ვაიბერი...): ბოტებს ენის ქუქი არ აქვთ, ამიტომ ქართულია
export const runtime = "edge";
export const alt = dictionary.ka.meta.homeTitle;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

// ბილდმა ფონტები რომ იპოვოს, მისამართები სტატიკური უნდა იყოს
const loadFont = (url: URL) => fetch(url).then((res) => res.arrayBuffer());

const BG = "#f6f1ea";
const TEXT = "#1d1a17";
const MUTED = "#6a6158";
const ACCENT = "#c93f15";

function Tile({
  color,
  rotate,
  top,
  left,
  width,
  height,
  children,
}: {
  color: string;
  rotate: number;
  top: number;
  left: number;
  width: number;
  height: number;
  children: React.ReactNode;
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
        alignItems: "center",
        justifyContent: "center",
        borderRadius: 36,
        background: color,
        transform: `rotate(${rotate}deg)`,
        boxShadow: "0 30px 60px rgba(60, 30, 10, 0.25)",
        border: "6px solid rgba(255,255,255,0.35)",
      }}
    >
      {children}
    </div>
  );
}

export default async function OpengraphImage() {
  const [serif, sans] = await Promise.all([
    loadFont(new URL("../assets/og-fonts/NotoSerifGeorgian-Bold.ttf", import.meta.url)),
    loadFont(new URL("../assets/og-fonts/NotoSansGeorgian-Medium.ttf", import.meta.url)),
  ]);
  const { meta } = dictionary.ka;
  const cream = "#fbf3e6";

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

          <div style={{ fontSize: 24, color: MUTED }}>khelovani.vercel.app</div>
        </div>

        {/* ილუსტრაციები: ბეჭდები, კერამიკა, ნახატი */}
        <Tile color="#3d5a73" rotate={-7} top={70} left={700} width={230} height={290}>
          <svg width="170" height="150" viewBox="0 0 170 150">
            <polygon points="85,6 105,24 85,50 65,24" fill={cream} />
            <circle cx="62" cy="96" r="40" fill="none" stroke={cream} strokeWidth="11" />
            <circle cx="108" cy="96" r="40" fill="none" stroke="#9fb3c4" strokeWidth="11" />
          </svg>
        </Tile>
        <Tile color="#5e7a55" rotate={6} top={110} left={940} width={210} height={260}>
          <svg width="150" height="180" viewBox="0 0 150 180">
            <path d="M20 170C-5 120 30 95 45 80V45H70V80C88 95 110 120 88 170Z" fill={cream} />
            <path d="M100 170C85 135 102 115 112 103V40H130V103C142 115 155 140 140 170Z" fill="#b5c7ad" />
          </svg>
        </Tile>
        <Tile color="#c4553a" rotate={-3} top={360} left={790} width={250} height={200}>
          <svg width="150" height="140" viewBox="0 0 150 140">
            <rect x="10" y="6" width="130" height="128" rx="6" fill="none" stroke={cream} strokeWidth="8" />
            <circle cx="75" cy="50" r="20" fill={cream} />
            <path d="M18 126V95Q50 65 78 90T132 82V126Z" fill="#e8a48f" />
          </svg>
        </Tile>
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
