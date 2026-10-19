// საახალწლო ბანერის სამი ნახატი: საჩუქრები საახალწლო შეფუთვაში (ბაფთიანი ყუთები, წინდა საჩუქრებით, ყუთი ბარდის ფოთლებით)
const BG = ["#f8e8d4", "#e4eee2", "#f6dede"];

function Snow() {
  return (
    <g fill="#fff" opacity=".9">
      <circle cx="16" cy="18" r="2" />
      <circle cx="146" cy="14" r="2.4" />
      <circle cx="134" cy="48" r="1.6" />
      <circle cx="26" cy="62" r="1.6" />
      <circle cx="148" cy="86" r="2" />
      <circle cx="12" cy="96" r="2.2" />
    </g>
  );
}

function Bow({ cx, cy, scale = 1, color = "#d9a82b", dark = "#b9861a" }: { cx: number; cy: number; scale?: number; color?: string; dark?: string }) {
  return (
    <g transform={`translate(${cx} ${cy}) scale(${scale})`}>
      <path d="M0 0C-8 -16 -30 -18 -29 -6C-28 6 -10 4 0 0z" fill={color} />
      <path d="M0 0C8 -16 30 -18 29 -6C28 6 10 4 0 0z" fill={dark} />
      <path d="M0 0l-9 16 9-5 9 5z" fill={dark} />
      <circle cx="0" cy="-1" r="5" fill={color} />
    </g>
  );
}

export default function FestiveArt({ kind, className = "" }: { kind: number; className?: string }) {
  const k = kind % 3;
  return (
    <svg viewBox="0 0 160 120" role="img" aria-hidden className={`block w-full ${className}`} xmlns="http://www.w3.org/2000/svg">
      <rect width="160" height="120" fill={BG[k]} />
      <Snow />
      <ellipse cx="80" cy="108" rx="62" ry="6" fill="#000" opacity=".1" />
      {k === 0 ? (
        <g>
          {/* დიდი წითელი ყუთი ოქროს ლენტით */}
          <rect x="36" y="52" width="68" height="54" rx="4" fill="#c8372d" />
          <rect x="36" y="52" width="68" height="10" rx="4" fill="#a82a21" />
          <rect x="64" y="52" width="12" height="54" fill="#e5b93b" />
          <rect x="30" y="40" width="80" height="18" rx="4" fill="#d6453a" />
          <rect x="64" y="40" width="12" height="18" fill="#e5b93b" />
          <Bow cx={70} cy={38} scale={1.05} />
          {/* პატარა მწვანე ყუთი თეთრი ლენტით */}
          <rect x="104" y="76" width="34" height="30" rx="3" fill="#2f6b4a" />
          <rect x="104" y="70" width="38" height="10" rx="3" fill="#3a8460" />
          <rect x="118" y="70" width="8" height="36" fill="#fff" opacity=".95" />
          <Bow cx={122} cy={69} scale={0.55} color="#fff" dark="#e3d9c6" />
          {/* ნაძვის ტოტი */}
          <g stroke="#2f6b4a" strokeWidth="3" strokeLinecap="round">
            <path d="M44 60l-14 -8M44 66l-16 2M44 72l-14 8M44 60v22" />
          </g>
          <circle cx="40" cy="50" r="3" fill="#c8372d" />
        </g>
      ) : k === 1 ? (
        <g>
          <path d="M80 6v10" stroke="#e5b93b" strokeWidth="2" />
          {/* წითელი წინდა თეთრი მანჟეტით */}
          <path d="M58 22h44v44c0 12-6 20-16 26l-22 14c-10 6-24-6-16-16l20-18c3-3 4-6 4-10z" fill="#c8372d" />
          <path d="M82 70c0 14-8 20-16 28l-16 16c-6-4-8-12-4-18l20-18c3-3 4-6 4-10z" fill="#a82a21" opacity=".55" />
          <rect x="52" y="14" width="56" height="18" rx="9" fill="#fff" />
          <circle cx="70" cy="45" r="3.4" fill="#e5b93b" />
          <circle cx="82" cy="58" r="3.4" fill="#2f6b4a" />
          {/* ამოჩრილი საჩუქარი და კანფეტი */}
          <rect x="84" y="2" width="22" height="20" rx="2" fill="#2f6b4a" />
          <rect x="93" y="2" width="4" height="20" fill="#fff" />
          <path d="M70 18V2c0-6 10-6 10 0" fill="none" stroke="#fff" strokeWidth="4" strokeLinecap="round" />
          <path d="M70 12l10-3M70 6l10-3" stroke="#c8372d" strokeWidth="2.4" />
          <path d="M126 24l3 7 7 .6-5.4 4.6 1.8 7-6.4-4-6.4 4 1.8-7-5.4-4.6 7-.6z" fill="#e5b93b" />
        </g>
      ) : (
        <g>
          {/* მწვანე ყუთი წითელი ლენტით და ბარდის ფოთლებით */}
          <rect x="38" y="54" width="84" height="52" rx="4" fill="#2f6b4a" />
          <rect x="38" y="54" width="84" height="10" rx="4" fill="#245a3d" />
          <rect x="74" y="54" width="12" height="52" fill="#d6453a" />
          <rect x="32" y="42" width="96" height="18" rx="4" fill="#3a8460" />
          <rect x="74" y="42" width="12" height="18" fill="#d6453a" />
          <Bow cx={80} cy={40} scale={1} color="#d6453a" dark="#a82a21" />
          <g>
            <path d="M92 36c8-10 18-8 20-2-6 8-16 8-20 2z" fill="#1f5a42" />
            <path d="M100 30c4-10 14-12 18-6-4 8-12 10-18 6z" fill="#2f6b4a" />
            <circle cx="98" cy="36" r="3" fill="#c8372d" />
            <circle cx="103" cy="39" r="3" fill="#c8372d" />
          </g>
          {/* ნაძვის სათამაშო */}
          <circle cx="30" cy="92" r="11" fill="#c8372d" />
          <rect x="26" y="78" width="8" height="5" rx="1" fill="#e5b93b" />
          <circle cx="27" cy="89" r="3" fill="#fff" opacity=".45" />
        </g>
      )}
    </svg>
  );
}
