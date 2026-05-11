import { conversionPairById, enabledConversionPairs, seoConversionPairs } from "@/data/conversionPairs";

export function getSeoPair(pairId: string) {
  return conversionPairById[pairId] ?? null;
}

export function getRelatedPairs(pairId: string) {
  const pair = getSeoPair(pairId);
  if (!pair) return seoConversionPairs.slice(0, 6);

  return enabledConversionPairs
    .filter((candidate) => candidate.id !== pairId && (candidate.from === pair.from || candidate.to === pair.to))
    .slice(0, 6);
}
