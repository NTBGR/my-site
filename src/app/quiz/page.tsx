import GiftQuiz, { type QuizWork } from "@/components/GiftQuiz";
import BackLink from "@/components/BackLink";
import JsonLd from "@/components/JsonLd";
import PageBanner from "@/components/PageBanner";
import { effectivePrice, getWorkEntries, isNewWork, workId } from "@/data/artists";
import { toGalleryWork } from "@/lib/galleryWork";
import { dictionary } from "@/lib/dictionary";
import { getLang } from "@/lib/i18n";
import { SITE_URL } from "@/lib/site";

export async function generateMetadata() {
  const t = dictionary[await getLang()].quiz;
  return { title: t.title, description: t.intro };
}

// საჩუქრის შერჩევა: სამი კითხვა და შედეგი უკვე არსებული ნამუშევრებიდან (თაგები, ფასი, ხელობა)
export default async function QuizPage() {
  const lang = await getLang();
  const t = dictionary[lang].quiz;
  const works: QuizWork[] = getWorkEntries(lang).map(({ artist, work, index }) => ({
    key: `${artist.slug}/${workId(work, index)}`,
    title: work.title,
    price: effectivePrice(artist, work),
    image: work.image,
    artistName: artist.name,
    artistSlug: artist.slug,
    tags: work.tags ?? [],
    kind: artist.categories.includes("samkauli")
      ? "jewelry"
      : artist.categories.includes("tekstili")
        ? "bouquet"
        : artist.categories.includes("posterebi")
          ? "poster"
          : "other",
    isNew: isNewWork(work),
    gallery: toGalleryWork(artist, work, index, { showArtist: true }),
  }));

  const ld = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: dictionary[lang].nav.home, item: SITE_URL },
      { "@type": "ListItem", position: 2, name: t.title, item: `${SITE_URL}/quiz` },
    ],
  };

  return (
    <div className="mx-auto max-w-7xl px-4 pb-16 pt-1 sm:px-6 sm:pb-24 sm:pt-3 lg:px-10">
      <BackLink href="/" home />
      <JsonLd data={ld} />
      <PageBanner title={`🎯 ${t.title}`} text={t.intro} collage={["sachuqrebi", "keramika", "samkauli"]} tone="teal" />
      <div className="mx-auto mt-8 max-w-3xl sm:mt-10">
        <GiftQuiz works={works} />
      </div>
    </div>
  );
}
