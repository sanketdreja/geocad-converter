export type AdPlacement = "top" | "inContent" | "sidebar" | "bottom" | "converter" | "article";

export type AdSlotMap = Record<AdPlacement, string>;

function envFlag(value: string | undefined) {
  return value === "true";
}

function cleanSiteUrl(value: string | undefined) {
  return (value?.replace(/\/+$/, "") || "https://geocad-converter.local");
}

export const adsConfig = {
  enabled: envFlag(process.env.NEXT_PUBLIC_ADSENSE_ENABLED) && Boolean(process.env.NEXT_PUBLIC_ADSENSE_CLIENT),
  client: process.env.NEXT_PUBLIC_ADSENSE_CLIENT ?? "",
  autoAds: envFlag(process.env.NEXT_PUBLIC_ADSENSE_AUTO_ADS),
  publisherId: process.env.ADSENSE_PUBLISHER_ID ?? "",
  siteUrl: cleanSiteUrl(process.env.NEXT_PUBLIC_SITE_URL),
  slots: {
    top: process.env.NEXT_PUBLIC_ADSENSE_SLOT_TOP ?? "",
    inContent: process.env.NEXT_PUBLIC_ADSENSE_SLOT_IN_CONTENT ?? "",
    sidebar: process.env.NEXT_PUBLIC_ADSENSE_SLOT_SIDEBAR ?? "",
    bottom: process.env.NEXT_PUBLIC_ADSENSE_SLOT_BOTTOM ?? "",
    converter: process.env.NEXT_PUBLIC_ADSENSE_SLOT_CONVERTER ?? "",
    article: process.env.NEXT_PUBLIC_ADSENSE_SLOT_ARTICLE ?? ""
  } satisfies AdSlotMap
};

export function getAdSlot(placement: AdPlacement) {
  return adsConfig.slots[placement];
}
