"use client";

import { useState, type ReactNode } from "react";

// ხელოვანის გვერდის ტაბები: ნამუშევრები | ისტორია (ორივე გვერდზე ჩატვირთულია, ტაბი მხოლოდ აჩვენებს)
export default function ArtistTabs({
  worksLabel,
  storyLabel,
  works,
  story,
}: {
  worksLabel: string;
  storyLabel: string;
  works: ReactNode;
  story: ReactNode;
}) {
  const [tab, setTab] = useState<"works" | "story">("works");
  const tabClass = (active: boolean) =>
    `inline-flex min-h-11 items-center border-b-2 px-4 text-base font-semibold transition-colors ${
      active ? "border-accent text-text" : "border-transparent text-muted hover:text-accent"
    }`;
  return (
    <div className="mt-6 sm:mt-8">
      <div className="flex gap-2 border-b border-border" role="tablist">
        <button type="button" role="tab" aria-selected={tab === "works"} onClick={() => setTab("works")} className={tabClass(tab === "works")}>
          {worksLabel}
        </button>
        <button type="button" role="tab" aria-selected={tab === "story"} onClick={() => setTab("story")} className={tabClass(tab === "story")}>
          {storyLabel}
        </button>
      </div>
      <div hidden={tab !== "works"}>{works}</div>
      <div hidden={tab !== "story"}>{story}</div>
    </div>
  );
}
