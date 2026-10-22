import Link from "next/link";

// ტელეფონზე გადასაფურცლი ზოლის ბოლო ბარათი: „ყველას ნახვა“ (ხელოვანები, კატეგორიები, ახალი ნამუშევრები ერთნაირად)
export default function SeeAllCard({ href, label }: { href: string; label: string }) {
  return (
    <Link
      href={href}
      className="group flex h-full min-h-48 flex-col items-center justify-center gap-3 rounded-[1.5rem] border-[1.5px] border-dashed border-[color-mix(in_srgb,var(--text)_22%,transparent)] bg-bg p-4 text-center transition duration-300 active:scale-[0.99]"
    >
      <span className="flex h-12 w-12 items-center justify-center rounded-full bg-accent-soft text-xl text-accent" aria-hidden>
        →
      </span>
      <span className="text-base font-semibold leading-snug text-text">{label}</span>
    </Link>
  );
}
