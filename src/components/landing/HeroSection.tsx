import { ArrowRight, CheckCircle2, Database, LockKeyhole, Map } from "lucide-react";
import { LinkButton } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { MiniConverterWidget } from "@/components/landing/MiniConverterWidget";

export function HeroSection() {
  return (
    <section className="hero-section">
      <div className="hero-copy">
        <Badge tone="cyan">Private browser GIS converter beta</Badge>
        <h1>Convert GIS files locally in your browser.</h1>
        <p>
          Convert SHP ZIP, KML, GeoJSON, CSV, and GPX on your device. Preview geometry, preserve simple attributes where
          possible, and export GeoJSON, KML, CSV, or lightweight 2D DXF.
        </p>
        <div className="hero-actions">
          <LinkButton href="/convert" size="lg">
            Start converting
            <ArrowRight size={17} />
          </LinkButton>
          <LinkButton href="/formats" size="lg" variant="secondary">
            View supported formats
          </LinkButton>
        </div>
        <div className="trust-bullets">
          <span>
            <LockKeyhole size={16} />
            Local processing
          </span>
          <span>
            <Database size={16} />
            Batch queue
          </span>
          <span>
            <Map size={16} />
            Preview before download
          </span>
          <span>
            <CheckCircle2 size={16} />
            No account required
          </span>
        </div>
      </div>
      <MiniConverterWidget />
    </section>
  );
}
