import { redirect } from "next/navigation";
import BackLink from "@/components/BackLink";
import JsonLd from "@/components/JsonLd";
import PageBanner from "@/components/PageBanner";
import WorksGallery from "@/components/WorksGallery";
import { getWorkEntries, isNewWork } from "@/data/artists";
import { dictionary } from "@/lib/dictionary";
import { saveCounts } from "@/lib/favoriteStats";
import { toGalleryWork } from "@/lib/galleryWork";
import { getLang } from "@/lib/i18n";
import { SITE_URL } from "@/lib/site";

export async function generateMetadata() {
  const t = dictionary[await getLang()];
  return { title: t.home.newWorks, description: t.home.newWorksText };
}

// ყველა ახალი ნამუშევარი (ბოლო 30 დღე) სიით: მთავარზე „ახალი ნამუშევრების“ „ყველა“ ღილაკი აქ მოდის.
// getWorkEntries უკვე დროით დალაგებულია, ახალი პირველი. თუ ახალი ნამუშევარი არ არის, ხელოვანების გვერდზე გადადის
export default async function NewWorksPage() {
  const lang = await getLang();
  const t = dictionary[lang];
  const saves = await saveCounts();
  const entries = getWorkEntries(lang).filter(({ work }) => isNewWork(work));
  if (entries.length === 0) redirect("/artists");

  const crumbLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: t.nav.home, item: SITE_URL },
      { "@type": "ListItem", position: 2, name: t.home.newWorks, item: `${SITE_URL}/new` },
    ],
  };

  return (
    <div className="mx-auto max-w-7xl px-4 pb-16 pt-1 sm:px-6 sm:pb-24 sm:pt-3 lg:px-10">
      <BackLink href="/" home />
      <JsonLd data={crumbLd} />
      <PageBanner
        title={`✦ ${t.home.newWorks}`}
        text={t.home.newWorksText}
        badge={t.artists.worksCount(entries.length)}
        collage={["keramika", "samkauli", "tekstili"]}
        tone="plum"
      />
      <p className="mt-5 text-xs leading-relaxed text-muted sm:text-sm">{t.priceNote}</p>
      <div className="mt-4">
        <WorksGallery works={entries.map(({ artist, work, index }) => toGalleryWork(artist, work, index, { showArtist: true, saves }))} />
      </div>
    </div>
  );
}
