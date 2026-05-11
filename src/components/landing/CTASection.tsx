import { ArrowRight } from "lucide-react";
import { LinkButton } from "@/components/ui/Button";

export function CTASection() {
  return (
    <section className="cta-section">
      <div>
        <span className="section-kicker">Start private conversion</span>
        <h2>Open the local conversion workbench</h2>
        <p>Validate files, review CRS warnings, preview geometry, and download converted output in one browser workflow.</p>
      </div>
      <LinkButton href="/convert" size="lg">
        Launch converter
        <ArrowRight size={17} />
      </LinkButton>
    </section>
  );
}
