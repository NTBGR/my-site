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
      {/* ხაზი ტექსტის ზომასთან პროპორციულია (ყველგან ერთი და იგივე ფორმა და სისქე). ჰედერში ის ტექსტის ქვეშ ჰაერშია,
          რომ ტექსტი ხატულებთან და ნავიგაციასთან ერთ ხაზზე იდგეს; ფუტერში ნორმალურად ადგილს იკავებს */}
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
          viewBox="0 0.4 86 5.8"
          className={`h-auto w-full overflow-visible text-accent ${size === "lg" ? "mt-1" : "absolute left-0 top-full mt-1 lg:mt-0.5"}`}
          aria-hidden
        >
          <path
            className="logo-swoosh"
            d="M2 5 C20 1, 40 1, 84 3"
            stroke="currentColor"
            strokeWidth="1.9"
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
