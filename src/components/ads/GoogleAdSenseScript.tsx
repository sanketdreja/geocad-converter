import Script from "next/script";
import { adsConfig } from "@/config/ads";

export function GoogleAdSenseScript() {
  if (!adsConfig.enabled) return null;

  const scriptUrl = `https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${encodeURIComponent(
    adsConfig.client
  )}`;

  return <Script id="google-adsense" src={scriptUrl} strategy="afterInteractive" crossOrigin="anonymous" />;
}
