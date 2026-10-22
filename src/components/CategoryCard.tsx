import Link from "next/link";
import CategoryArt from "@/components/CategoryArt";

// კატეგორიის ბარათი (მთავარის კარუსელი და კატეგორიების გვერდი): ფოტო ბუნებრივ ფერში, კრემისფერ ჩარჩოში („ამობეჭდილი“),
// ქვემოთ სახელი. კატეგორიის ფერი მხოლოდ აქცენტია: წერტილი რაოდენობასთან და ისრის წრე
export default function CategoryCard({
  slug,
  name,
  color,
  label,
  badge,
  muted = false,
  className = "",
}: {
  slug: string;
  name: string;
  color: string;
  // ბმულის სრული სახელი ეკრანის წამკითხველისთვის („ნახატები · დაათვალიერე“)
  label: string;
  // ქვედა წარწერა: ხელოვანების რაოდენობა ან „მალე“ ცარიელ კატეგორიაზე
  badge?: string;
  // ცარიელი კატეგორია: წარწერა მკრთალია
  muted?: boolean;
  className?: string;
}) {
  return (
    <Link
      href={`/categories/${slug}`}
      aria-label={label}
      className={`group flex h-full flex-col rounded-[1.6rem] border border-border bg-surface p-2 shadow-[0_14px_30px_-24px_rgb(60_40_20/0.6)] transition duration-300 hover:-translate-y-1.5 hover:border-[color:var(--c)] hover:shadow-[0_26px_40px_-24px_rgb(60_40_20/0.7)] active:scale-[0.99] sm:p-2.5 ${className}`.trim()}
      style={{ ["--c" as string]: color }}
    >
      <div className="relative aspect-[4/5] overflow-hidden rounded-[1.15rem] bg-surface-2">
        <div aria-hidden className="absolute inset-0 transition duration-700 ease-out group-hover:scale-[1.06]">
          <CategoryArt slug={slug} color={color} still className="absolute inset-0 h-full w-full" />
        </div>
        {/* ისარი ფოტოს კუთხეშია (არა ქვემოთ), რომ კარუსელის ისრებში არ აერიოს */}
        <span
          aria-hidden
          className="absolute right-2.5 top-2.5 z-10 hidden h-9 w-9 items-center justify-center rounded-full bg-white/90 text-[#2a1d17] shadow-md backdrop-blur transition duration-300 group-hover:bg-[color:var(--c)] group-hover:text-white sm:flex"
        >
          <span className="arrow-slide">→</span>
        </span>
      </div>
      <div className="flex flex-1 items-end justify-between gap-3 px-1.5 pb-1 pt-3 sm:px-2 sm:pt-3.5">
        <div className="min-w-0">
          <h3 className="line-clamp-2 min-h-[2.75em] font-serif text-base font-semibold leading-snug tracking-tight text-text [overflow-wrap:break-word] sm:text-lg">
            {name}
          </h3>
          {badge ? (
            <p className={`mt-1 flex items-center gap-1.5 whitespace-nowrap text-xs font-medium text-muted`}>
              <span aria-hidden className={`h-2 w-2 shrink-0 rounded-full ${muted ? "opacity-40" : ""}`} style={{ background: color }} />
              {badge}
            </p>
          ) : null}
        </div>
      </div>
    </Link>
  );
}
