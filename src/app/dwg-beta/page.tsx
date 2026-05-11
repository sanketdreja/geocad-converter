import type { Metadata } from "next";
import { BottomAd } from "@/components/ads/AdBanner";
import { LinkButton } from "@/components/ui/Button";
import { WaitlistForm } from "@/components/waitlist/WaitlistForm";

export const metadata: Metadata = {
  title: "DWG, GPKG, and KMZ Beta Waitlist",
  description: "Join the DWG, GPKG, and KMZ beta interest list for GeoCAD Converter."
};

export default function DwgBetaPage() {
  return (
    <main className="simple-page">
      <span className="section-kicker">DWG beta</span>
      <h1>DWG support is waitlist-only in the browser MVP</h1>
      <p className="muted">
        DWG is proprietary and difficult to support reliably in pure browser conversion. GeoCAD Converter launches with
        lightweight DXF export as the safer CAD handoff while capturing DWG, GPKG, and KMZ demand for future work.
      </p>
      <div className="simple-grid">
        <article className="simple-card">
          <h2>Recommended launch path</h2>
          <p>Export DWG to DXF in AutoCAD, BricsCAD, LibreCAD, or another CAD tool before preparing GIS-friendly data.</p>
        </article>
        <article className="simple-card">
          <h2>No active DWG conversion</h2>
          <p>This page is a waitlist and guide only. It does not upload, parse, or convert DWG files.</p>
        </article>
        <article className="simple-card">
          <h2>GPKG and KMZ interest</h2>
          <p>GeoPackage and KMZ are also planned formats, not live converter inputs in this launch beta.</p>
        </article>
      </div>
      <div className="waitlist-layout">
        <section>
          <span className="section-kicker">Join waitlist</span>
          <h2>Join DWG beta waitlist</h2>
          <p className="muted">Email and use case are enough. Do not upload confidential CAD files here.</p>
        </section>
        <WaitlistForm />
      </div>
      <BottomAd className="ad-simple-band" />
      <div style={{ marginTop: 24 }}>
        <LinkButton href="/convert">Open supported GIS converter</LinkButton>
      </div>
    </main>
  );
}
