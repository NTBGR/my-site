import SavedWorks from "@/components/SavedWorks";
import { toWorkCards } from "@/lib/workCard";
import { getWorkEntries } from "@/data/artists";
import { dictionary } from "@/lib/dictionary";
import { getLang } from "@/lib/i18n";

export async function generateMetadata() {
  return { title: dictionary[await getLang()].savedPage.title, robots: { index: false } };
}

export default async function SavedPage() {
  const lang = await getLang();
  const cards = toWorkCards(getWorkEntries(lang));
  return (
    <div className="mx-auto max-w-7xl px-4 pb-16 pt-6 sm:px-6 sm:pb-24 sm:pt-10 lg:px-10">
      <h1 className="text-3xl font-semibold tracking-tight text-text sm:text-4xl">{dictionary[lang].savedPage.title}</h1>
      <SavedWorks cards={cards} />
    </div>
  );
}
