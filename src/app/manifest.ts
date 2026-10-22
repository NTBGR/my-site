import type { MetadataRoute } from "next";

// „საწყის ეკრანზე დამატებისას“ (PWA) ტელეფონი აქედან იღებს სახელს და ხატულას.
// ხატულის გარეშე ტელეფონი თავად ხატავს ასოს (შავს), ამიტომ აქ ნამდვილი ხატულებია (ასო „ხ“ საიტის ფერზე).
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "ხელოვანი",
    short_name: "ხელოვანი",
    description: "ქართველი ხელოვანების ხელნაკეთი ნამუშევრები ერთ სივრცეში",
    lang: "ka",
    start_url: "/",
    scope: "/",
    display: "standalone",
    background_color: "#f6f1ea",
    theme_color: "#b84a24",
    icons: [
      { src: "/icons/icon-192.png", sizes: "192x192", type: "image/png", purpose: "any" },
      { src: "/icons/icon-512.png", sizes: "512x512", type: "image/png", purpose: "any" },
      { src: "/icons/icon-maskable-512.png", sizes: "512x512", type: "image/png", purpose: "maskable" },
    ],
  };
}
