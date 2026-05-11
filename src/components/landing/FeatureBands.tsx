import { Boxes, ScanSearch, Shield } from "lucide-react";

export function FeatureBands() {
  return (
    <section className="feature-bands">
      <article>
        <Shield size={22} />
        <div>
          <span className="section-kicker">Privacy-first</span>
          <h2>Designed for sensitive project files</h2>
          <p>
            Parcels, utility maps, and planning files can contain confidential information. Supported conversions run in
            browser memory on your device.
          </p>
        </div>
      </article>
      <article>
        <Boxes size={22} />
        <div>
          <span className="section-kicker">Batch queue</span>
          <h2>Process small batches with clear status</h2>
          <p>Queue management keeps each job visible, with warnings for unsupported pairs and very large files.</p>
        </div>
      </article>
      <article>
        <ScanSearch size={22} />
        <div>
          <span className="section-kicker">Preview</span>
          <h2>Check before you download</h2>
          <p>Preview geometry, layer count, bounds, and CRS status before exporting the final converted file.</p>
        </div>
      </article>
    </section>
  );
}
