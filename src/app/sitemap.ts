import type { MetadataRoute } from "next";
import { adsConfig } from "@/config/ads";
import { enabledConversionPairs } from "@/data/conversionPairs";

export default function sitemap(): MetadataRoute.Sitemap {
  const staticRoutes = ["/", "/convert", "/formats", "/help", "/privacy", "/dwg-beta"];
  const converterRoutes = enabledConversionPairs.map((pair) => pair.route);
  const now = new Date();

  return [...staticRoutes, ...converterRoutes].map((route) => ({
    url: `${adsConfig.siteUrl}${route}`,
    lastModified: now,
    changeFrequency: route === "/" ? "weekly" : "monthly",
    priority: route === "/" ? 1 : route.startsWith("/convert/") ? 0.8 : 0.7
  }));
}
