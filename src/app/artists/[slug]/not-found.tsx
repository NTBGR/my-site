import Link from "next/link";

export default function ArtistNotFound() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
      <h1 className="text-2xl font-semibold text-text">ხელოვანი ვერ მოიძებნა</h1>
      <p className="mt-3 text-muted">
        ამ მისამართზე პროფილი არ არსებობს. სცადე სიიდან არჩევა.
      </p>
      <Link href="/artists" className="mt-6 inline-flex text-accent hover:underline">
        ხელოვანების სია
      </Link>
    </div>
  );
}
