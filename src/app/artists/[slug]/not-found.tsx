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
        className="group btn btn-light"
      >
        {t.list}
      </Link>
    </PageHeader>
  );
}
