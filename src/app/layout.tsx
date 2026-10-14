import type { Metadata } from "next";
import { Noto_Sans_Georgian, Noto_Serif_Georgian } from "next/font/google";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { LangProvider } from "@/components/LangProvider";
import ScrollToTop from "@/components/ScrollToTop";
import { dictionary } from "@/lib/dictionary";
import { activeTags } from "@/data/tags";
import { getLang } from "@/lib/i18n";
import { SITE_URL } from "@/lib/site";
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


export async function generateMetadata(): Promise<Metadata> {
  const lang = await getLang();
  const { meta } = dictionary[lang];
  return {
    metadataBase: new URL(SITE_URL),
    // ყოველ გვერდს საკუთარი მისამართი canonical-ად (დუბლიკატების თავიდან ასაცილებლად)
    alternates: { canonical: "./" },
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
    // საიტს საკუთარი ქართული/ინგლისური გადამრთველი აქვს; ბრაუზერის ავტო-თარგმანი ქართულს ამახინჯებს
    other: { google: "notranslate" },
  };
}

// ადგენს თემას გვერდის ჩვენებამდე, რომ ფერები არ აციმციმდეს.
// ნაგულისხმევი ყოველთვის ღიაა; ბნელი მხოლოდ მაშინ, თუ ადამიანმა თვითონ აირჩია
// refresh-ზე ბრაუზერი ძველ ასქროლვის პოზიციას თვითონ აბრუნებს ჩვენი კოდის მერე: ვთიშავთ მხოლოდ refresh-ისთვის
const themeScript = `try{var n=performance.getEntriesByType("navigation")[0];if(n&&n.type==="reload"){history.scrollRestoration="manual"}}catch(e){}try{var t=localStorage.getItem("theme");if(t!=="light"&&t!=="dark"){t="light"}document.documentElement.dataset.theme=t}catch(e){}document.documentElement.classList.add("js")`;

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const lang = await getLang();

  return (
    <html lang={lang} translate="no" data-scroll-behavior="smooth" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body
        className={`${notoSansGeorgian.variable} ${notoSerifGeorgian.variable} flex min-h-screen flex-col bg-bg font-sans text-text antialiased`}
      >
        <LangProvider lang={lang}>
          <ScrollToTop />
          <Header tags={activeTags(lang)} />
          <main className="flex-1">{children}</main>
          <Footer />
        </LangProvider>
      </body>
    </html>
  );
}
