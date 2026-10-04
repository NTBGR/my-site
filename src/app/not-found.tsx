import Link from "next/link";
import PageHeader from "@/components/PageHeader";
import { dictionary } from "@/lib/dictionary";
import { getLang } from "@/lib/i18n";

// არარსებული მისამართი: ნამდვილი 404 სტატუსით (Google-ს არ აინდექსებს) და ქართულად
export default async function NotFound() {
  const t = dictionary[await getLang()].notFoundPage;
  return (
    <PageHeader title={t.title} text={t.text}>
      <div className="flex flex-wrap gap-3">
        <Link
          href="/"
          className="inline-flex items-center rounded-full bg-accent px-6 py-3 text-sm font-medium text-on-accent transition duration-300 hover:-translate-y-0.5 hover:bg-accent-hover hover:shadow-lg"
        >
          {t.home}
        </Link>
        <Link
          href="/artists"
          className="inline-flex items-center rounded-full border border-border bg-surface px-6 py-3 text-sm font-medium text-text transition duration-300 hover:-translate-y-0.5 hover:border-accent hover:text-accent"
        >
          {t.artists}
        </Link>
      </div>
    </PageHeader>
  );
}
