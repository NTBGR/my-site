import Link from "next/link";
import ArtTile, { variantFor } from "@/components/ArtTile";
import PageHeader from "@/components/PageHeader";
import { getArtistBySlug, localizeArtist } from "@/data/artists";
import { dictionary } from "@/lib/dictionary";
import { getLang } from "@/lib/i18n";

export default function ArtistPage({
  params,
}: {
  params: { slug: string };
}) {
  const lang = getLang();
  const t = dictionary[lang].artist;
  const raw = getArtistBySlug(params.slug);
  const artist = raw ? localizeArtist(raw, lang) : undefined;

  if (!artist) {
    return (
      <PageHeader title={t.notFoundTitle} text={t.notFoundText}>
        <Link
          href="/artists"
          className="inline-flex items-center rounded-full bg-accent px-6 py-3 text-sm font-medium text-on-accent transition duration-300 hover:-translate-y-0.5 hover:bg-accent-hover hover:shadow-lg"
        >
          {t.list}
        </Link>
      </PageHeader>
    );
  }

  return (
    <>
      <PageHeader title={artist.name} eyebrow={`${artist.city} · ${artist.category}`}>
        <div className="flex flex-wrap items-center gap-3">
          <Link
            href="/artists"
            className="inline-flex items-center rounded-full border border-border bg-surface px-5 py-2.5 text-sm font-medium text-text transition duration-300 hover:-translate-y-0.5 hover:border-accent hover:text-accent"
          >
            {t.back}
          </Link>
          {artist.instagram ? (
            <a
              href={artist.instagram}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center rounded-full bg-accent px-6 py-2.5 text-sm font-medium text-on-accent transition duration-300 hover:-translate-y-0.5 hover:bg-accent-hover hover:shadow-lg"
            >
              {t.instagram}
            </a>
          ) : null}
        </div>
      </PageHeader>

      <div className="mx-auto max-w-7xl px-4 pb-16 pt-10 sm:px-6 lg:px-10 sm:pb-24 sm:pt-14">
        <p className="max-w-2xl text-xl leading-relaxed text-text">{artist.bio}</p>

        <h2 className="mt-10 text-2xl sm:mt-16 sm:text-2xl font-semibold tracking-tight text-text sm:text-3xl">
          {t.works}
        </h2>
        <ul className="stagger -mx-4 mt-6 flex snap-x snap-mandatory gap-4 overflow-x-auto px-4 pb-4 [scrollbar-width:none] sm:mx-0 sm:mt-8 sm:grid sm:grid-cols-3 sm:gap-5 sm:overflow-visible sm:px-0 sm:pb-0 [&::-webkit-scrollbar]:hidden">
          {artist.works.map((work, i) => (
            <li key={work.title} className="group w-[72%] shrink-0 snap-center sm:w-auto">
              <ArtTile
                color={work.color}
                variant={(variantFor(artist.slug) + i) % 4}
                className="aspect-[4/5] rounded-[1.75rem] shadow-sm transition duration-300 group-hover:-translate-y-1.5 group-hover:shadow-2xl"
              />
              <p className="mt-3 px-1 font-medium text-text transition-colors group-hover:text-accent">
                {work.title}
              </p>
            </li>
          ))}
        </ul>
      </div>
    </>
  );
}
