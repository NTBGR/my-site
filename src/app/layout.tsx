import type { Metadata } from "next";
import { Noto_Sans_Georgian, Noto_Serif_Georgian } from "next/font/google";
import BottomNav from "@/components/BottomNav";
import Header from "@/components/Header";
import type { SearchIndex } from "@/components/SearchBox";
import { getLocalizedArtists, getWorkEntries } from "@/data/artists";
import { categories, localizeCategory } from "@/data/categories";
import Footer from "@/components/Footer";
import { LangProvider } from "@/components/LangProvider";
import ScrollToTop from "@/components/ScrollToTop";
import { dictionary } from "@/lib/dictionary";
import { getLang } from "@/lib/i18n";
import "./globals.css";

const notoSansGeorgian = Noto_Sans_Georgian({
  subsets: ["georgian", "latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-sans",
});

const notoSerifGeorgian = Noto_Serif_Georgian({
  subsets: ["georgian", "latin"],
  weight: ["400", "600", "700"],
  variable: "--font-serif",
});

const SITE_URL = "https://khelovani.vercel.app";

export async function generateMetadata(): Promise<Metadata> {
  const lang = await getLang();
  const { meta } = dictionary[lang];
  return {
    metadataBase: new URL(SITE_URL),
    // ქვეგვერდები: „ხელოვანები · ხელოვანი“; მთავარი: სრული სათაური
    title: { default: meta.homeTitle, template: `%s · ${meta.title}` },
    description: meta.description,
    openGraph: {
      type: "website",
      siteName: meta.title,
      title: meta.homeTitle,
      description: meta.description,
      locale: lang === "ka" ? "ka_GE" : "en_US",
    },
    twitter: { card: "summary_large_image" },
  };
}

// ადგენს თემას გვერდის ჩვენებამდე, რომ ფერები არ აციმციმდეს
// refresh-ზე ბრაუზერი ძველ ასქროლვის პოზიციას თვითონ აბრუნებს ჩვენი კოდის მერე: ვთიშავთ მხოლოდ refresh-ისთვის
const themeScript = `try{var n=performance.getEntriesByType("navigation")[0];if(n&&n.type==="reload"){history.scrollRestoration="manual"}}catch(e){}try{var t=localStorage.getItem("theme");if(t!=="light"&&t!=="dark"){t=matchMedia("(prefers-color-scheme: dark)").matches?"dark":"light"}document.documentElement.dataset.theme=t}catch(e){}document.documentElement.classList.add("js")`;

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const lang = await getLang();
  // ძებნის ჩამოსაშლელი ვარიანტები: ორივე ენაზე ეძებს, ტექსტი კი მიმდინარე ენაზე ჩანს
  const kaWorks = getWorkEntries("ka");
  const enWorks = getWorkEntries("en");
  const searchIndex: SearchIndex = {
    categories: categories.map((c) => ({ label: localizeCategory(c, lang).name, text: `${c.name} ${c.en.name}`, href: `/categories/${c.slug}` })),
    artists: getLocalizedArtists(lang).map((a) => ({ label: a.name, text: `${a.name} ${a.city}`, href: `/artists/${a.slug}` })),
    works: getWorkEntries(lang).map((e, i) => ({
      label: e.work.title,
      sub: e.artist.name,
      text: `${kaWorks[i].work.title} ${enWorks[i].work.title} ${e.artist.name}`,
      href: `/works/${e.artist.slug}/${e.id}`,
    })),
  };

  return (
    <html lang={lang} data-scroll-behavior="smooth" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body
        className={`${notoSansGeorgian.variable} ${notoSerifGeorgian.variable} flex min-h-screen flex-col bg-bg font-sans text-text antialiased`}
      >
        <LangProvider lang={lang}>
          <ScrollToTop />
          <Header searchIndex={searchIndex} menuCategories={categories.map((c) => ({ label: localizeCategory(c, lang).name, href: `/categories/${c.slug}` }))} />
          <main className="flex-1">{children}</main>
          <Footer />
          {/* ტელეფონის ქვედა ნავიგაციისთვის ადგილი */}
          <div aria-hidden className="h-16 lg:hidden" />
          <BottomNav />
        </LangProvider>
      </body>
    </html>
  );
}
