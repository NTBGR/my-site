import type { ReactNode } from "react";
import PageBanner from "@/components/PageBanner";

// 404 გვერდების სათაური: იგივე ფერადი ბანერი, რაც სხვა გვერდებზე, დიდი გამჭვირვალე „404“-ით უკანა ფონზე
export default function PageHeader({
  title,
  text,
  eyebrow = "404",
  children,
}: {
  title: string;
  text?: string;
  eyebrow?: string;
  children?: ReactNode;
}) {
  return (
    <div className="mx-auto max-w-7xl px-4 pb-16 pt-4 sm:px-6 sm:pb-24 sm:pt-6 lg:px-10">
      <div className="relative">
        <PageBanner title={title} text={text} badge={eyebrow} collage={["keramika", "samkauli", "nakhatebi"]} tone="clay">
          {children}
        </PageBanner>
        <span
          aria-hidden
          className="pointer-events-none absolute bottom-2 right-4 z-[1] select-none font-serif text-[7rem] font-semibold leading-none text-white/10 sm:hidden"
        >
          404
        </span>
      </div>
    </div>
  );
}
