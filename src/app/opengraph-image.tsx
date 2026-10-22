import { ImageResponse } from "next/og";
import { SITE_HOST, SITE_URL } from "@/lib/site";
import { dictionary } from "@/lib/dictionary";

// გაზიარების სურათი (ფეისბუქი, მესენჯერი, ვაიბერი...): ბოტებს ენის ქუქი არ აქვთ, ამიტომ ქართულია
export const runtime = "edge";
export const alt = dictionary.ka.meta.shareTitle;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

// ბილდმა ფონტები რომ იპოვოს, მისამართები სტატიკური უნდა იყოს
const loadFont = (url: URL) => fetch(url).then((res) => res.arrayBuffer());

// ფოტოებს საიტის სტატიკური ფაილებიდან ვიღებთ (edge ფუნქციის ზომა 1MB-ს არ უნდა აღემატებოდეს, ფოტოების ჩაშენება კი გადააჭარბებდა)
const toDataUrl = async (url: string) => {
  const buffer: ArrayBuffer = await (await fetch(url)).arrayBuffer();
  const bytes = new Uint8Array(buffer);
  let binary = "";
  for (let i = 0; i < bytes.length; i += 0x8000) binary += String.fromCharCode(...bytes.subarray(i, i + 0x8000));
  return "data:image/jpeg;base64," + btoa(binary);
};

const BG = "#f6f1ea";
const TEXT = "#1d1a17";
const MUTED = "#6a6158";
const ACCENT = "#b84a24";

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

// ტექსტი ცენტრშია: მესენჯერი, ვოთსაპი და ვაიბერი სურათს შუიდან ჭრიან (კვადრატამდე), კიდეები იკარგება.
// ლოგო და სათაური ცენტრალურ 600px-ში დგას, ფოტოები კი კიდეებზეა (მოჭრისას მხოლოდ ისინი იკარგება)
export default async function OpengraphImage() {
  const [photoA, photoB, photoC, photoD] = await Promise.all([
    toDataUrl(`${SITE_URL}/categories/keramika-main.jpg`),
    toDataUrl(`${SITE_URL}/categories/nakhatebi.jpg`),
    toDataUrl(`${SITE_URL}/categories/samkauli.jpg`),
    toDataUrl(`${SITE_URL}/categories/posterebi.jpg`),
  ]);
  const [serif, sans] = await Promise.all([
    loadFont(new URL("../assets/og-fonts/NotoSerifGeorgian-Bold.ttf", import.meta.url)),
    loadFont(new URL("../assets/og-fonts/NotoSansGeorgian-Medium.ttf", import.meta.url)),
  ]);
  const { meta } = dictionary.ka;

  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", position: "relative", background: BG, fontFamily: "Sans" }}>
        {/* ფოტოები კიდეებზე: მარცხნივ კერამიკა და სამკაული, მარჯვნივ ნახატი და პოსტერი */}
        <Photo src={photoA} rotate={-7} top={58} left={34} width={220} height={280} />
        <Photo src={photoC} rotate={5} top={360} left={70} width={200} height={220} />
        <Photo src={photoB} rotate={6} top={52} left={946} width={210} height={270} />
        <Photo src={photoD} rotate={-4} top={350} left={930} width={210} height={240} />

        {/* ტექსტი ცენტრში */}
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
          <div style={{ display: "flex", fontFamily: "Serif", fontSize: 58, color: TEXT }}>
            ხელოვანი<span style={{ color: ACCENT }}>.</span>
          </div>
          <svg width="250" height="14" viewBox="0 0 86 7" style={{ marginTop: 6 }}>
            <path d="M2 5 C20 1, 40 1, 84 3" stroke={ACCENT} strokeWidth="2.8" fill="none" strokeLinecap="round" />
          </svg>
          <div style={{ marginTop: 44, fontFamily: "Serif", fontSize: 84, lineHeight: 1.08, color: TEXT, letterSpacing: -1 }}>{meta.ogTagline}</div>
          <div style={{ marginTop: 22, fontSize: 30, lineHeight: 1.35, color: MUTED }}>{meta.ogText}</div>
          <div style={{ marginTop: 30, fontSize: 24, color: ACCENT }}>{SITE_HOST}</div>
        </div>
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
