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
      <div className="mx-auto max-w-7xl px-4 pb-16 pt-10 sm:px-6 lg:px-10 sm:pb-24 sm:pt-14">
        <ArtistsFilter
          artists={getLocalizedArtists(lang)}
          cities={getCities(lang)}
        />
      </div>
    </>
  );
}
