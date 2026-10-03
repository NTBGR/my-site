import type { ReactNode } from "react";

// ნამუშევრის ადგილმჭერი: ფერისგან აგებული აბსტრაქტული კომპოზიცია
export function variantFor(seed: string) {
  let sum = 0;
  for (const ch of seed) sum += ch.charCodeAt(0);
  return sum % 4;
}

const mix = (color: string, other: string, pct: number) =>
  `color-mix(in srgb, ${color}, ${other} ${pct}%)`;

export default function ArtTile({
  color,
  variant = 0,
  className = "",
  children,
}: {
  color: string;
  variant?: number;
  className?: string;
  children?: ReactNode;
}) {
  const light = mix(color, "white", 28);
  const dark = mix(color, "black", 26);

  return (
    <div
      className={`grain ${className.includes("absolute") ? "" : "relative"} overflow-hidden ${className}`.trim()}
      style={{
        background: `linear-gradient(150deg, ${mix(color, "white", 16)}, ${color} 52%, ${mix(color, "black", 30)})`,
      }}
    >
      <div className="zoom-on-hover absolute inset-0" aria-hidden>
        {variant === 0 && (
          <>
            <span
              className="absolute -bottom-[28%] -right-[18%] aspect-square w-[78%] rounded-full"
              style={{ background: light, opacity: 0.55 }}
            />
            <span
              className="absolute left-[12%] top-[14%] aspect-square w-[22%] rounded-full"
              style={{ background: dark, opacity: 0.45 }}
            />
          </>
        )}
        {variant === 1 && (
          <>
            <span
              className="absolute bottom-0 left-1/2 h-[64%] w-[52%] -translate-x-1/2 rounded-t-full"
              style={{ background: dark, opacity: 0.5 }}
            />
            <span
              className="absolute bottom-0 left-1/2 h-[40%] w-[30%] -translate-x-1/2 rounded-t-full"
              style={{ background: light, opacity: 0.6 }}
            />
          </>
        )}
        {variant === 2 && (
          <>
            <span
              className="absolute right-[14%] top-[16%] aspect-square w-[30%] rounded-full"
              style={{ background: light, opacity: 0.8 }}
            />
            <span
              className="absolute inset-x-0 bottom-0 h-[38%]"
              style={{ background: dark, opacity: 0.45 }}
            />
            <span
              className="absolute inset-x-0 bottom-[38%] h-[14%]"
              style={{ background: light, opacity: 0.3 }}
            />
          </>
        )}
        {variant === 3 && (
          <>
            <span
              className="absolute left-1/2 top-1/2 aspect-square w-[74%] -translate-x-1/2 -translate-y-1/2 rounded-full border-[14px]"
              style={{ borderColor: light, opacity: 0.5 }}
            />
            <span
              className="absolute left-1/2 top-1/2 aspect-square w-[34%] -translate-x-1/2 -translate-y-1/2 rounded-full"
              style={{ background: dark, opacity: 0.5 }}
            />
          </>
        )}
      </div>
      {children ? <div className="relative z-10 h-full">{children}</div> : null}
    </div>
  );
}
