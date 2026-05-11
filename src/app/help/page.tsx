import type { Metadata } from "next";
import { InContentAd } from "@/components/ads/AdBanner";

export const metadata: Metadata = {
  title: "Guides",
  description: "Guides for shapefiles, CRS settings, DWG workarounds, and local GIS conversion."
};

export default function HelpPage() {
  return (
    <main className="simple-page">
      <span className="section-kicker">Guides</span>
      <h1>Conversion guides for the browser beta</h1>
      <p className="muted">Practical notes for SHP ZIP, KML, GeoJSON, CSV, GPX, CRS warnings, and lightweight DXF export.</p>
      <InContentAd className="ad-simple-band" />
      <div className="simple-grid">
        <article className="simple-card">
          <h2>Shapefile ZIPs</h2>
          <p>Include .shp, .shx, .dbf, and .prj files with matching base names before uploading.</p>
        </article>
        <article className="simple-card">
          <h2>Coordinate systems</h2>
          <p>CRS transformation is not active in this beta. Coordinates are preserved even when a CRS is selected.</p>
        </article>
        <article className="simple-card">
          <h2>Lightweight DXF export</h2>
          <p>DXF output contains simple 2D point and line geometry. Blocks, labels, styles, dimensions, and annotations are not preserved.</p>
        </article>
        <article className="simple-card">
          <h2>DWG workaround</h2>
          <p>Export DWG to DXF in CAD software first. DWG browser conversion is waitlist-only.</p>
        </article>
      </div>
    </main>
  );
}
