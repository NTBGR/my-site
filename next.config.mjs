/** @type {import('next').NextConfig} */
const nextConfig = {
  // „ბეჭდები“ გაერთიანდა „სამკაულში“: ძველი ბმული არ უნდა გაწყდეს
  async redirects() {
    return [{ source: "/categories/bechdebi", destination: "/categories/samkauli", permanent: true }];
  },
};

export default nextConfig;
