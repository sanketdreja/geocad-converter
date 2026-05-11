import { formats } from "@/data/formats";

export function SupportedFormatsGrid() {
  return (
    <section className="content-section">
      <div className="section-heading">
        <span className="section-kicker">Formats</span>
        <h2>Launch with realistic professional formats</h2>
        <p>DWG demand is captured honestly while the browser MVP focuses on formats that can ship reliably.</p>
      </div>
      <div className="format-grid">
        {formats.map((format) => (
          <article key={format.id} className="format-card">
            <div>
              <strong>{format.label}</strong>
              <span>{format.category}</span>
            </div>
            <p>{format.commonUseCases.slice(0, 2).join(" - ")}</p>
            <div className="extension-row">
              {format.extensions.slice(0, 4).map((extension) => (
                <code key={extension}>{extension}</code>
              ))}
            </div>
            <small>
              {format.canBeInput && format.canBeOutput ? "Input + output" : format.canBeInput ? "Input only" : format.canBeOutput ? "Output only" : "Waitlist"}
            </small>
          </article>
        ))}
      </div>
    </section>
  );
}
