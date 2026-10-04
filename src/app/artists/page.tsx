import ArtistsFilter from "@/components/ArtistsFilter";
import PageBanner from "@/components/PageBanner";
import { getLocalizedArtists } from "@/data/artists";
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
  const q = Array.isArray(rawQ) ? rawQ[0] : rawQ ?? "";

  return (
    <div className="mx-auto max-w-7xl px-4 pb-16 pt-6 sm:px-6 sm:pb-24 sm:pt-10 lg:px-10">
      <PageBanner
        title={t.title}
        text={t.text}
        badge={dictionary[lang].categories.total(crafts.length)}
        collage={["nakhatebi", "keramika", "skulptura"]}
      />

      <div className="mt-8 sm:mt-10">
        <ArtistsFilter key={q} artists={artists} crafts={crafts} initialQuery={q} />
      </div>
    </div>
  );
}
