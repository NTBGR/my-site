import type { ReactNode } from "react";

// კატეგორიის აბსტრაქტული ილუსტრაცია: ფერისგან აგებული გეომეტრიული სცენა
const mix = (color: string, other: string, pct: number) =>
  `color-mix(in srgb, ${color}, ${other} ${pct}%)`;

function necklaceBeads() {
  const beads: { x: number; y: number }[] = [];
  for (let i = 1; i < 10; i++) {
    const t = i / 10;
    const u = 1 - t;
    beads.push({
      x: 95 * u * u + 400 * t * u + 305 * t * t,
      y: 90 * u * u + 540 * t * u + 90 * t * t,
    });
  }
  return beads;
}

function scene(slug: string, c: { cream: string; light: string; dark: string }) {
  const { cream, light, dark } = c;
  const scenes: Record<string, ReactNode> = {
    nakhatebi: (
      <>
        <rect x="130" y="55" width="140" height="190" rx="8" fill="none" stroke={cream} strokeWidth="8" />
        <rect x="138" y="63" width="124" height="174" fill={dark} opacity=".35" />
        <circle cx="200" cy="120" r="26" fill={cream} />
        <path d="M138 237V190Q170 150 200 185T262 175V237Z" fill={light} />
        <path d="M138 237V210Q180 185 262 215V237Z" fill={dark} opacity=".7" />
      </>
    ),
    bechdebi: (
      <>
        <circle cx="175" cy="175" r="52" fill="none" stroke={cream} strokeWidth="14" />
        <circle cx="225" cy="175" r="52" fill="none" stroke={light} strokeWidth="14" opacity=".9" />
        <polygon points="200,66 226,90 200,124 174,90" fill={cream} />
        <path d="M174 90H226M200 66L189 90L200 124L211 90Z" stroke={dark} strokeWidth="2" fill="none" opacity=".6" />
      </>
    ),
    keramika: (
      <>
        <path d="M110 245C80 190 120 160 140 140V110H170V140C190 160 215 190 185 245Z" fill={cream} />
        <path d="M104 205Q150 218 190 205" stroke={dark} strokeWidth="4" fill="none" opacity=".4" />
        <path d="M235 245C215 200 240 175 252 160V95H276V160C290 175 305 205 285 245Z" fill={light} />
        <path d="M232 215Q262 225 290 215" stroke={dark} strokeWidth="4" fill="none" opacity=".35" />
        <rect x="70" y="245" width="260" height="6" rx="3" fill={dark} opacity=".6" />
      </>
    ),
    skulptura: (
      <>
        <circle cx="200" cy="150" r="64" fill="none" stroke={light} strokeWidth="4" opacity=".6" />
        <rect x="150" y="215" width="100" height="28" rx="4" fill={dark} opacity=".7" />
        <path d="M165 215V150a35 35 0 0 1 70 0V215Z" fill={cream} />
        <circle cx="200" cy="96" r="22" fill={light} />
      </>
    ),
    samkauli: (
      <>
        <path d="M95 90Q200 270 305 90" stroke={cream} strokeWidth="4" fill="none" />
        {necklaceBeads().map((b, i) => (
          <circle key={i} cx={b.x} cy={b.y} r={i % 2 ? 7 : 5} fill={i % 2 ? light : cream} />
        ))}
        <path d="M200 188C180 212 182 236 200 240C218 236 220 212 200 188Z" fill={light} />
        <circle cx="200" cy="218" r="6" fill={dark} opacity=".6" />
      </>
    ),
    tekstili: (
      <>
        {[100, 132, 164, 196, 228].map((y, i) => (
          <path
            key={y}
            d={`M50 ${y}Q105 ${y - 28} 160 ${y}T270 ${y}T350 ${y}`}
            stroke={[cream, light, dark, light, cream][i]}
            strokeWidth="18"
            strokeLinecap="round"
            fill="none"
            opacity={i === 2 ? 0.55 : 0.92}
          />
        ))}
      </>
    ),
    tyavi: (
      <>
        <path d="M160 120V100a40 40 0 0 1 80 0V120" stroke={dark} strokeWidth="10" fill="none" opacity=".75" />
        <rect x="120" y="120" width="160" height="115" rx="18" fill={cream} />
        <path d="M120 138Q120 120 138 120H262Q280 120 280 138V160Q200 190 120 160Z" fill={light} />
        <circle cx="200" cy="178" r="9" fill={dark} opacity=".75" />
        <path d="M135 215H265" stroke={dark} strokeWidth="3" strokeDasharray="6 6" opacity=".5" />
      </>
    ),
    "khis-nakethobebi": (
      <>
        <rect x="110" y="90" width="110" height="150" rx="22" fill={cream} />
        <circle cx="165" cy="114" r="8" fill={dark} opacity=".5" />
        <path d="M130 150H200M130 175H200M130 200H188" stroke={dark} strokeWidth="3" strokeLinecap="round" opacity=".28" />
        <g transform="rotate(12 265 190)">
          <ellipse cx="265" cy="135" rx="24" ry="34" fill={light} />
          <rect x="259" y="165" width="12" height="80" rx="6" fill={light} />
        </g>
      </>
    ),
    "saxlis-dekori": (
      <>
        <path d="M110 245V140a90 90 0 0 1 180 0V245Z" fill={dark} opacity=".35" />
        <path d="M122 245V140a78 78 0 0 1 156 0V245" fill="none" stroke={cream} strokeWidth="6" />
        <rect x="175" y="170" width="50" height="75" rx="6" fill={cream} />
        <path d="M200 120C184 142 188 160 200 165C212 160 216 142 200 120Z" fill={light} />
        <path d="M245 245C235 225 250 215 258 210V196H270V210C278 215 293 225 283 245Z" fill={light} />
      </>
    ),
    sachuqrebi: (
      <>
        <rect x="125" y="145" width="150" height="100" rx="8" fill={cream} />
        <rect x="115" y="120" width="170" height="34" rx="8" fill={light} />
        <rect x="190" y="120" width="20" height="125" fill={dark} opacity=".55" />
        <path d="M200 120C150 55 118 108 200 120Z" fill={dark} opacity=".75" stroke={cream} strokeWidth="3" />
        <path d="M200 120C250 55 282 108 200 120Z" fill={dark} opacity=".75" stroke={cream} strokeWidth="3" />
      </>
    ),
  };
  return scenes[slug] ?? scenes.nakhatebi;
}

