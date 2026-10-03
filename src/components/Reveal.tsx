"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";

// ელემენტი სქროლზე გამოჩნდება; stagger=true-ზე შვილები თანმიმდევრობით ამოდიან
export default function Reveal({
  children,
  className = "",
  stagger = false,
  as: Tag = "div",
}: {
  children: ReactNode;
  className?: string;
  stagger?: boolean;
  as?: "div" | "section" | "ul" | "ol";
}) {
  const ref = useRef<HTMLElement | null>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    if (typeof IntersectionObserver === "undefined") {
      setVisible(true);
      return;
    }
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.05, rootMargin: "0px 0px 8% 0px" },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  const classes = `${stagger ? "reveal-stagger" : "reveal"} ${
    visible ? "is-visible" : ""
  } ${className}`.trim();

  return (
    <Tag ref={ref as never} className={classes}>
      {children}
    </Tag>
  );
}
