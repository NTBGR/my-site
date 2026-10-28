"use client";

import { useRef, useState, type Dispatch, type SetStateAction } from "react";
import { useT } from "@/components/LangProvider";
import { MAX_JOIN_WORKS } from "@/data/join-options";

// განაცხადის ფორმის „ნამუშევრების“ ნაწილი: ფოტო + დასახელება + ფასი თითო ნივთზე (მაქსიმუმ MAX_JOIN_WORKS).
// ფოტოს ბრაუზერი ადგილზევე ამცირებს (Vercel-ის მოთხოვნა ~4,5 MB-ზე მეტს ვერ იღებს), შემდეგ ფორმა ცალ-ცალკე აგზავნის.
export type WorkDraft = { id: string; blob: Blob; url: string; title: string; price: string };

const MAX_SIDE = 1600;
const TARGET_BYTES = 1.4 * 1024 * 1024;

export async function compressPhoto(file: File): Promise<Blob> {
  const bitmap = await createImageBitmap(file);
  try {
    let side = MAX_SIDE;
    let quality = 0.82;
    for (let attempt = 0; attempt < 4; attempt++) {
      const scale = Math.min(1, side / Math.max(bitmap.width, bitmap.height));
      const canvas = document.createElement("canvas");
      canvas.width = Math.max(1, Math.round(bitmap.width * scale));
      canvas.height = Math.max(1, Math.round(bitmap.height * scale));
      const ctx = canvas.getContext("2d");
      if (!ctx) throw new Error("canvas");
      ctx.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
      const blob = await new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, "image/jpeg", quality));
      if (blob && blob.size <= TARGET_BYTES) return blob;
      if (blob && attempt === 3) return blob;
      side = Math.round(side * 0.8);
      quality = Math.max(0.6, quality - 0.08);
    }
    throw new Error("compress");
  } finally {
    bitmap.close();
  }
}

const inputClass =
  "field min-h-11 w-full text-sm [[data-tried=true]_&:invalid]:border-red-600 [[data-tried=true]_&:invalid]:ring-1 [[data-tried=true]_&:invalid]:ring-red-600";

export default function JoinWorks({
  works,
  setWorks,
  invalid,
  disabled,
  onProcessing,
}: {
  works: WorkDraft[];
  setWorks: Dispatch<SetStateAction<WorkDraft[]>>;
  invalid: boolean;
  disabled: boolean;
  onProcessing: (busy: boolean) => void;
}) {
  const t = useT().form;
  const [busy, setBusy] = useState(false);
  const [photoError, setPhotoError] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const left = MAX_JOIN_WORKS - works.length;

  async function addFiles(files: FileList | null) {
    if (!files || files.length === 0) return;
    setPhotoError(false);
    setBusy(true);
    onProcessing(true);
    let failed = false;
    for (const file of Array.from(files).slice(0, Math.max(0, left))) {
      try {
        const blob = await compressPhoto(file);
        const draft: WorkDraft = { id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`, blob, url: URL.createObjectURL(blob), title: "", price: "" };
        setWorks((current) => (current.length >= MAX_JOIN_WORKS ? current : [...current, draft]));
      } catch {
        failed = true;
      }
    }
    if (failed) setPhotoError(true);
    setBusy(false);
    onProcessing(false);
    if (inputRef.current) inputRef.current.value = "";
  }

  function update(id: string, patch: Partial<Pick<WorkDraft, "title" | "price">>) {
    setWorks((current) => current.map((work) => (work.id === id ? { ...work, ...patch } : work)));
  }

  function remove(id: string) {
    setWorks((current) => {
      const target = current.find((work) => work.id === id);
      if (target) URL.revokeObjectURL(target.url);
      return current.filter((work) => work.id !== id);
    });
  }

  return (
    <div className="sm:col-span-2">
      <p className="text-sm leading-relaxed text-muted">{t.worksHint}</p>
      <p className="mt-3 flex items-start gap-2.5 rounded-2xl bg-accent-soft px-4 py-3 text-sm font-medium leading-relaxed text-text">
        <span aria-hidden className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-accent text-xs font-bold text-on-accent">!</span>
        {t.worksRule}
      </p>

      {works.length > 0 ? (
        <ul className="mt-3 grid gap-3">
          {works.map((work, i) => (
            <li key={work.id} className="flex gap-3 rounded-2xl border border-border bg-surface p-3">
              <span className="relative block aspect-[3/4] w-20 shrink-0 overflow-hidden rounded-xl bg-surface-2 sm:w-24">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={work.url} alt={`${i + 1}`} className="h-full w-full object-cover" />
                <span className="absolute left-1 top-1 rounded-full bg-black/55 px-1.5 text-[11px] font-semibold leading-5 text-white">{i + 1}</span>
              </span>
              <span className="grid min-w-0 flex-1 content-start gap-2">
                <textarea
                  required
                  rows={2}
                  maxLength={100}
                  value={work.title}
                  onChange={(event) => update(work.id, { title: event.target.value.replace(/\s*\n+\s*/g, " ") })}
                  placeholder={t.workName}
                  aria-label={t.workName}
                  disabled={disabled}
                  className={`${inputClass} resize-none py-2.5 leading-snug`}
                />
                <span className="flex items-center gap-2">
                  <input
                    inputMode="numeric"
                    pattern="[0-9]*"
                    maxLength={6}
                    value={work.price}
                    onChange={(event) => update(work.id, { price: event.target.value.replace(/\D/g, "") })}
                    placeholder={t.workPrice}
                    aria-label={t.workPrice}
                    disabled={disabled}
                    className={`${inputClass} min-w-0 flex-1`}
                  />
                  <button
                    type="button"
                    onClick={() => remove(work.id)}
                    disabled={disabled}
                    className="min-h-11 shrink-0 rounded-full px-3 text-sm font-medium text-muted underline underline-offset-2 transition hover:text-red-700"
                  >
                    {t.workRemove}
                  </button>
                </span>
              </span>
            </li>
          ))}
        </ul>
      ) : null}

      <div className="mt-3 flex flex-wrap items-center gap-3">
        <label
          className={`btn btn-outline min-h-12 cursor-pointer ${left <= 0 || disabled || busy ? "pointer-events-none opacity-50" : ""} ${invalid && works.length === 0 ? "!border-red-600 !text-red-700" : ""}`}
        >
          {busy ? t.worksProcessing : works.length === 0 ? t.worksAdd : t.worksAddMore}
          <input
            ref={inputRef}
            type="file"
            accept="image/*"
            multiple
            className="sr-only"
            disabled={left <= 0 || disabled || busy}
            onChange={(event) => addFiles(event.target.files)}
          />
        </label>
        <span className="text-sm text-muted">
          {works.length}/{MAX_JOIN_WORKS} · {t.worksLimit}
        </span>
      </div>
      {photoError ? (
        <p role="alert" className="mt-2 text-sm text-red-700">
          {t.worksPhotoError}
        </p>
      ) : null}
    </div>
  );
}
