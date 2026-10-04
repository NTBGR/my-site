"use client";

import type { ReactNode } from "react";
import { copyText } from "@/lib/copy";

// ბმული, რომელზე დაჭერისასაც მზა შეტყობინება ბუფერში ჩაიწერება (მყიდველი DM-ში ჩასვამს), მერე ჩვეულებრივად იხსნება
export default function CopyLink({
  href,
  message,
  className,
  children,
}: {
  href: string;
  message: string;
  className?: string;
  children: ReactNode;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      onClick={() => copyText(message)}
      className={className}
    >
      {children}
    </a>
  );
}
