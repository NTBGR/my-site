import BackLink from "@/components/BackLink";
import CategoryCard from "@/components/CategoryCard";
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
    <div className="mx-auto max-w-7xl px-4 pb-16 pt-1 sm:px-6 sm:pb-24 sm:pt-3 lg:px-10">
      <BackLink href="/" home />
      <PageBanner
        title={t.categories.title}
        text={t.categories.text}
        badge={`${t.categories.total(categories.length)} · ${t.artists.count(artists.length)}`}
        collage={["keramika", "nakhatebi", "samkauli"]}
        tone="teal"
      />

      <ul className="stagger mt-6 grid grid-cols-2 gap-3 sm:mt-8 sm:grid-cols-3 sm:gap-4 lg:grid-cols-5">
        {categories
          .map((raw) => ({ raw, count: artists.filter((artist) => artist.categories.includes(raw.slug)).length }))
          // კატეგორიები, სადაც უკვე არიან ხელოვანები, პირველია
          .sort((a, b) => Number(b.count > 0) - Number(a.count > 0))
          .map(({ raw, count }) => {
            const category = localizeCategory(raw, lang);
            return (
              <li key={category.slug}>
                <CategoryCard
                  slug={category.slug}
                  name={category.name}
                  color={categoryColor(raw.slug)}
                  label={`${category.name} · ${t.home.browse}`}
                  badge={count > 0 ? t.categories.count(count) : t.home.countdown.soon}
                  muted={count === 0}
                />
              </li>
            );
          })}
      </ul>
    </div>
  );
}
