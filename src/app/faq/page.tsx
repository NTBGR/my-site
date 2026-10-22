import Link from "next/link";
import BackLink from "@/components/BackLink";
import FaqList from "@/components/FaqList";
import PageBanner from "@/components/PageBanner";
import { CONTACT_EMAIL } from "@/app/privacy/content";
import { dictionary } from "@/lib/dictionary";
import { getLang } from "@/lib/i18n";

export async function generateMetadata() {
  const t = dictionary[await getLang()].join;
  return { title: t.faqTitle, description: t.faqIntro };
}

// ხშირად დასმული კითხვები ხელოვანებისთვის: ცალკე გვერდი, ფუტერიდან და განაცხადის გვერდიდან
export default async function FaqPage() {
  const t = dictionary[await getLang()].join;

  return (
    <div className="mx-auto max-w-7xl px-4 pb-16 pt-1 sm:px-6 sm:pb-24 sm:pt-3 lg:px-10">
      <BackLink href="/" home />
      <PageBanner title={t.faqTitle} text={t.faqIntro} badge={t.title} collage={["keramika", "samkauli", "tekstili"]} tone="ink">
        <Link
          href="/join#apply"
          className="group btn btn-light"
        >
          {t.faqCta}
          <span className="arrow-slide" aria-hidden>
            →
          </span>
        </Link>
      </PageBanner>

      <FaqList standalone items={t.faq} title={t.faqTitle} contactTitle={t.faqMore} contactText={t.faqMoreText} contactEmail={CONTACT_EMAIL} />
    </div>
  );
}
