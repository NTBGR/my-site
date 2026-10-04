import Link from "next/link";
import PageHeader from "@/components/PageHeader";
import { dictionary } from "@/lib/dictionary";
import { getLang } from "@/lib/i18n";

// ხელოვანი ვერ მოიძებნა: ნამდვილი 404 სტატუსით და ხელოვანის სპეციფიკური ტექსტით
export default async function ArtistNotFound() {
  const t = dictionary[await getLang()].artist;
  return (
    <PageHeader title={t.notFoundTitle} text={t.notFoundText}>
      <Link
        href="/artists"
        className="inline-flex items-center rounded-full bg-accent px-6 py-3 text-sm font-medium text-on-accent transition duration-300 hover:-translate-y-0.5 hover:bg-accent-hover hover:shadow-lg"
      >
        {t.list}
      </Link>
    </PageHeader>
  );
}
