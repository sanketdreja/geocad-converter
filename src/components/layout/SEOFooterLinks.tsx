import Link from "next/link";
import { seoConversionPairs } from "@/data/conversionPairs";

export function SEOFooterLinks() {
  const links = seoConversionPairs;
  return (
    <section className="seo-links" aria-label="Popular conversion pages">
      <div className="section-kicker">Conversion pages</div>
      <div className="seo-link-grid">
        {links.map((pair) => (
          <Link key={pair.id} href={pair.route}>
            {pair.title}
          </Link>
        ))}
      </div>
    </section>
  );
}
