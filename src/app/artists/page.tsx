import ArtistsFilter from "@/components/ArtistsFilter";
import BackLink from "@/components/BackLink";
import PageBanner from "@/components/PageBanner";
import { getLocalizedArtists, workAddedTime } from "@/data/artists";
import { toGalleryWork } from "@/lib/galleryWork";
import { buildSearchIndex } from "@/lib/searchIndex";
import { categories, localizeCategory } from "@/data/categories";
import { dictionary } from "@/lib/dictionary";
import { getLang } from "@/lib/i18n";

export async function generateMetadata() {
  return { title: dictionary[await getLang()].artists.title };
}

export default async function ArtistsPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string | string[] }>;
}) {
  const lang = await getLang();
  const t = dictionary[lang].artists;
  const artists = getLocalizedArtists(lang);
  // ფილტრის ღილაკები: პროფესიები („კერამიკოსები“), კატეგორიებიდან, სადაც ერთი ხელოვანი მაინც არის
  const crafts = categories
    .filter((c) => artists.some((a) => a.categories.includes(c.slug)))
    .map((c) => ({ slug: c.slug, name: localizeCategory(c, lang).makers }));
  const { q: rawQ } = await searchParams;
  // ძებნის ტექსტი: ხელოვანი + ქალაქი + კატეგორიები + ნამუშევრების სახელები ორივე ენაზე
  const kaArtists = getLocalizedArtists("ka");
  const enArtists = getLocalizedArtists("en");
  const searchTexts: Record<string, string> = Object.fromEntries(
    kaArtists.map((ka, i) => [
      ka.slug,
      [ka.name, ka.city, enArtists[i].city, ...ka.works.map((w) => w.title), ...enArtists[i].works.map((w) => w.title), ...ka.categories.flatMap((slug) => { const c = categories.find((x) => x.slug === slug); return c ? [c.name, c.en.name, c.maker, c.en.maker] : []; })].join(" "),
    ]),
  );
  // ნამუშევრების ძებნა: სახელი ორივე ენაზე + ავტორი; დამთხვევაზე ბარათი იქვე იხსნება გადიდებულად
  const workSearch = kaArtists
    .flatMap((ka, ai) => ka.works.map((work, wi) => ({ ka, ai, work, wi })))
    .sort((a, b) => workAddedTime(b.work) - workAddedTime(a.work)) // ყველგან დროით: ახალი პირველი
    .map(({ ka, ai, work, wi }) => ({
      text: [work.title, enArtists[ai].works[wi]?.title ?? "", ka.name, enArtists[ai].name].join(" "),
      categories: ka.categories,
      gallery: toGalleryWork(artists[ai], artists[ai].works[wi], wi, { showArtist: true }),
    }));
  const q = Array.isArray(rawQ) ? rawQ[0] : rawQ ?? "";

  return (
    <div className="mx-auto max-w-7xl px-4 pb-16 pt-1 sm:px-6 sm:pb-24 sm:pt-3 lg:px-10">
      <BackLink href="/" home />
      <PageBanner
        title={t.title}
        text={t.text}
        badge={dictionary[lang].categories.total(crafts.length)}
        collage={["nakhatebi", "keramika", "skulptura"]}
      />

      <div className="mt-8 sm:mt-10">
        <ArtistsFilter key={q} artists={artists} crafts={crafts} initialQuery={q} searchTexts={searchTexts} workSearch={workSearch} gifts={buildSearchIndex(lang).filter((item) => item.kind === "gift")} />
      </div>
    </div>
  );
}
