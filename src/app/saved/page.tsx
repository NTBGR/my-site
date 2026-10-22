import SavedWorks, { type SavedCard } from "@/components/SavedWorks";
import BackLink from "@/components/BackLink";
import PageBanner from "@/components/PageBanner";
import { getWorkEntries } from "@/data/artists";
import { toGalleryWork } from "@/lib/galleryWork";
import { dictionary } from "@/lib/dictionary";
import { getLang } from "@/lib/i18n";

export async function generateMetadata() {
  return { title: dictionary[await getLang()].savedPage.title, robots: { index: false } };
}

export default async function SavedPage({ searchParams }: { searchParams: Promise<{ l?: string }> }) {
  const lang = await getLang();
  const listParam = (await searchParams).l;
  const cards: SavedCard[] = getWorkEntries(lang).map(({ artist, work, index, id }) => ({
    key: `${artist.slug}/${id}`,
    title: work.title,
    artistName: artist.name,
    artistSlug: artist.slug,
    image: work.image,
    color: work.color,
    gallery: toGalleryWork(artist, work, index, { showArtist: true }),
  }));
  return (
    <div className="mx-auto max-w-7xl px-4 pb-16 pt-1 sm:px-6 sm:pb-24 sm:pt-3 lg:px-10">
      <BackLink href="/" home />
      <PageBanner title={dictionary[lang].savedPage.title} collage={["samkauli", "keramika", "nakhatebi"]} tone="berry" />
      <SavedWorks cards={cards} sharedKeys={listParam ? listParam.split(",").filter((key) => cards.some((card) => card.key === key)).slice(0, 60) : undefined} />
    </div>
  );
}
