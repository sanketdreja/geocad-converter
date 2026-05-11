import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { seoConversionPairs } from "@/data/conversionPairs";

export function PopularConversionsGrid() {
  return (
    <section className="content-section">
      <div className="section-heading">
        <span className="section-kicker">Popular conversions</span>
        <h2>Supported launch conversion pages</h2>
        <p>Ten focused pages cover only pairs that the browser beta can convert today.</p>
      </div>
      <div className="conversion-grid">
        {seoConversionPairs.map((pair) => (
          <Link key={pair.id} href={pair.route} className="conversion-card">
            <span>{pair.difficulty}</span>
            <strong>{pair.title}</strong>
            <small>Supported beta route</small>
            <ArrowUpRight size={16} />
          </Link>
        ))}
      </div>
    </section>
  );
}
