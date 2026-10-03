import Link from "next/link";
import ArtistCard from "@/components/ArtistCard";
import { artists } from "@/data/artists";

const featured = artists.slice(0, 3);

const steps = [
  {
    n: "01",
    title: "აირჩიე ხელოვანი",
    text: "გადახედე პროფილებს ქალაქისა და მიმართულების მიხედვით.",
  },
  {
    n: "02",
    title: "გაეცანი ნამუშევრებს",
    text: "ნახე მოკლე ბიოგრაფია და ნამუშევრების ადგილმჭერები.",
  },
  {
    n: "03",
    title: "დაუკავშირდი",
    text: "თუ ბმული მითითებულია, ხელოვანს ინსტაგრამით უკავშირდები.",
  },
];

export default function Home() {
  return (
    <div>
      <section className="mx-auto max-w-6xl px-4 pb-16 pt-12 sm:px-6 sm:pt-20">
        <p className="mb-3 text-sm font-medium uppercase tracking-wide text-accent">
          ხელოვანი
        </p>
        <h1 className="max-w-2xl text-balance text-4xl font-semibold leading-tight text-text sm:text-5xl">
          იპოვე ქართველი ხელოვანი ერთ სივრცეში
        </h1>
        <p className="mt-4 max-w-xl text-base leading-relaxed text-muted sm:text-lg">
          ხელოვანი არის დირექტორია მხატვრების, ფოტოგრაფების და სხვა შემოქმედებისთვის.
          ახლა საიტი დემო მონაცემებით მუშაობს.
        </p>
        <Link
          href="/artists"
          className="mt-8 inline-flex rounded-full bg-accent px-6 py-3 text-sm font-medium text-white transition hover:bg-accent-hover"
        >
          ყველა ხელოვანი
        </Link>
      </section>

      <section className="mx-auto max-w-6xl px-4 pb-16 sm:px-6">
        <div className="mb-6 flex items-end justify-between gap-4">
          <h2 className="text-2xl font-semibold text-text">რჩეული ხელოვანები</h2>
          <Link href="/artists" className="text-sm text-accent hover:underline">
            სრული სია
          </Link>
        </div>
        <ul className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {featured.map((artist) => (
            <li key={artist.slug}>
              <ArtistCard artist={artist} />
            </li>
          ))}
        </ul>
      </section>

      <section className="border-t border-border bg-bg">
        <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
          <h2 className="mb-8 text-2xl font-semibold text-text">
            როგორ მუშაობს
          </h2>
          <ol className="grid grid-cols-1 gap-6 sm:grid-cols-3">
            {steps.map((step) => (
              <li
                key={step.n}
                className="rounded-card border border-border bg-surface p-5"
              >
                <p className="mb-3 text-sm font-medium text-accent">{step.n}</p>
                <h3 className="mb-2 text-lg font-semibold text-text">
                  {step.title}
                </h3>
                <p className="text-sm leading-relaxed text-muted">{step.text}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>
    </div>
  );
}
