import Link from "next/link";
import CategoryArt from "@/components/CategoryArt";
import PageBanner from "@/components/PageBanner";
import { categories, categoryColor, localizeCategory } from "@/data/categories";
import { artists } from "@/data/artists";
import { dictionary } from "@/lib/dictionary";
import { getLang } from "@/lib/i18n";

export async function generateMetadata() {
  return { title: dictionary[await getLang()].categories.title };
}

export default async function CategoriesPage() {
  const lang = await getLang();
  const t = dictionary[lang];

  return (
    <div className="mx-auto max-w-7xl px-4 pb-16 pt-6 sm:px-6 sm:pb-24 sm:pt-10 lg:px-10">
      <PageBanner
        title={t.categories.title}
        text={t.categories.text}
        badge={`${t.categories.total(categories.length)} · ${t.artists.count(artists.length)}`}
        collage={["keramika", "nakhatebi", "samkauli"]}
      />

      <ul className="stagger mt-6 grid grid-cols-2 gap-3 sm:mt-8 sm:grid-cols-3 sm:gap-4 lg:grid-cols-5">
        {categories.map((raw) => {
          const category = localizeCategory(raw, lang);
          const count = artists.filter((artist) =>
            artist.categories.includes(category.slug),
          ).length;
          return (
            <li key={category.slug}>
              <Link
                href={`/categories/${category.slug}`}
                className="group flex h-full flex-col rounded-[1.25rem] border border-border bg-surface p-2 lg:overflow-hidden lg:p-0 transition duration-300 hover:-translate-y-1 hover:border-accent hover:shadow-xl active:scale-[0.99] sm:rounded-[1.5rem]"
              >
                <CategoryArt
                  slug={category.slug}
                  color={categoryColor(raw.slug)}
                  className="aspect-[4/3] rounded-[0.9rem] sm:rounded-[1.1rem] lg:rounded-none"
                />
                <div className="flex flex-1 flex-col px-1.5 pb-1 pt-3 lg:px-4 lg:pb-4 lg:pt-4">
                  <h2 className="text-[15px] font-semibold leading-snug tracking-tight text-text lg:text-lg">
                    {category.name}
                  </h2>
                  <p className="mt-1 hidden text-sm leading-snug text-muted sm:line-clamp-2 lg:hidden">
                    {category.description}
                  </p>
                  <div className="mt-auto flex items-center justify-between gap-2 pt-3">
                    <span className="text-xs font-medium text-muted">{t.categories.count(count)}</span>
                    <span
                      className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-accent-soft text-accent transition duration-300 group-hover:bg-accent group-hover:text-on-accent"
                      aria-hidden
                    >
                      <span className="arrow-slide">→</span>
                    </span>
                  </div>
                </div>
              </Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
