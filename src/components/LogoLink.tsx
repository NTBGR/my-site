"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

// ლოგო: ქართული სახელი, ტერაკოტის წერტილი და ხელით დახაზული ხაზი.
// მთავარ გვერდზე დაჭერისას ზემოთ აგვიყვანს (სხვაგან მთავარზე გადაგვიყვანს)
export default function LogoLink({ size = "md" }: { size?: "md" | "lg" }) {
  const pathname = usePathname();

  return (
    <Link
      href="/"
      aria-label="ხელოვანი"
      onClick={(event) => {
        if (pathname === "/") {
          event.preventDefault();
          window.scrollTo({ top: 0, behavior: "smooth" });
        }
      }}
      className="group flex min-h-11 w-fit items-center font-serif font-semibold tracking-tight text-text transition duration-300 hover:text-accent active:scale-95"
    >
      <span className="relative inline-flex flex-col items-start">
        <span
          className={`leading-none ${
            size === "lg"
              ? "text-4xl sm:text-5xl"
              : "text-[1.35rem] min-[360px]:text-2xl sm:text-[1.7rem] lg:text-[2.15rem]"
          }`}
        >
          ხელოვანი<span className="text-accent">.</span>
        </span>
        <svg
          viewBox="0 0 86 7"
          preserveAspectRatio="none"
          className="mt-1 h-[6px] w-full text-accent lg:h-[7px]"
          aria-hidden
        >
          <path
            className="logo-swoosh"
            d="M2 5 C20 1, 40 1, 84 3"
            stroke="currentColor"
            strokeWidth="2.8"
            fill="none"
            strokeLinecap="round"
            pathLength={1}
            strokeDasharray={1}
          />
        </svg>
      </span>
    </Link>
  );
}
