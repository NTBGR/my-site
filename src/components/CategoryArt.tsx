import type { ReactNode } from "react";

// კატეგორიის ილუსტრაცია: პატარა ნატურმორტი კატეგორიის ფერში (ფონი, საგანი, ჩრდილი)
const mix = (color: string, other: string, pct: number) =>
  `color-mix(in srgb, ${color}, ${other} ${pct}%)`;

type Palette = { cream: string; light: string; dark: string; deep: string };

function necklaceBeads() {
  const beads: { x: number; y: number }[] = [];
  for (let i = 1; i < 12; i++) {
    const t = i / 12;
    const u = 1 - t;
    beads.push({
      x: 100 * u * u + 400 * t * u + 300 * t * t,
      y: 70 * u * u + 330 * t * u + 70 * t * t,
    });
  }
  return beads;
}

// საგნის ქვეშ რბილი ჩრდილი
const Shadow = ({ c, cx = 200, rx = 110, y = 246 }: { c: Palette; cx?: number; rx?: number; y?: number }) => (
  <ellipse cx={cx} cy={y} rx={rx} ry="9" fill={c.deep} opacity=".35" />
);

function scene(slug: string, c: Palette) {
  const { cream, light, dark, deep } = c;
  const scenes: Record<string, ReactNode> = {
    // ნახატი ჩარჩოში, ლურსმანზე ჩამოკიდებული
    nakhatebi: (
      <>
        <path d="M168 54L200 30L232 54" stroke={cream} strokeWidth="2.5" fill="none" opacity=".8" />
        <circle cx="200" cy="30" r="4" fill={cream} />
        <rect x="134" y="60" width="148" height="186" rx="8" fill={deep} opacity=".3" />
        <rect x="126" y="52" width="148" height="186" rx="8" fill={cream} />
        <rect x="140" y="66" width="120" height="158" rx="3" fill={light} />
        <circle cx="228" cy="104" r="15" fill={cream} />
        <path d="M140 186L176 132L200 162L222 140L260 184V224H140Z" fill={dark} opacity=".55" />
        <path d="M140 224V198Q176 176 210 196T260 192V224Z" fill={dark} opacity=".9" />
      </>
    ),
    // ორი ჩაკეტილი ბეჭედი თვლით, ყუთზე
    bechdebi: (
      <>
        <Shadow c={c} rx={90} />
        <rect x="130" y="204" width="140" height="40" rx="8" fill={dark} opacity=".75" />
        <rect x="130" y="204" width="140" height="10" rx="5" fill={cream} opacity=".25" />
        <circle cx="178" cy="160" r="44" fill="none" stroke={cream} strokeWidth="12" />
        <circle cx="222" cy="160" r="44" fill="none" stroke={light} strokeWidth="12" />
        <path d="M209 120A44 44 0 0 1 221 158" stroke={cream} strokeWidth="12" fill="none" />
        <polygon points="164,108 171,96 185,96 192,108 178,126" fill={cream} />
        <path d="M164 108H192M171 96L178 108L185 96M178 108V126" stroke={dark} strokeWidth="1.6" fill="none" opacity=".45" />
        <path d="M262 84l3 9 9 3-9 3-3 9-3-9-9-3 9-3z" fill={cream} opacity=".85" />
        <path d="M128 106l2 6 6 2-6 2-2 6-2-6-6-2 6-2z" fill={cream} opacity=".6" />
      </>
    ),
    // მაღალი ვაზა, დოქი და თასი თაროზე
    keramika: (
      <>
        <Shadow c={c} rx={130} />
        <path d="M118 244C88 196 118 162 138 146V108H128V96H170V108H160V146C180 162 210 196 180 244Z" fill={cream} />
        <path d="M104 196Q150 210 194 196" stroke={dark} strokeWidth="4" fill="none" opacity=".35" />
        <path d="M108 212Q150 224 192 212" stroke={dark} strokeWidth="2.5" fill="none" opacity=".25" />
        <path d="M222 244C204 214 214 188 232 176V158H262V176C280 188 290 214 272 244Z" fill={light} />
        <path d="M262 168C292 168 296 206 270 214" stroke={light} strokeWidth="7" fill="none" />
        <path d="M216 210Q247 220 278 210" stroke={dark} strokeWidth="3" fill="none" opacity=".3" />
        <path d="M282 222H340Q336 246 311 246Q286 246 282 222Z" fill={cream} />
        <path d="M285 230H337" stroke={dark} strokeWidth="2.5" opacity=".3" />
        <rect x="70" y="244" width="280" height="6" rx="3" fill={deep} opacity=".55" />
      </>
    ),
    // ბიუსტი კვარცხლბეკზე
    skulptura: (
      <>
        <circle cx="200" cy="140" r="96" fill={light} opacity=".18" />
        <Shadow c={c} rx={70} />
        <rect x="156" y="204" width="88" height="42" rx="4" fill={dark} opacity=".8" />
        <rect x="148" y="196" width="104" height="12" rx="4" fill={cream} opacity=".55" />
        <path d="M146 196Q146 162 186 156H214Q254 162 254 196Z" fill={cream} />
        <rect x="188" y="134" width="24" height="26" fill={cream} />
        <ellipse cx="200" cy="112" rx="27" ry="33" fill={cream} />
        <path d="M200 79A27 33 0 0 1 200 145A20 33 0 0 0 200 79Z" fill={deep} opacity=".14" />
        <path d="M228 168Q252 174 254 196H222Z" fill={deep} opacity=".12" />
      </>
    ),
    // ყელსაბამი მძივებით და გულსაკიდით
    samkauli: (
      <>
        <path d="M100 70Q200 330 300 70" stroke={cream} strokeWidth="3" fill="none" opacity=".9" />
        {necklaceBeads().map((b, i) => (
          <circle key={i} cx={b.x} cy={b.y} r={i % 2 ? 7 : 4.5} fill={i % 2 ? light : cream} />
        ))}
        <path d="M200 196C178 222 182 248 200 252C218 248 222 222 200 196Z" fill={light} />
        <path d="M200 206C190 222 192 238 200 242" stroke={cream} strokeWidth="3" fill="none" opacity=".7" />
        <circle cx="200" cy="198" r="6" fill={cream} />
        <path d="M118 210l2 6 6 2-6 2-2 6-2-6-6-2 6-2z" fill={cream} opacity=".6" />
        <path d="M286 196l3 8 8 3-8 3-3 8-3-8-8-3 8-3z" fill={cream} opacity=".8" />
      </>
    ),
    // დაკეცილი ქსოვილები და ძაფის გორგალი
    tekstili: (
      <>
        <Shadow c={c} rx={120} />
        <rect x="104" y="208" width="176" height="36" rx="10" fill={dark} opacity=".85" />
        <path d="M116 226H268" stroke={cream} strokeWidth="3" strokeDasharray="10 7" opacity=".6" />
        <rect x="114" y="176" width="160" height="34" rx="10" fill={cream} />
        <path d="M130 193l8-8 8 8 8-8 8 8 8-8 8 8 8-8 8 8 8-8 8 8 8-8 8 8 8-8 8 8 8-8 8 8" stroke={light} strokeWidth="3" fill="none" />
        <rect x="124" y="146" width="140" height="32" rx="10" fill={light} />
        <path d="M138 162H250" stroke={cream} strokeWidth="5" opacity=".55" strokeLinecap="round" />
        <circle cx="300" cy="216" r="28" fill={cream} />
        <path d="M278 202Q300 214 322 204M274 218Q300 230 326 218M282 234Q300 240 318 232" stroke={light} strokeWidth="2.5" fill="none" />
        <path d="M318 196L352 150" stroke={dark} strokeWidth="4" strokeLinecap="round" />
      </>
    ),
    // ტყავის ჩანთა ბალთით და ნაკერით
    tyavi: (
      <>
        <Shadow c={c} rx={100} />
        <path d="M158 122V102a42 42 0 0 1 84 0V122" stroke={dark} strokeWidth="11" fill="none" />
        <rect x="116" y="118" width="168" height="126" rx="20" fill={cream} />
        <path d="M128 128H272" stroke={dark} strokeWidth="2" strokeDasharray="5 5" opacity=".35" />
        <path d="M116 140Q116 118 138 118H262Q284 118 284 140V164Q200 196 116 164Z" fill={light} />
        <path d="M126 158Q200 186 274 158" stroke={cream} strokeWidth="2" strokeDasharray="5 5" fill="none" opacity=".6" />
        <rect x="187" y="166" width="26" height="22" rx="5" fill="none" stroke={dark} strokeWidth="4" />
        <path d="M134 228H266" stroke={dark} strokeWidth="2" strokeDasharray="5 5" opacity=".35" />
      </>
    ),
    // საჭრელი დაფა ძარღვებით და ხის კოვზი
    "khis-nakethobebi": (
      <>
        <Shadow c={c} rx={120} />
        <rect x="104" y="80" width="124" height="164" rx="24" fill={cream} />
        <circle cx="166" cy="106" r="9" fill={dark} opacity=".55" />
        <path d="M126 140Q150 150 140 180T150 230M160 136Q180 160 168 196T180 236M196 140Q210 170 200 200" stroke={light} strokeWidth="2.5" fill="none" opacity=".9" />
        <ellipse cx="166" cy="168" rx="10" ry="6" fill="none" stroke={light} strokeWidth="2.5" />
        <g transform="rotate(14 272 170)">
          <ellipse cx="272" cy="118" rx="25" ry="35" fill={light} />
          <ellipse cx="272" cy="116" rx="16" ry="24" fill={dark} opacity=".25" />
          <rect x="265" y="148" width="14" height="96" rx="7" fill={light} />
        </g>
      </>
    ),
    // სანთლები ალით და პატარა ვაზა ყლორტით
    "saxlis-dekori": (
      <>
        <path d="M110 246V140a90 90 0 0 1 180 0V246Z" fill={deep} opacity=".22" />
        <Shadow c={c} rx={100} />
        <circle cx="178" cy="122" r="24" fill={cream} opacity=".18" />
        <rect x="160" y="160" width="36" height="86" rx="6" fill={cream} />
        <path d="M178 120C166 136 169 150 178 154C187 150 190 136 178 120Z" fill={cream} />
        <path d="M178 134C173 142 174 148 178 150C182 148 183 142 178 134Z" fill={light} />
        <rect x="206" y="196" width="28" height="50" rx="6" fill={light} />
        <path d="M220 168C214 176 215 184 220 186C225 184 226 176 220 168Z" fill={cream} />
        <path d="M262 246C250 228 258 214 266 208V196H280V208C288 214 296 228 284 246Z" fill={cream} />
        <path d="M273 196C270 170 258 158 246 150M273 190C278 168 290 158 300 154" stroke={light} strokeWidth="3" fill="none" strokeLinecap="round" />
        <ellipse cx="248" cy="150" rx="7" ry="4" fill={light} transform="rotate(30 248 150)" />
        <ellipse cx="300" cy="153" rx="7" ry="4" fill={light} transform="rotate(-25 300 153)" />
      </>
    ),
    // საჩუქრის ყუთი ბაფთით და ბარათით
    sachuqrebi: (
      <>
        <Shadow c={c} rx={110} />
        <rect x="126" y="148" width="148" height="98" rx="8" fill={cream} />
        <rect x="116" y="124" width="168" height="32" rx="8" fill={light} />
        <rect x="190" y="124" width="20" height="122" fill={dark} opacity=".6" />
        <path d="M200 124C152 64 118 112 200 124Z" fill={dark} opacity=".8" />
        <path d="M200 124C248 64 282 112 200 124Z" fill={dark} opacity=".8" />
        <circle cx="200" cy="122" r="9" fill={dark} />
        <g transform="rotate(-10 300 200)">
          <rect x="280" y="176" width="54" height="40" rx="5" fill={cream} />
          <path d="M290 190H322M290 200H314" stroke={light} strokeWidth="3" strokeLinecap="round" />
        </g>
        <path d="M274 190Q284 186 286 182" stroke={cream} strokeWidth="2" fill="none" />
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
  const palette: Palette = {
    cream: mix(color, "#fff6e8", 82),
    light: mix(color, "white", 38),
    dark: mix(color, "black", 34),
    deep: mix(color, "black", 60),
  };

  return (
    <div
      className={`grain ${className.includes("absolute") ? "" : "relative"} overflow-hidden ${className}`.trim()}
      style={{
        background: `radial-gradient(120% 90% at 30% 20%, ${mix(color, "white", 22)}, ${color} 55%, ${mix(color, "black", 28)})`,
      }}
    >
      <svg
        viewBox="0 0 400 300"
        preserveAspectRatio="xMidYMid slice"
        className="zoom-on-hover absolute inset-0 h-full w-full"
        aria-hidden
      >
        <circle cx="52" cy="48" r="3" fill={palette.cream} opacity=".5" />
        <circle cx="352" cy="64" r="4" fill={palette.light} opacity=".45" />
        <circle cx="336" cy="254" r="2.5" fill={palette.cream} opacity=".5" />
        <circle cx="62" cy="238" r="3.5" fill={palette.light} opacity=".4" />
        {scene(slug, palette)}
      </svg>
      {children ? <div className="relative z-10 h-full">{children}</div> : null}
    </div>
  );
}
