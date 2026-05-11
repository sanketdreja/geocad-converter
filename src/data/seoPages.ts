import { seoConversionPairs } from "@/data/conversionPairs";

export const seoPages = seoConversionPairs.map((pair) => ({
  route: pair.route,
  title: pair.seoTitle,
  description: pair.seoDescription,
  pairId: pair.id,
  enabledInMVP: pair.enabledInMVP
}));
