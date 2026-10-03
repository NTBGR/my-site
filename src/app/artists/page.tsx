import ArtistsFilter from "@/components/ArtistsFilter";
import { getLocalizedArtists } from "@/data/artists";
import { dictionary } from "@/lib/dictionary";
import { getLang } from "@/lib/i18n";

export function generateMetadata() {
  return { title: dictionary[getLang()].artists.title };
}

export default function ArtistsPage({
  searchParams,
}: {
  searchParams: { q?: string | string[] };
}) {
  const lang = getLang();
  const t = dictionary[lang].artists;
  const artists = getLocalizedArtists(lang);
  const crafts = Array.from(new Set(artists.map((artist) => artist.category)));
  const q = Array.isArray(searchParams.q) ? searchParams.q[0] : searchParams.q ?? "";

  return (
    <div className="mx-auto max-w-7xl px-4 pb-16 pt-6 sm:px-6 sm:pb-24 sm:pt-10 lg:px-10">
      <h1 className="text-balance text-3xl font-semibold leading-[1.1] tracking-tight text-text sm:text-5xl">
        {t.title}
      </h1>
      <p className="mt-2 text-muted sm:text-lg">{t.text}</p>

      <div className="mt-6 sm:mt-8">
        <ArtistsFilter
          key={q}
          artists={artists}
          crafts={crafts}
          initialQuery={q}
        />
      </div>
    </div>
  );
}
