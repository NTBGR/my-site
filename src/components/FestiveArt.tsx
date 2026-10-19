// საახალწლო ბანერის სამი ილუსტრაცია (წინდა, საჩუქარი, ნაძვის ხე): ბანერზე კატეგორიების ფოტოების ნაცვლად
const BG = ["#f4e3d0", "#e6efe3", "#f3dcdc"];

export default function FestiveArt({ kind, className = "" }: { kind: number; className?: string }) {
  const bg = BG[kind % BG.length];
  return (
    <svg viewBox="0 0 160 120" role="img" aria-hidden className={`block w-full ${className}`} xmlns="http://www.w3.org/2000/svg">
      <rect width="160" height="120" fill={bg} />
      {kind % 3 === 0 ? (
        // საახალწლო წინდა
        <g>
          <path d="M60 24h40v42c0 10-5 16-13 22l-22 16c-9 7-22-4-14-13l20-17c3-3 3-7 3-11z" fill="#c8372d" />
          <path d="M44 100c-4-8 2-14 8-18l16-12 8 10-14 12c-5 4-12 6-18 8z" fill="#fff" opacity=".92" />
          <rect x="56" y="14" width="48" height="16" rx="8" fill="#fff" />
          <circle cx="82" cy="56" r="3.2" fill="#f2c94c" />
          <circle cx="82" cy="70" r="3.2" fill="#2f6b4a" />
          <path d="M118 30l3 7 7 .6-5.4 4.6 1.8 7-6.4-4-6.4 4 1.8-7-5.4-4.6 7-.6z" fill="#f2c94c" />
        </g>
      ) : kind % 3 === 1 ? (
        // საჩუქარი ბაფთით
        <g>
          <rect x="40" y="56" width="80" height="50" rx="4" fill="#2f6b4a" />
          <rect x="34" y="44" width="92" height="18" rx="4" fill="#c8372d" />
          <rect x="74" y="44" width="12" height="62" fill="#f2c94c" />
          <ellipse cx="64" cy="36" rx="16" ry="10" transform="rotate(-24 64 36)" fill="#f2c94c" />
          <ellipse cx="96" cy="36" rx="16" ry="10" transform="rotate(24 96 36)" fill="#f2c94c" />
          <circle cx="80" cy="42" r="6" fill="#d9a82b" />
          <circle cx="132" cy="22" r="2.4" fill="#fff" />
          <circle cx="24" cy="30" r="2" fill="#fff" />
        </g>
      ) : (
        // ნაძვის ხე
        <g>
          <polygon points="80,22 52,56 108,56" fill="#2f6b4a" />
          <polygon points="80,38 44,76 116,76" fill="#3a8460" />
          <polygon points="80,56 36,98 124,98" fill="#2f6b4a" />
          <rect x="73" y="98" width="14" height="12" fill="#7a4b2a" />
          <path d="M80 8l3.4 7.6 8.2.8-6.2 5.4 1.8 8.1L80 25.8l-7.2 4.1 1.8-8.1-6.2-5.4 8.2-.8z" fill="#f2c94c" />
          <circle cx="68" cy="62" r="4" fill="#c8372d" />
          <circle cx="92" cy="70" r="4" fill="#f2c94c" />
          <circle cx="60" cy="86" r="4.4" fill="#f2c94c" />
          <circle cx="100" cy="90" r="4.4" fill="#c8372d" />
          <circle cx="82" cy="84" r="4" fill="#fff" />
        </g>
      )}
    </svg>
  );
}
