"use client";

import Link from "next/link";
import { useT } from "@/components/LangProvider";
import WorksGallery, { type GalleryWork } from "@/components/WorksGallery";
import ShareButton from "@/components/ShareButton";
import { useFavorites } from "@/lib/favorites";

export type SavedCard = {
  key: string; // "ავტორი/ნამუშევარი"
  title: string;
  artistName: string;
  artistSlug: string;
  image?: string;
  color: string;
  gallery: GalleryWork;
};

// შენახული ნამუშევრები (ბრაუზერიდან): ფოტოზე დაჭერა იქვე ადიდებს
export default function SavedWorks({ cards, sharedKeys }: { cards: SavedCard[]; sharedKeys?: string[] }) {
  const t = useT().savedPage;
  const { list } = useFavorites();
  // მეგობრის გამოგზავნილი სია (ბმულიდან) ან ჩემი შენახულები (ბრაუზერიდან)
  const shared = Boolean(sharedKeys && sharedKeys.length > 0);
  const saved = shared
    ? (sharedKeys as string[]).map((key) => cards.find((card) => card.key === key)).filter((card): card is SavedCard => Boolean(card))
    : cards.filter((card) => list.includes(card.key));
  const shareUrl = `/saved?l=${encodeURIComponent(saved.map((card) => card.key).join(","))}`;

  if (saved.length === 0) {
    return (
      <div className="mt-8 rounded-[1.75rem] border border-dashed border-border bg-surface p-8 text-center">
        <p className="mx-auto max-w-md text-muted">{t.empty}</p>
        <Link
          href="/artists"
          className="mt-5 inline-flex min-h-11 items-center rounded-full bg-accent px-6 text-sm font-medium text-on-accent transition duration-300 hover:bg-accent-hover"
        >
          {t.browse}
        </Link>
      </div>
    );
  }
  return (
    <>
      <div className="mt-4 flex flex-wrap items-center gap-3">
        {shared ? (
          <>
            <p className="text-muted">{t.sharedBanner}</p>
            <Link href="/saved" className="text-sm font-medium text-accent underline underline-offset-4">
              {t.mine}
            </Link>
          </>
        ) : (
          <ShareButton url={shareUrl} title={t.shareTitle} variant="plain" label={t.share} />
        )}
      </div>
      <div className="mt-6">
        <WorksGallery works={saved.map((card) => card.gallery)} showSort={false} />
      </div>
      {shared ? null : <p className="mt-8 text-xs text-muted">{t.note}</p>}
    </>
  );
}
