import type { ConversionPair } from "@/models/ConversionPair";

export function FormatComparison({ pair }: { pair: ConversionPair }) {
  return (
    <section className="content-section pair-content-grid">
      <article>
        <span className="section-kicker">Why convert</span>
        <h2>Why convert {pair.from.toUpperCase()} to {pair.to.toUpperCase()}?</h2>
        <p>
          Teams often need the same spatial data in GIS, mapping, tabular, and lightweight drafting workflows. Local
          browser conversion reduces upload risk and creates a fast handoff format.
        </p>
      </article>
      <article>
        <span className="section-kicker">How it works</span>
        <h2>Browser-first conversion flow</h2>
        <p>
          GeoCAD Converter validates the input, normalizes supported geometry through GeoJSON, generates preview
          metadata, and creates a downloadable result in browser memory.
        </p>
      </article>
      <article>
        <span className="section-kicker">Common issues</span>
        <h2>Projection and sidecar files matter</h2>
        <p>
          SHP uploads should include .shp, .shx, .dbf, and ideally .prj. CRS transformation is not active in this beta,
          so coordinates are preserved.
        </p>
      </article>
      <article>
        <span className="section-kicker">Privacy</span>
        <h2>No server storage</h2>
        <p>
          Supported files are processed locally in browser memory. The current MVP does not upload conversion files to a
          server.
        </p>
      </article>
    </section>
  );
}
