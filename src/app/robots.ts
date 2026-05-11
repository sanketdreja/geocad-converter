import type { MetadataRoute } from "next";
import { adsConfig } from "@/config/ads";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/"
    },
    sitemap: `${adsConfig.siteUrl}/sitemap.xml`
  };
}
