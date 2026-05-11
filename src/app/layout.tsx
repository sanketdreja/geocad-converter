import type { Metadata } from "next";
import { GoogleAdSenseScript } from "@/components/ads/GoogleAdSenseScript";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { adsConfig } from "@/config/ads";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "GeoCAD Converter | Private Browser GIS Converter Beta",
    template: "%s | GeoCAD Converter"
  },
  description:
    "Convert SHP ZIP, KML, GeoJSON, CSV, and GPX locally in your browser. Export GeoJSON, KML, CSV, or lightweight DXF.",
  metadataBase: new URL(adsConfig.siteUrl),
  alternates: {
    canonical: "/"
  }
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>
        <GoogleAdSenseScript />
        <div className="site-shell">
          <Header />
          <div className="site-main">{children}</div>
          <Footer />
        </div>
      </body>
    </html>
  );
}
