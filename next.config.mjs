/** @type {import('next').NextConfig} */
const securityHeaders = [
  // საიტი სხვის გვერდში (iframe) არ ჩაისვას: clickjacking-ის წინააღმდეგ
  { key: "X-Frame-Options", value: "DENY" },
  // ბრაუზერმა ფაილის ტიპი თვითნებურად არ გამოიცნოს
  { key: "X-Content-Type-Options", value: "nosniff" },
  // სხვა საიტზე გადასვლისას მხოლოდ დომენი გადაეცეს და არა სრული მისამართი
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  // კამერა, მიკროფონი, ლოკაცია საიტს არ სჭირდება
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=(), payment=()" },
  // ბრაუზერი ყოველთვის https-ით შემოვიდეს
  { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains" },
];

const nextConfig = {
  // Next.js-მა თავის ვერსიას თავს არ დაადებდეს პასუხებში
  poweredByHeader: false,
  async headers() {
    return [{ source: "/:path*", headers: securityHeaders }];
  },
  // „ბეჭდები“ გაერთიანდა „სამკაულში“: ძველი ბმული არ უნდა გაწყდეს
  async redirects() {
    return [{ source: "/categories/bechdebi", destination: "/categories/samkauli", permanent: true }];
  },
};

export default nextConfig;
