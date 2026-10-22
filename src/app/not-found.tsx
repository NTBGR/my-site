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
          className="group btn btn-light"
        >
          {t.home}
        </Link>
        <Link
          href="/artists"
          className="btn btn-ghost-light"
        >
          {t.artists}
        </Link>
      </div>
    </PageHeader>
  );
}
