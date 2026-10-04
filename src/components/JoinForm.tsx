"use client";

import Link from "next/link";
import { useState, type FormEvent } from "react";
import Button from "@/components/ui/Button";
import { useLang, useT } from "@/components/LangProvider";
import { categories } from "@/data/categories";
import { cities, OTHER_CATEGORY } from "@/data/join-options";

const MAX_FILES = 10;
const MAX_TOTAL_BYTES = 4 * 1024 * 1024;

const inputClass =
  "mt-1.5 w-full rounded-2xl border border-border bg-bg px-4 py-3 text-base text-text sm:text-sm placeholder:text-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent";

type Status = "idle" | "sending" | "success";

const MAX_SIDE = 1600;

// ტელეფონის ფოტო 3-6MB-ია: ვაპატარავებთ (გრძელი გვერდი 1600px, JPEG), რომ 10 ფოტო ერთად ეტეოდეს. შეცდომისას ორიგინალი გადის.
async function shrink(file: File): Promise<File> {
  try {
    const bitmap = await createImageBitmap(file);
    const scale = Math.min(1, MAX_SIDE / Math.max(bitmap.width, bitmap.height));
    const canvas = document.createElement("canvas");
    canvas.width = Math.round(bitmap.width * scale);
    canvas.height = Math.round(bitmap.height * scale);
    const ctx = canvas.getContext("2d");
    if (!ctx) return file;
    ctx.fillStyle = "#fff";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
    const blob = await new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, "image/jpeg", 0.82));
    if (!blob || blob.size >= file.size) return file;
    return new File([blob], file.name.replace(/\.[^.]+$/, "") + ".jpg", { type: "image/jpeg" });
  } catch {
    return file;
  }
}

export default function JoinForm() {
  const t = useT().form;
  const lang = useLang();
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState("");

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");

    const form = event.currentTarget;
    const data = new FormData(form);

    const picked = (data.getAll("works") as File[]).filter((f) => f.size > 0);
    if (picked.length === 0) {
      setError(t.errors.photos);
      return;
    }
    if (picked.length > MAX_FILES) {
      setError(t.errors.tooMany(MAX_FILES));
      return;
    }

    setStatus("sending");
    const files = await Promise.all(picked.map(shrink));
    if (files.reduce((sum, f) => sum + f.size, 0) > MAX_TOTAL_BYTES) {
      setError(t.errors.size);
      setStatus("idle");
      return;
    }
    data.delete("works");
    files.forEach((file) => data.append("works", file));

    try {
      const res = await fetch("/api/join", { method: "POST", body: data });
      const json = await res.json().catch(() => ({}));
      if (!res.ok) {
        const code = json.error as keyof typeof t.errors | undefined;
        const known = code && typeof t.errors[code] === "string";
        setError(known ? (t.errors[code] as string) : t.errors.failed);
        setStatus("idle");
        return;
      }
      form.reset();
      setStatus("success");
    } catch {
      setError(t.errors.network);
      setStatus("idle");
    }
  }

  if (status === "success") {
    return (
      <div
        role="status"
        className="max-w-2xl rounded-2xl border border-border bg-surface p-6"
      >
        <h3 className="text-lg font-semibold text-text">{t.thanksTitle}</h3>
        <p className="mt-2 leading-relaxed text-muted">
          {t.thanksText}
        </p>
      </div>
    );
  }

  return (
    <form
      onSubmit={onSubmit}
      className="grid grid-cols-1 gap-5 sm:grid-cols-2"
    >
      <label className="text-sm font-medium text-text">
        {t.name}
        <input name="name" required maxLength={100} className={inputClass} />
      </label>

      <label className="text-sm font-medium text-text">
        {t.email}
        <input
          name="email"
          type="email"
          required
          maxLength={150}
          className={inputClass}
        />
      </label>

      <label className="text-sm font-medium text-text">
        {t.city}
        <select name="city" required defaultValue="" className={inputClass}>
          <option value="" disabled>
            {t.cityPlaceholder}
          </option>
          {cities.map((city) => (
            <option key={city.value} value={city.value}>
              {lang === "ka" ? city.value : city.en}
            </option>
          ))}
        </select>
      </label>

      <label className="text-sm font-medium text-text">
        {t.category}
        <select name="category" required defaultValue="" className={inputClass}>
          <option value="" disabled>
            {t.categoryPlaceholder}
          </option>
          {categories.map((category) => (
            <option key={category.slug} value={category.slug}>
              {lang === "ka" ? category.name : category.en.name}
            </option>
          ))}
          <option value={OTHER_CATEGORY}>{t.otherCategory}</option>
        </select>
      </label>

      <label className="text-sm font-medium text-text">
        {t.instagram}
        <input
          name="instagram"
          required
          maxLength={200}
          placeholder="https://instagram.com/..."
          className={inputClass}
        />
      </label>

      <label className="text-sm font-medium text-text">
        {t.facebook}
        <input
          name="facebook"
          maxLength={200}
          placeholder="https://facebook.com/..."
          className={inputClass}
        />
      </label>

      <label className="text-sm font-medium text-text sm:col-span-2">
        {t.bio}
        <textarea
          name="bio"
          required
          rows={5}
          maxLength={2000}
          className={inputClass}
        />
      </label>

      <label className="text-sm font-medium text-text sm:col-span-2">
        {t.comment}
        <textarea
          name="comment"
          rows={3}
          maxLength={1000}
          placeholder={t.commentPlaceholder}
          className={inputClass}
        />
      </label>

      <label className="text-sm font-medium text-text sm:col-span-2">
        {t.works}
        <input
          name="works"
          type="file"
          required
          multiple
          accept="image/jpeg,image/png,image/webp"
          className={`${inputClass} file:mr-3 file:rounded-md file:border-0 file:bg-accent file:px-3 file:py-1.5 file:text-sm file:text-on-accent`}
        />
        <span className="mt-1.5 block text-xs font-normal text-muted">
          {t.worksHint(MAX_FILES)}
        </span>
      </label>

      {/* ანტისპამ ხაფანგი: ადამიანს არ უნდა ეჩვენოს */}
      <input
        name="website"
        tabIndex={-1}
        autoComplete="off"
        aria-hidden="true"
        className="hidden"
      />

      {error && (
        <p role="alert" className="text-sm text-red-700 sm:col-span-2">
          {error}
        </p>
      )}

      <div className="flex flex-col gap-3 sm:col-span-2 sm:flex-row sm:items-center sm:gap-5">
        <Button type="submit" disabled={status === "sending"}>
          {status === "sending" ? t.sending : t.submit}
        </Button>
        <p className="text-xs leading-relaxed text-muted">
          {t.consent}{" "}
          <Link href="/privacy" target="_blank" className="underline underline-offset-2 hover:text-accent">
            {t.consentLink}
          </Link>
          .
        </p>
      </div>
    </form>
  );
}
