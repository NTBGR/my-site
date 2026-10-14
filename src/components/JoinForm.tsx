"use client";

import Link from "next/link";
import { useState, type FormEvent } from "react";
import Button from "@/components/ui/Button";
import { useLang, useT } from "@/components/LangProvider";
import { categories } from "@/data/categories";
import { cities, OTHER_CATEGORY, OTHER_CITY } from "@/data/join-options";

const inputClass =
  "mt-1.5 w-full rounded-2xl border border-border bg-bg px-4 py-3 text-base text-text sm:text-sm placeholder:text-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent";

type Status = "idle" | "sending" | "success";

export default function JoinForm() {
  const t = useT().form;
  const lang = useLang();
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState("");
  // „სხვა“ არჩევისას ჩნდება ველი, სადაც ადამიანი თვითონ წერს
  const [city, setCity] = useState("");
  const [category, setCategory] = useState("");

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setStatus("sending");

    const form = event.currentTarget;
    try {
      const res = await fetch("/api/join", { method: "POST", body: new FormData(form) });
      const json = await res.json().catch(() => ({}));
      if (!res.ok) {
        const code = json.error as keyof typeof t.errors | undefined;
        const known = code && typeof t.errors[code] === "string";
        setError(known ? (t.errors[code] as string) : t.errors.failed);
        setStatus("idle");
        return;
      }
      form.reset();
      setCity("");
      setCategory("");
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
        <input name="name" required maxLength={100} autoComplete="name" className={inputClass} />
      </label>

      <label className="text-sm font-medium text-text">
        {t.brand}
        <input name="brand" required maxLength={100} placeholder={t.brandPlaceholder} className={inputClass} />
      </label>

      <label className="text-sm font-medium text-text sm:col-span-2">
        {t.email}
        <input
          name="email"
          type="email"
          required
          maxLength={150}
          autoComplete="email"
          className={inputClass}
        />
      </label>

      <div>
        <label className="text-sm font-medium text-text">
          {t.city}
          <select
            name="city"
            required
            value={city}
            onChange={(event) => setCity(event.target.value)}
            className={inputClass}
          >
            <option value="" disabled>
              {t.cityPlaceholder}
            </option>
            {cities.map((item) => (
              <option key={item.value} value={item.value}>
                {lang === "ka" ? item.value : item.en}
              </option>
            ))}
            <option value={OTHER_CITY}>{t.otherCity}</option>
          </select>
        </label>
        {city === OTHER_CITY ? (
          <input
            name="cityOther"
            required
            maxLength={80}
            placeholder={t.otherCityPlaceholder}
            aria-label={t.otherCityPlaceholder}
            className={inputClass}
          />
        ) : null}
      </div>

      <div>
        <label className="text-sm font-medium text-text">
          {t.category}
          <select
            name="category"
            required
            value={category}
            onChange={(event) => setCategory(event.target.value)}
            className={inputClass}
          >
            <option value="" disabled>
              {t.categoryPlaceholder}
            </option>
            {categories.map((item) => (
              <option key={item.slug} value={item.slug}>
                {lang === "ka" ? item.name : item.en.name}
              </option>
            ))}
            <option value={OTHER_CATEGORY}>{t.otherCategory}</option>
          </select>
        </label>
        {category === OTHER_CATEGORY ? (
          <input
            name="categoryOther"
            required
            maxLength={80}
            placeholder={t.otherCategoryPlaceholder}
            aria-label={t.otherCategoryPlaceholder}
            className={inputClass}
          />
        ) : null}
      </div>

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
