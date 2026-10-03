import Link from "next/link";
import { notFound } from "next/navigation";
import { artists, getArtistBySlug } from "@/data/artists";

export function generateStaticParams() {
  return artists.map((artist) => ({ slug: artist.slug }));
}

export default function ArtistPage({
  params,
}: {
  params: { slug: string };
}) {
  const artist = getArtistBySlug(params.slug);

  if (!artist) notFound();

  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 sm:py-16">
      <Link href="/artists" className="text-sm text-accent hover:underline">
        ← ყველა ხელოვანი
      </Link>
      <h1 className="mt-6 text-3xl font-semibold text-text sm:text-4xl">
        {artist.name}
      </h1>
      <p className="mt-2 text-muted">
        {artist.city} · {artist.category}
      </p>
      <p className="mt-6 leading-relaxed text-text">{artist.bio}</p>

      {artist.instagram ? (
        <a
          href={artist.instagram}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-6 inline-flex rounded-full bg-accent px-5 py-2.5 text-sm font-medium text-white hover:bg-accent-hover"
        >
          ინსტაგრამი
        </a>
      ) : null}

      <h2 className="mt-12 text-xl font-semibold text-text">ნამუშევრები</h2>
      <ul className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-3">
        {artist.works.map((work) => (
          <li key={work.title}>
            <div
              className="h-36 rounded-card border border-border"
              style={{ backgroundColor: work.color }}
              aria-hidden
            />
            <p className="mt-2 text-sm text-muted">{work.title}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}
