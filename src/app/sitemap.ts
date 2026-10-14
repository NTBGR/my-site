import type { MetadataRoute } from "next";
import { artists } from "@/data/artists";
import { categories } from "@/data/categories";

const SITE_URL = "https://khelovani.vercel.app";

// საძიებო სისტემებისთვის გვერდების სია: ავტომატურად იზრდება, როცა ახალი ხელოვანი ან კატეგორია ემატება
export default function sitemap(): MetadataRoute.Sitemap {
  const pages = ["", "/artists", "/categories", "/about", "/join", "/blog", "/privacy"];
  return [
    ...pages.map((path) => ({ url: `${SITE_URL}${path}` })),
    ...categories.map((category) => ({ url: `${SITE_URL}/categories/${category.slug}` })),
    ...artists.map((artist) => ({ url: `${SITE_URL}/artists/${artist.slug}` })),
  ];
}
