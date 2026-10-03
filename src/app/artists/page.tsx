import ArtistsFilter from "@/components/ArtistsFilter";
import PageHeader from "@/components/PageHeader";
import { getCities, getLocalizedArtists } from "@/data/artists";
import { dictionary } from "@/lib/dictionary";
import { getLang } from "@/lib/i18n";

export function generateMetadata() {
  return { title: dictionary[getLang()].artists.title };
}

export default function ArtistsPage() {
  const lang = getLang();
  const t = dictionary[lang].artists;

  return (
    <>
      <PageHeader title={t.title} text={t.text} />
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-16">
        <ArtistsFilter
          artists={getLocalizedArtists(lang)}
          cities={getCities(lang)}
        />
      </div>
    </>
  );
}
