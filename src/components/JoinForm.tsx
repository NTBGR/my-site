"use client";

import Link from "next/link";
import { useState, type FormEvent } from "react";
import Button from "@/components/ui/Button";
import JoinWorks, { type WorkDraft } from "@/components/JoinWorks";
import { useLang, useT } from "@/components/LangProvider";
import { categories } from "@/data/categories";
import { cities, OTHER_CATEGORY, OTHER_CITY } from "@/data/join-options";

const inputClass =
  "field mt-1.5 sm:text-sm [[data-tried=true]_&:invalid]:border-red-600 [[data-tried=true]_&:invalid]:ring-1 [[data-tried=true]_&:invalid]:ring-red-600";

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

// ფორმის ბლოკი: ნომრიანი სათაური და ერთი ჯგუფის ველები
// ტელეფონზე სექციები ბარათის გარეშეა (ველები ფართო რჩება), ზემოდან გამყოფი ხაზით; დიდ ეკრანზე ცალკე ბარათებია
const sectionClass =
  "grid grid-cols-1 gap-5 border-t border-border pt-6 first:border-t-0 first:pt-0 sm:grid-cols-2 sm:rounded-[1.35rem] sm:border sm:bg-bg/60 sm:p-6 sm:first:border-t sm:first:pt-6";

function SectionHead({ n, title }: { n: number; title: string }) {
  return (
    <h3 className="flex items-center gap-3 font-serif text-xl font-semibold tracking-tight text-text sm:col-span-2 sm:text-2xl">
      <span aria-hidden className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-accent font-sans text-sm font-semibold text-on-accent">
        {n}
      </span>
      {title}
    </h3>
  );
}

