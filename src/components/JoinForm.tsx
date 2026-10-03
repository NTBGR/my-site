"use client";

import { useState, type FormEvent } from "react";
import Button from "@/components/ui/Button";
import { useT } from "@/components/LangProvider";

const MAX_FILES = 4;
const MAX_TOTAL_BYTES = 4 * 1024 * 1024;

const inputClass =
  "mt-1.5 w-full rounded-2xl border border-border bg-bg px-4 py-3 text-base text-text sm:text-sm placeholder:text-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent";

type Status = "idle" | "sending" | "success";

export default function JoinForm() {
  const t = useT().form;
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState("");

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");

    const form = event.currentTarget;
    const data = new FormData(form);

    const files = (data.getAll("works") as File[]).filter((f) => f.size > 0);
    if (files.length === 0) {
      setError(t.errors.photos);
      return;
    }
    if (files.length > MAX_FILES) {
      setError(t.errors.tooMany(MAX_FILES));
      return;
    }
    if (files.reduce((sum, f) => sum + f.size, 0) > MAX_TOTAL_BYTES) {
      setError(t.errors.size);
      return;
    }

    setStatus("sending");
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
        <input name="city" required maxLength={80} className={inputClass} />
      </label>

      <label className="text-sm font-medium text-text">
        {t.category}
        <input
          name="category"
          required
          maxLength={80}
          placeholder={t.categoryPlaceholder}
          className={inputClass}
        />
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
          required
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

      <div className="sm:col-span-2">
        <Button type="submit" disabled={status === "sending"}>
          {status === "sending" ? t.sending : t.submit}
        </Button>
      </div>
    </form>
  );
}
