"use client";

import { useState, type FormEvent } from "react";
import Button from "@/components/ui/Button";

const MAX_FILES = 4;
const MAX_TOTAL_BYTES = 4 * 1024 * 1024;

const inputClass =
  "mt-1.5 w-full rounded-card border border-border bg-surface px-3.5 py-2.5 text-sm text-text placeholder:text-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent";

type Status = "idle" | "sending" | "success";

export default function JoinForm() {
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState("");
  const [open, setOpen] = useState(false);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");

    const form = event.currentTarget;
    const data = new FormData(form);

    const files = (data.getAll("works") as File[]).filter((f) => f.size > 0);
    if (files.length > MAX_FILES) {
      setError(`მაქსიმუმ ${MAX_FILES} ფოტოს ატვირთვაა შესაძლებელი.`);
      return;
    }
    if (files.reduce((sum, f) => sum + f.size, 0) > MAX_TOTAL_BYTES) {
      setError("ფოტოების ჯამური ზომა 4MB-ს არ უნდა აღემატებოდეს.");
      return;
    }

    setStatus("sending");
    try {
      const res = await fetch("/api/join", { method: "POST", body: data });
      const json = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(json.error ?? "გაგზავნა ვერ მოხერხდა. სცადე მოგვიანებით.");
        setStatus("idle");
        return;
      }
      form.reset();
      setStatus("success");
    } catch {
      setError("კავშირის შეცდომა. შეამოწმე ინტერნეტი და სცადე თავიდან.");
      setStatus("idle");
    }
  }

  if (status === "success") {
    return (
      <div
        role="status"
        className="max-w-2xl rounded-2xl border border-border bg-surface p-6"
      >
        <h3 className="text-lg font-semibold text-text">გმადლობთ!</h3>
        <p className="mt-2 leading-relaxed text-muted">
          განაცხადი მივიღეთ. ინფორმაციას გადავამოწმებთ და მალე დაგიკავშირდებით.
        </p>
      </div>
    );
  }

  if (!open) {
    return <Button onClick={() => setOpen(true)}>შეავსე განაცხადი</Button>;
  }

  return (
    <form
      onSubmit={onSubmit}
      className="grid max-w-2xl grid-cols-1 gap-5 sm:grid-cols-2"
    >
      <label className="text-sm font-medium text-text">
        სახელი და გვარი *
        <input name="name" required maxLength={100} className={inputClass} />
      </label>

      <label className="text-sm font-medium text-text">
        ემაილი *
        <input
          name="email"
          type="email"
          required
          maxLength={150}
          className={inputClass}
        />
      </label>

      <label className="text-sm font-medium text-text">
        ქალაქი *
        <input name="city" required maxLength={80} className={inputClass} />
      </label>

      <label className="text-sm font-medium text-text">
        მიმართულება *
        <input
          name="category"
          required
          maxLength={80}
          placeholder="მაგ. მხატვარი, ფოტოგრაფი"
          className={inputClass}
        />
      </label>

      <label className="text-sm font-medium text-text sm:col-span-2">
        ინსტაგრამის ბმული
        <input
          name="instagram"
          maxLength={200}
          placeholder="https://instagram.com/..."
          className={inputClass}
        />
      </label>

      <label className="text-sm font-medium text-text sm:col-span-2">
        მოკლე ბიოგრაფია *
        <textarea
          name="bio"
          required
          rows={5}
          maxLength={2000}
          className={inputClass}
        />
      </label>

      <label className="text-sm font-medium text-text sm:col-span-2">
        ნამუშევრები
        <input
          name="works"
          type="file"
          multiple
          accept="image/jpeg,image/png,image/webp"
          className={`${inputClass} file:mr-3 file:rounded-md file:border-0 file:bg-accent file:px-3 file:py-1.5 file:text-sm file:text-white`}
        />
        <span className="mt-1.5 block text-xs font-normal text-muted">
          მაქსიმუმ {MAX_FILES} ფოტო (JPG, PNG, WEBP), ჯამში 4MB-მდე.
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
          {status === "sending" ? "იგზავნება..." : "გაგზავნა"}
        </Button>
      </div>
    </form>
  );
}