type Status = "idle" | "sending" | "partial" | "success";

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

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
  // ნამუშევრები: ფოტო + დასახელება + ფასი. ფოტოები განაცხადის ტექსტის შემდეგ ცალ-ცალკე იგზავნება
  const [works, setWorks] = useState<WorkDraft[]>([]);
  const [processing, setProcessing] = useState(false);
  const [progress, setProgress] = useState({ done: 0, total: 0 });
  const [ticket, setTicket] = useState("");
  const [failed, setFailed] = useState<number[]>([]);

  // ერთი ფოტოს გაგზავნა (3 ცდა): განაცხადის ბილეთით ფოტო ჩატში განაცხადის შეტყობინების პასუხად ჩაჯდება
  async function sendPhoto(ticketValue: string, index: number, total: number) {
    const work = works[index - 1];
    for (let attempt = 0; attempt < 3; attempt++) {
      try {
        const body = new FormData();
        body.set("ticket", ticketValue);
        body.set("index", String(index));
        body.set("total", String(total));
        body.set("title", work.title);
        body.set("price", work.price);
        body.set("photo", work.blob, `${index}.jpg`);
        const res = await fetch("/api/join/photo", { method: "POST", body });
        if (res.ok) return true;
        // ბილეთი ვადაგასულია / ფაილი არასწორია / ლიმიტი: ხელახალი ცდა აზრს მოკლებულია
        if ([403, 413, 415, 429].includes(res.status)) return false;
      } catch {
        // ქსელის შეცდომა: ვცდით თავიდან
      }
      await sleep(700 * (attempt + 1));
    }
    return false;
  }

  async function uploadPhotos(ticketValue: string, indexes: number[]) {
    const missed: number[] = [];
    for (const [n, index] of indexes.entries()) {
      setProgress({ done: n, total: indexes.length });
      if (!(await sendPhoto(ticketValue, index, works.length))) missed.push(index);
    }
    setProgress({ done: indexes.length, total: indexes.length });
    return missed;
  }

  function finish(form: HTMLFormElement | null) {
    works.forEach((work) => URL.revokeObjectURL(work.url));
    form?.reset();
    setCity("");
    setCategory("");
    setWorks([]);
    setTicket("");
    setFailed([]);
    setStatus("success");
  }

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    if (works.length === 0) {
      setTried(true);
      setError(t.worksRequired);
      return;
    }
    setStatus("sending");

    const form = event.currentTarget;
    try {
      const body = new FormData(form);
      body.set("worksCount", String(works.length));
      const res = await fetch("/api/join", { method: "POST", body });
      const json = await res.json().catch(() => ({}));
      if (!res.ok) {
        const code = json.error as keyof typeof t.errors | undefined;
        const known = code && typeof t.errors[code] === "string";
        setError(known ? (t.errors[code] as string) : t.errors.failed);
        setStatus("idle");
        return;
      }
      const ticketValue = typeof json.ticket === "string" ? json.ticket : "";
      setTicket(ticketValue);
      const all = works.map((_, i) => i + 1);
      const missed = ticketValue ? await uploadPhotos(ticketValue, all) : all;
      if (missed.length > 0) {
        setFailed(missed);
        setStatus("partial");
        return;
      }
      finish(form);
    } catch {
      setError(t.errors.network);
      setStatus("idle");
    }
  }

  async function retryPhotos() {
    setError("");
    setStatus("sending");
    const missed = await uploadPhotos(ticket, failed);
    if (missed.length > 0) {
      setFailed(missed);
      setStatus("partial");
      return;
    }
    finish(null);
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
        <p className="mt-3 max-w-md text-sm leading-relaxed text-text/70">{t.thanksNote}</p>
        <div className="mt-7 flex w-full flex-col gap-3 sm:w-auto sm:flex-row">
          <Link
            href="/artists"
            className="inline-flex min-h-12 items-center justify-center rounded-full bg-accent px-7 text-sm font-medium text-on-accent transition duration-300 hover:bg-accent-hover active:scale-95"
          >
            {all.join.existing}
          </Link>
          <Link
            href="/"
            className="btn btn-outline"
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
      className="grid grid-cols-1 gap-5 sm:gap-6"
    >
      {/* 1. შენს შესახებ */}
      <section className={sectionClass}>
        <SectionHead n={1} title={t.sectionAbout} />
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
          <input name="email" type="email" required maxLength={150} autoComplete="email" className={inputClass} />
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
                <option value="">{t.cityPlaceholder}</option>
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
                <option value="">{t.categoryPlaceholder}</option>
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
      </section>

      {/* 2. ბმულები და ბიოგრაფია */}
      <section className={sectionClass}>
        <SectionHead n={2} title={t.sectionLinks} />
        <label className="text-sm font-medium text-text">
          {t.instagram}
          <input name="instagram" required maxLength={200} placeholder="https://instagram.com/..." className={inputClass} />
        </label>

        <label className="text-sm font-medium text-text">
          {t.facebook}
          <input name="facebook" maxLength={200} placeholder="https://facebook.com/..." className={inputClass} />
        </label>

        <label className="text-sm font-medium text-text sm:col-span-2">
          {t.bio}
          <textarea name="bio" required rows={5} maxLength={2000} className={inputClass} />
        </label>
      </section>

      {/* 3. ნამუშევრები: ფოტო + დასახელება + ფასი */}
      <section className={sectionClass}>
        <SectionHead n={3} title={t.worksTitle} />
        <JoinWorks works={works} setWorks={setWorks} invalid={tried} disabled={status !== "idle"} onProcessing={setProcessing} />
      </section>

      {/* 4. კომენტარი, თანხმობა და გაგზავნა */}
      <section className={sectionClass}>
        <SectionHead n={4} title={t.sectionSend} />
        <label className="text-sm font-medium text-text sm:col-span-2">
          {t.comment}
          <textarea name="comment" rows={3} maxLength={1000} placeholder={t.commentPlaceholder} className={inputClass} />
        </label>

        {/* ანტისპამ ხაფანგი: ადამიანს არ უნდა ეჩვენოს */}
        <input name="website" tabIndex={-1} autoComplete="off" aria-hidden="true" className="hidden" />

        {/* რა ხდება გაგზავნის შემდეგ: განვიხილავთ, დავამატებთ, დაგიკავშირდებით; შეტყობინება შეიძლება სპამში ჩავარდეს */}
        <div className="rounded-2xl bg-accent-soft px-4 py-4 text-sm leading-relaxed text-text/85 sm:col-span-2">
          <p className="font-semibold text-text">{t.nextTitle}</p>
          <ul className="mt-2 grid gap-2">
            {t.nextSteps.map((step) => (
              <li key={step} className="flex gap-2.5">
                <span aria-hidden className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-accent text-on-accent">
                  <svg viewBox="0 0 24 24" className="h-3 w-3" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                    <path d="m5 12.5 4.5 4.5L19 7.5" />
                  </svg>
                </span>
                <span>{step}</span>
              </li>
            ))}
          </ul>
        </div>

        {error && (
          <p role="alert" className="text-sm text-red-700 sm:col-span-2">
            {error}
          </p>
        )}

        {/* თანხმობა მონიშვნით: მონიშვნის გარეშე ფორმა არ გაიგზავნება */}
        <label className="flex items-start gap-3 text-sm leading-relaxed text-text sm:col-span-2">
          <input type="checkbox" name="agree" required className="mt-0.5 h-5 w-5 shrink-0 cursor-pointer accent-accent [[data-tried=true]_&:invalid]:outline [[data-tried=true]_&:invalid]:outline-2 [[data-tried=true]_&:invalid]:outline-offset-2 [[data-tried=true]_&:invalid]:outline-red-600" />
          <span>
            {t.consent}{" "}
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
          {status === "partial" ? (
            <div role="alert" className="grid gap-3 rounded-2xl border border-red-200 bg-red-50 px-4 py-4 text-sm text-red-800">
              <p>
                {t.uploadFailed} ({failed.length}/{works.length})
              </p>
              <div>
                <Button type="button" onClick={retryPhotos}>
                  {t.retryPhotos}
                </Button>
              </div>
            </div>
          ) : (
            <Button type="submit" disabled={status === "sending" || processing}>
              {status === "sending"
                ? progress.total > 0
                  ? `${t.uploading} ${Math.min(progress.done + 1, progress.total)}/${progress.total}`
                  : t.sending
                : processing
                  ? t.worksProcessing
                  : t.submit}
            </Button>
          )}
        </div>
      </section>
    </form>
  );
}
