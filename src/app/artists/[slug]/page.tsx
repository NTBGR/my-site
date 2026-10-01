import Link from "next/link";
import { getArtistBySlug } from "@/data/artists";

export default function ArtistPage({
  params,
}: {
  params: { slug: string };
}) {
  const artist = getArtistBySlug(params.slug);

  if (!artist) {
    return (
      <div className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
        <h1 className="text-2xl font-semibold text-[#2c2416]">
          ხელოვანი ვერ მოიძებნა
        </h1>
        <p className="mt-3 text-[#5c5348]">
          ამ მისამართზე პროფილი არ არსებობს. სცადე სიიდან არჩევა.
        </p>
        <Link
          href="/artists"
          className="mt-6 inline-flex text-[#c45c3e] hover:underline"
        >
          ხელოვანების სია
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 sm:py-16">
      <Link href="/artists" className="text-sm text-[#c45c3e] hover:underline">
        ← ყველა ხელოვანი
      </Link>
      <h1 className="mt-6 text-3xl font-semibold text-[#2c2416] sm:text-4xl">
        {artist.name}
      </h1>
      <p className="mt-2 text-[#6b6258]">
        {artist.city} · {artist.category}
      </p>
      <p className="mt-6 leading-relaxed text-[#4a4033]">{artist.bio}</p>

      {artist.instagram ? (
        <a
          href={artist.instagram}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-6 inline-flex rounded-full bg-[#c45c3e] px-5 py-2.5 text-sm font-medium text-white hover:bg-[#a94b32]"
        >
          ინსტაგრამი
        </a>
      ) : null}

      <h2 className="mt-12 text-xl font-semibold text-[#2c2416]">ნამუშევრები</h2>
      <ul className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-3">
        {artist.works.map((work) => (
          <li key={work.title}>
            <div
              className="h-36 rounded-2xl border border-[#eadfd3]"
              style={{ backgroundColor: work.color }}
              aria-hidden
            />
            <p className="mt-2 text-sm text-[#5c5348]">{work.title}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}
