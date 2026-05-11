import { BottomAd, TopAd } from "@/components/ads/AdBanner";
import { CTASection } from "@/components/landing/CTASection";
import { FAQSection } from "@/components/landing/FAQSection";
import { FeatureBands } from "@/components/landing/FeatureBands";
import { HeroSection } from "@/components/landing/HeroSection";
import { HowItWorks } from "@/components/landing/HowItWorks";
import { PopularConversionsGrid } from "@/components/landing/PopularConversionsGrid";
import { SupportedFormatsGrid } from "@/components/landing/SupportedFormatsGrid";
import { TrustBar } from "@/components/landing/TrustBar";

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <TopAd className="ad-page-band" />
      <TrustBar />
      <SupportedFormatsGrid />
      <HowItWorks />
      <FeatureBands />
      <PopularConversionsGrid />
      <BottomAd className="ad-page-band" />
      <FAQSection />
      <CTASection />
    </>
  );
}
