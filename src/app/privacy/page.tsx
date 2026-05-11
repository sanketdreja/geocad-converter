import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy",
  description: "GeoCAD Converter privacy model for local browser-based file conversion."
};

export default function PrivacyPage() {
  return (
    <main className="simple-page">
      <span className="section-kicker">Privacy</span>
      <h1>Your files stay on your computer</h1>
      <p className="muted">
        GeoCAD Converter processes supported conversions locally in browser memory. The current MVP does not upload
        conversion files to our servers or store them remotely.
      </p>
      <div className="simple-grid">
        <article className="simple-card">
          <h2>No account required</h2>
          <p>Use the converter without creating a workspace or sending project files to a remote account.</p>
        </article>
        <article className="simple-card">
          <h2>Browser limitations apply</h2>
          <p>Large files can exhaust memory. Do not process confidential files if you do not understand browser limits.</p>
        </article>
        <article className="simple-card">
          <h2>DWG beta is not conversion</h2>
          <p>DWG, GPKG, and KMZ are waitlist or guide-only in this launch. No DWG conversion is active.</p>
        </article>
        <article className="simple-card">
          <h2>Advertising cookies</h2>
          <p>
            Google AdSense may use cookies. Third-party vendors including Google may use cookies to serve ads based on
            visits to this and other websites.
          </p>
        </article>
        <article className="simple-card">
          <h2>Ad personalization</h2>
          <p>
            Google advertising cookies may personalize ads based on prior visits. You can manage ad personalization in
            your Google advertising settings.
          </p>
        </article>
        <article className="simple-card">
          <h2>Ads are separate from conversion</h2>
          <p>
            Ad scripts are third-party scripts and are separate from file conversion processing. Supported conversion
            files still run locally in browser memory.
          </p>
        </article>
      </div>
    </main>
  );
}
