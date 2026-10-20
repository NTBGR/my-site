"use client";

import Link from "next/link";
import { useState, type FormEvent } from "react";
import Button from "@/components/ui/Button";
import { useLang, useT } from "@/components/LangProvider";
import { categories } from "@/data/categories";
import { cities, OTHER_CATEGORY, OTHER_CITY } from "@/data/join-options";

const inputClass =
  "mt-1.5 w-full rounded-2xl border border-border bg-bg px-4 py-3 text-base text-text sm:text-sm placeholder:text-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent [[data-tried=true]_&:invalid]:border-red-600 [[data-tried=true]_&:invalid]:ring-1 [[data-tried=true]_&:invalid]:ring-red-600";

// ჩამოსაშლელი სია: ბრაუზერის ჩვეულებრივი სტილის ნაცვლად ჩვენი ველის ფორმა და საკუთარი ისარი
// placeholder ვარიანტი disabled არ არის: iOS-ის ბორბალი მასზე იწყება და „ნახატები“ (პირველი რეალური ვარიანტი) შემთხვევით არ აირჩევა; required ცარიელს მაინც არ გაატარებს
const selectClass = `${inputClass} mt-0 min-h-12 cursor-pointer appearance-none pr-11 [&>option]:bg-bg [&>option]:text-text`;

function SelectArrow() {
  return (
    <svg
      aria-hidden
      viewBox="0 0 20 20"
      className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="m5 8 5 5 5-5" />
    </svg>
  );
}

type Status = "idle" | "sending" | "success";

export default function JoinForm({ defaultCategory = "" }: { defaultCategory?: string }) {
  const all = useT();
  const t = all.form;
  const lang = useLang();
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState("");
  const [tried, setTried] = useState(false);
  // „სხვა“ არჩევისას ჩნდება ველი, სადაც ადამიანი თვითონ წერს
  const [city, setCity] = useState("");
  const [category, setCategory] = useState(defaultCategory);

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
        tabIndex={-1}
        // გაგზავნის შემდეგ ფორმა მოკლე შეტყობინებით იცვლება და გვერდი მოკლდება: შეტყობინება ეკრანის ცენტრში უნდა მოვიტანოთ, რომ ტელეფონზე არ დარჩეს ზემოთ დამალული
        ref={(el) => {
          if (!el) return;
          const top = el.getBoundingClientRect().top;
          if (top < 90 || top > window.innerHeight - 160) el.scrollIntoView({ block: "center", behavior: "smooth" });
          el.focus({ preventScroll: true });
        }}
        className="mx-auto flex max-w-xl flex-col items-center rounded-[1.5rem] bg-accent-soft px-6 py-10 text-center outline-none sm:px-10 sm:py-12"
      >
        <span className="flex h-16 w-16 items-center justify-center rounded-full bg-accent text-on-accent shadow-lg" aria-hidden>
          <svg viewBox="0 0 24 24" className="h-8 w-8" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round">
            <path d="m5 12.5 4.5 4.5L19 7.5" />
          </svg>
        </span>
        <h3 className="mt-5 font-serif text-2xl font-semibold tracking-tight text-text sm:text-3xl">{t.thanksTitle}</h3>
        <p className="mt-3 max-w-md leading-relaxed text-text/80">{t.thanksText}</p>
        <div className="mt-7 flex w-full flex-col gap-3 sm:w-auto sm:flex-row">
          <Link
            href="/artists"
            className="inline-flex min-h-12 items-center justify-center rounded-full bg-accent px-7 text-sm font-medium text-on-accent transition duration-300 hover:bg-accent-hover active:scale-95"
          >
            {all.join.existing}
          </Link>
          <Link
            href="/"
            className="inline-flex min-h-12 items-center justify-center rounded-full border border-border bg-surface px-7 text-sm font-medium text-text transition duration-300 hover:border-accent hover:text-accent active:scale-95"
          >
            {all.nav.home}
          </Link>
        </div>
      </div>
    );
  }

  return (
    <form
      onSubmit={onSubmit}
      // ღილაკზე დაჭერის შემდეგ ცარიელი სავალდებულო ველები წითლდება (დაჭერამდე — არა)
      onInvalidCapture={() => {
        setTried(true);
        setError(t.errors.required);
      }}
      data-tried={tried}
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
          <span className="relative mt-1.5 block">
            <select
              name="city"
              required
              value={city}
              onChange={(event) => setCity(event.target.value)}
              className={`${selectClass} ${city === "" ? "text-muted" : ""}`}
            >
              <option value="">
                {t.cityPlaceholder}
              </option>
              {cities.map((item) => (
                <option key={item.value} value={item.value}>
                  {lang === "ka" ? item.value : item.en}
                </option>
              ))}
              <option value={OTHER_CITY}>{t.otherCity}</option>
            </select>
            <SelectArrow />
          </span>
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
          <span className="relative mt-1.5 block">
            <select
              name="category"
              required
              value={category}
              onChange={(event) => setCategory(event.target.value)}
              className={`${selectClass} ${category === "" ? "text-muted" : ""}`}
            >
              <option value="">
                {t.categoryPlaceholder}
              </option>
              {categories.map((item) => (
                <option key={item.slug} value={item.slug}>
                  {lang === "ka" ? item.name : item.en.name}
                </option>
              ))}
              <option value={OTHER_CATEGORY}>{t.otherCategory}</option>
            </select>
            <SelectArrow />
          </span>
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

      {/* თანხმობა მონიშვნით: მონიშვნის გარეშე ფორმა არ გაიგზავნება */}
      <label className="flex items-start gap-3 text-sm leading-relaxed text-text sm:col-span-2">
        <input type="checkbox" name="agree" required className="mt-0.5 h-5 w-5 shrink-0 cursor-pointer accent-accent [[data-tried=true]_&:invalid]:outline [[data-tried=true]_&:invalid]:outline-2 [[data-tried=true]_&:invalid]:outline-offset-2 [[data-tried=true]_&:invalid]:outline-red-600" />
        <span>{t.consent}{" "}
          <Link href="/privacy" target="_blank" className="underline underline-offset-2 hover:text-accent">
            {t.consentLink}
          </Link>{" "}
          {t.consentAnd}{" "}
          <Link href="/terms" target="_blank" className="underline underline-offset-2 hover:text-accent">
            {t.consentTerms}
          </Link>{" "}
          {t.consentPrice}
        </span>
      </label>

      <div className="sm:col-span-2">
        <Button type="submit" disabled={status === "sending"}>
          {status === "sending" ? t.sending : t.submit}
        </Button>
      </div>
    </form>
  );
}
