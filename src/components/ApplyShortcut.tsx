"use client";

import { useEffect, useState } from "react";

// ტელეფონზე ეკრანის ქვედა ღილაკი „შეავსე განაცხადი“: პირდაპირ ფორმამდე მიიყვანს და ქრება, როცა ფორმა უკვე ჩანს
export default function ApplyShortcut({ label }: { label: string }) {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const target = document.getElementById("apply");
    if (!target) return;
    // ღილაკი ჩანს, სანამ ფორმამდე ჯერ არ მივსულვართ (ფორმის ზედა ხაზი ეკრანის ქვემოთაა); ფორმის მერე ან მასში ქრება
    const update = () => setShow(window.scrollY > 500 && target.getBoundingClientRect().top > window.innerHeight - 40);
    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, []);

  return (
    <a
      href="#apply"
      aria-hidden={!show}
      tabIndex={show ? 0 : -1}
      className={`fixed bottom-4 left-1/2 z-30 inline-flex min-h-12 -translate-x-1/2 items-center gap-2 rounded-full bg-accent px-6 text-sm font-medium text-on-accent shadow-xl transition duration-300 active:scale-95 lg:hidden ${
        show ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-4 opacity-0"
      }`}
    >
      {label}
      <span aria-hidden>↓</span>
    </a>
  );
}
