import ArtistsFilter from "@/components/ArtistsFilter";
import { artists, getCities } from "@/data/artists";

export default function ArtistsPage({
  searchParams,
}: {
  searchParams: { q?: string | string[] };
}) {
  const cities = getCities();
  const query = typeof searchParams.q === "string" ? searchParams.q : "";

  return (
    <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 sm:py-16">
      <h1 className="text-3xl font-semibold text-text sm:text-4xl">
        ხელოვანები
      </h1>
      <p className="mt-3 max-w-2xl text-muted">
        გაფილტრე ქალაქის მიხედვით და გაეცანი დემო პროფილებს.
      </p>
      <div className="mt-8">
        <ArtistsFilter
          key={query}
          artists={artists}
          cities={cities}
          query={query}
        />
      </div>
    </div>
  );
}
