import Link from "next/link";

export default function Header() {
  return (
    <header className="border-b border-[#eadfd3] bg-[#fffaf4]/90 backdrop-blur-sm">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-4 sm:px-6">
        <Link
          href="/"
          className="text-xl font-semibold tracking-tight text-[#2c2416] sm:text-2xl"
        >
          khelovani
        </Link>
        <nav className="flex items-center gap-4 text-sm sm:gap-6 sm:text-base">
          <Link
            href="/"
            className="text-[#4a4033] transition-colors hover:text-[#c45c3e]"
          >
            მთავარი
          </Link>
          <Link
            href="/artists"
            className="text-[#4a4033] transition-colors hover:text-[#c45c3e]"
          >
            ხელოვანები
          </Link>
        </nav>
      </div>
    </header>
  );
}
