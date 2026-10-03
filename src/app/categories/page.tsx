import Link from "next/link";
import CategoryArt from "@/components/CategoryArt";
import PageHeader from "@/components/PageHeader";
import { categories, localizeCategory } from "@/data/categories";
import { artists } from "@/data/artists";
import { dictionary } from "@/lib/dictionary";
import { getLang } from "@/lib/i18n";

export function generateMetadata() {
  return { title: dictionary[getLang()].categories.title };
}

const tileColors = [
  "#c4553a",
  "#3d5a73",
  "#5e7a55",
  "#7a4e6a",
  "#b07a4a",
  "#4a6d8c",
  "#a65d3f",
  "#6b7c6a",
  "#8a6a9c",
  "#b44532",
];

export default function CategoriesPage() {
  const lang = getLang();
  const t = dictionary[lang].categories;

  return (
    <>
      <PageHeader title={t.title} text={t.text} />
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-16">
        <ul className="stagger grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {categories.map((raw, i) => {
            const category = localizeCategory(raw, lang);
            const count = artists.filter((artist) =>
              artist.categories.includes(category.slug),
            ).length;
            return (
              <li key={category.slug}>
                <Link
                  href={`/categories/${category.slug}`}
                  className="group block h-full rounded-[1.75rem] border border-border bg-surface p-2.5 transition duration-300 hover:-translate-y-1.5 hover:border-accent hover:shadow-xl active:scale-[0.99]"
                >
                  <CategoryArt
                    slug={category.slug}
                    color={tileColors[i % tileColors.length]}
                    className="aspect-[16/9] rounded-[1.25rem]"
                  />
                  <div className="px-2.5 pb-2 pt-4">
                    <div className="flex items-start justify-between gap-3">
                      <h2 className="text-lg font-semibold tracking-tight text-text">
                        {category.name}
                      </h2>
                      <span
                        className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-accent-soft text-accent transition duration-300 group-hover:bg-accent group-hover:text-on-accent"
                        aria-hidden
                      >
                        <span className="arrow-slide">→</span>
                      </span>
                    </div>
                    <p className="mt-1.5 text-sm leading-relaxed text-muted">
                      {category.description}
                    </p>
                    <p className="mt-3 text-xs font-medium uppercase tracking-wider text-muted">
                      {t.count(count)}
                    </p>
                  </div>
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
    </>
  );
}
