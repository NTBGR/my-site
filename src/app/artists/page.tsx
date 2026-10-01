import ArtistsFilter from "@/components/ArtistsFilter";
import { artists, getCities } from "@/data/artists";

export default function ArtistsPage() {
  const cities = getCities();

  return (
    <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 sm:py-16">
      <h1 className="text-3xl font-semibold text-[#2c2416] sm:text-4xl">
        ხელოვანები
      </h1>
      <p className="mt-3 max-w-2xl text-[#5c5348]">
        გაფილტრე ქალაქის მიხედვით და გაეცანი დემო პროფილებს.
      </p>
      <div className="mt-8">
        <ArtistsFilter artists={artists} cities={cities} />
      </div>
    </div>
  );
}
