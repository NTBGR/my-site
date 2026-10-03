import type { Metadata } from "next";
import { Noto_Sans_Georgian, Noto_Serif_Georgian } from "next/font/google";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
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

export const metadata: Metadata = {
  title: "ხელოვანი",
  description:
    "ქართველი ხელოვანების დირექტორია — იპოვე მხატვრები და შემოქმედები.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ka">
      <body
        className={`${notoSansGeorgian.variable} ${notoSerifGeorgian.variable} flex min-h-screen flex-col bg-bg font-sans text-text antialiased`}
      >
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
