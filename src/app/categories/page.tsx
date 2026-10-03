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
      <div className="mx-auto max-w-7xl px-4 pb-16 pt-10 sm:px-6 lg:px-10 sm:pb-24 sm:pt-14">
        <ul className="stagger grid grid-cols-2 gap-3 sm:gap-5 lg:grid-cols-3">
          {categories.map((raw, i) => {
            const category = localizeCategory(raw, lang);
            const count = artists.filter((artist) =>
              artist.categories.includes(category.slug),
            ).length;
            return (
              <li key={category.slug}>
                <Link
                  href={`/categories/${category.slug}`}
                  className="group block h-full rounded-[1.5rem] border border-border bg-surface p-2 transition duration-300 hover:-translate-y-1.5 sm:rounded-[1.75rem] sm:p-2.5 hover:border-accent hover:shadow-xl active:scale-[0.99]"
                >
                  <CategoryArt
                    slug={category.slug}
                    color={tileColors[i % tileColors.length]}
                    className="aspect-[4/3] rounded-[1.1rem] sm:aspect-[16/9] sm:rounded-[1.25rem]"
                  />
                  <div className="px-1.5 pb-1.5 pt-3 sm:px-2.5 sm:pb-2 sm:pt-4">
                    <div className="flex items-start justify-between gap-3">
                      <h2 className="text-[15px] font-semibold leading-snug tracking-tight text-text sm:text-lg">
                        {category.name}
                      </h2>
                      <span
                        className="hidden h-9 w-9 shrink-0 items-center justify-center rounded-full bg-accent-soft sm:flex text-accent transition duration-300 group-hover:bg-accent group-hover:text-on-accent"
                        aria-hidden
                      >
                        <span className="arrow-slide">→</span>
                      </span>
                    </div>
                    <p className="mt-1.5 hidden text-sm leading-relaxed text-muted sm:block">
                      {category.description}
                    </p>
                    <p className="mt-1.5 text-xs font-medium uppercase tracking-wider text-muted sm:mt-3">
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