export default function CategoryArt({
  slug,
  color,
  className = "",
  children,
}: {
  slug: string;
  color: string;
  className?: string;
  children?: ReactNode;
}) {
  const palette = {
    cream: mix(color, "#fff6e8", 82),
    light: mix(color, "white", 38),
    dark: mix(color, "black", 34),
  };

  return (
    <div
      className={`grain ${className.includes("absolute") ? "" : "relative"} overflow-hidden ${className}`.trim()}
      style={{
        background: `linear-gradient(150deg, ${mix(color, "white", 16)}, ${color} 52%, ${mix(color, "black", 32)})`,
      }}
    >
      <svg
        viewBox="0 0 400 300"
        preserveAspectRatio="xMidYMid slice"
        className="zoom-on-hover absolute inset-0 h-full w-full"
        aria-hidden
      >
        <circle cx="52" cy="48" r="4" fill={palette.cream} opacity=".6" />
        <circle cx="352" cy="70" r="6" fill={palette.light} opacity=".5" />
        <circle cx="330" cy="248" r="3" fill={palette.cream} opacity=".6" />
        <circle cx="64" cy="236" r="5" fill={palette.light} opacity=".45" />
        {scene(slug, palette)}
      </svg>
      {children ? <div className="relative z-10 h-full">{children}</div> : null}
    </div>
  );
}
