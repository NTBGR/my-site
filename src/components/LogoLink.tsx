"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

// ლოგო: მთავარ გვერდზე დაჭერისას ზემოთ აგვიყვანს (სხვაგან მთავარზე გადაგვიყვანს)
export default function LogoLink({ size = "md" }: { size?: "md" | "lg" }) {
  const pathname = usePathname();

  return (
    <Link
      href="/"
      aria-label="khelovani"
      onClick={(event) => {
        if (pathname === "/") {
          event.preventDefault();
          window.scrollTo({ top: 0, behavior: "smooth" });
        }
      }}
      className={`group flex min-h-11 w-fit items-center gap-2 font-serif font-semibold tracking-tight text-text transition duration-300 hover:text-accent active:scale-95 ${
        size === "lg"
          ? "text-3xl"
          : "text-lg min-[360px]:text-xl sm:text-2xl"
      }`}
    >
      <span
        aria-hidden
        className={`inline-block shrink-0 rounded-full bg-accent transition-transform duration-500 group-hover:rotate-180 group-hover:scale-125 max-[359px]:hidden ${
          size === "lg" ? "h-3.5 w-3.5" : "h-3 w-3"
        }`}
      />
      khelovani
    </Link>
  );
}
