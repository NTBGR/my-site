import type { MetadataRoute } from "next";

// გადასვლის ბმულები (/go) და API საძიებო სისტემებმა არ უნდა გახსნან, თორემ დათვლა გაიბერება
export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: "*", allow: "/", disallow: ["/go/", "/api/"] },
  };
}
