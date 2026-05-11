import { Download, Eye, FileInput, SlidersHorizontal, Waypoints } from "lucide-react";

const steps = [
  { icon: FileInput, title: "Drop your files", copy: "Add SHP ZIP, KML, GeoJSON, CSV, or GPX files." },
  { icon: SlidersHorizontal, title: "Choose output", copy: "Select the target format and preserve attributes where possible." },
  { icon: Waypoints, title: "Review CRS", copy: "CRS transformation is not active in this beta; coordinates are preserved." },
  { icon: Eye, title: "Preview result", copy: "Check bounds, layers, and feature count before download." },
  { icon: Download, title: "Download locally", copy: "Save one output file or a ZIP of successful batch jobs." }
];

export function HowItWorks() {
  return (
    <section className="content-section">
      <div className="section-heading">
        <span className="section-kicker">Workflow</span>
        <h2>A conversion flow built for technical files</h2>
      </div>
      <div className="steps-grid">
        {steps.map(({ icon: Icon, title, copy }) => (
          <article key={title} className="step-card">
            <Icon size={20} />
            <h3>{title}</h3>
            <p>{copy}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
