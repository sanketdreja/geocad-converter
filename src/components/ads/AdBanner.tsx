import { AdSlot, type AdSlotProps } from "@/components/ads/AdSlot";

type BannerProps = Omit<AdSlotProps, "placement">;

export function TopAd(props: BannerProps) {
  return <AdSlot placement="top" {...props} />;
}

export function InContentAd(props: BannerProps) {
  return <AdSlot placement="inContent" {...props} />;
}

export function SidebarAd(props: BannerProps) {
  return <AdSlot placement="sidebar" {...props} />;
}

export function BottomAd(props: BannerProps) {
  return <AdSlot placement="bottom" {...props} />;
}

export function ConverterAd(props: BannerProps) {
  return <AdSlot placement="converter" {...props} />;
}

export function ArticleAd(props: BannerProps) {
  return <AdSlot placement="article" {...props} />;
}
