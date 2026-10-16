"use client";

import { useEffect } from "react";

// ხელოვანის პროფილის ნახვას ითვლის (რეპორტისთვის: რამდენი ადამიანი შევიდა და მათგან რამდენი გადავიდა). არაფერს აჩვენებს
export default function ProfileView({ slug }: { slug: string }) {
  useEffect(() => {
    const body = JSON.stringify({ slug });
    try {
      const sent = navigator.sendBeacon?.("/api/view", new Blob([body], { type: "application/json" }));
      if (!sent) void fetch("/api/view", { method: "POST", body, keepalive: true, headers: { "content-type": "application/json" } });
    } catch {}
  }, [slug]);
  return null;
}
