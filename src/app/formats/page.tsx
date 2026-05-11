import type { Metadata } from "next";
import { InContentAd } from "@/components/ads/AdBanner";
import { formats } from "@/data/formats";

export const metadata: Metadata = {
  title: "Supported Formats",
  description: "Supported GIS, GPS, tabular, and lightweight DXF export formats for GeoCAD Converter."
};

export default function FormatsPage() {
  return (
    <main className="simple-page">
      <span className="section-kicker">Formats</span>
      <h1>Supported GIS formats and DXF export</h1>
      <p className="muted">
        The MVP accepts SHP ZIP, KML, GeoJSON, CSV, and GPX input. It exports GeoJSON, KML, CSV, and lightweight 2D DXF.
      </p>
      <InContentAd className="ad-simple-band" />
      <div className="simple-grid">
        {formats.map((format) => (
          <article key={format.id} className="simple-card">
            <h2>{format.label}</h2>
            <p>{format.commonUseCases.join(", ")}</p>
            <p className="muted">{format.limitations[0]}</p>
          </article>
        ))}
      </div>
    </main>
  );
}
