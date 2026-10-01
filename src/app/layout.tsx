import type { Metadata } from "next";
import { Noto_Sans_Georgian } from "next/font/google";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import "./globals.css";

const notoSansGeorgian = Noto_Sans_Georgian({
  subsets: ["georgian", "latin"],
});

export const metadata: Metadata = {
  title: "ხელოვანი",
  description: "ქართველი ხელოვანების დირექტორია — იპოვე მხატვრები და შემოქმედები.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ka">
      <body
        className={`${notoSansGeorgian.className} flex min-h-screen flex-col antialiased`}
      >
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
