import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight } from "lucide-react";
import { ArticleAd, InContentAd } from "@/components/ads/AdBanner";
import { CTASection } from "@/components/landing/CTASection";
import { ConversionPairHero } from "@/components/landing/ConversionPairHero";
import { ConversionFAQSection } from "@/components/landing/ConversionFAQSection";
import { FormatComparison } from "@/components/landing/FormatComparison";
import { Badge } from "@/components/ui/Badge";
import { seoConversionPairs, formatLabel } from "@/data/conversionPairs";
import { SEOPageController } from "@/controllers/SEOPageController";
import type { SupportedFormat } from "@/models/FormatDefinition";

type PairPageProps = {
  params: Promise<{ pair: string }>;
};

export function generateStaticParams() {
  return seoConversionPairs.map((pair) => ({ pair: pair.id }));
}

export async function generateMetadata({ params }: PairPageProps): Promise<Metadata> {
  const { pair: pairId } = await params;
  const pair = SEOPageController.getSeoPair(pairId);
  if (!pair) {
    const unsupported = parsePairId(pairId);
    if (!unsupported) return {};
    return {
      title: `${formatLabel[unsupported.from]} to ${formatLabel[unsupported.to]} is not available in beta`,
      description: "This conversion pair is not available in the browser GIS converter beta."
    };
  }

  return {
    title: pair.seoTitle,
    description: pair.seoDescription
  };
}

const formatIds = new Set(Object.keys(formatLabel));

function parsePairId(pairId: string): { from: SupportedFormat; to: SupportedFormat } | null {
  const [from, to] = pairId.split("-to-");
  if (!from || !to || !formatIds.has(from) || !formatIds.has(to)) return null;
  return { from: from as SupportedFormat, to: to as SupportedFormat };
}

function UnsupportedPairPage({ pairId }: { pairId: string }) {
  const parsed = parsePairId(pairId);
  if (!parsed) notFound();

  const from = formatLabel[parsed.from];
  const to = formatLabel[parsed.to];

  return (
    <main className="simple-page">
      <span className="section-kicker">Not available in beta</span>
      <h1>
        {from} to {to} is not a live browser conversion
      </h1>
      <p className="muted">
        This launch supports SHP ZIP, KML, GeoJSON, CSV, and GPX inputs with GeoJSON, KML, CSV, and lightweight 2D DXF
        outputs. Unsupported pairs are shown as guidance only and are not offered as active converter pages.
      </p>
      <div className="simple-grid">
        <article className="simple-card">
          <h2>Use supported inputs</h2>
          <p>Try SHP ZIP, KML, GeoJSON, CSV, or GPX as your source format.</p>
        </article>
        <article className="simple-card">
          <h2>Use supported outputs</h2>
          <p>Export GeoJSON, KML, CSV, or lightweight 2D DXF from the browser beta.</p>
        </article>
        <article className="simple-card">
          <h2>Waitlist formats</h2>
          <p>DWG, GPKG, KMZ, DXF input, SHP output, and CRS reprojection are not active in this beta.</p>
        </article>
      </div>
      <div className="hero-actions">
        <Link className="button button-primary button-lg" href="/convert">
          Open supported converter
          <ArrowRight size={17} />
        </Link>
        <Link className="button button-secondary button-lg" href="/dwg-beta">
          Join format waitlist
        </Link>
      </div>
    </main>
  );
}

export default async function PairPage({ params }: PairPageProps) {
  const { pair: pairId } = await params;
  const pair = SEOPageController.getSeoPair(pairId);
  if (!pair) return <UnsupportedPairPage pairId={pairId} />;
  const related = SEOPageController.getRelatedPairs(pair.id);
  const dwgGuide = pair.from === "dwg" || pair.to === "dwg";

  return (
    <>
      <ConversionPairHero pair={pair} />
      <InContentAd className="ad-page-band" />
      {dwgGuide ? (
        <section className="content-section">
          <div className="section-heading">
            <span className="section-kicker">DWG guidance</span>
            <h2>DWG support is waitlist-only</h2>
            <p>
              GeoCAD Converter does not claim full local DWG conversion in the browser MVP. Export DWG to DXF from your
              CAD software first, then prepare a supported GIS input such as SHP ZIP, GeoJSON, KML, CSV, or GPX.
            </p>
          </div>
          <div className="conversion-grid">
            <Link className="conversion-card" href="/dwg-beta">
              <span>Beta</span>
              <strong>Join DWG waitlist</strong>
              <small>Architects and CAD teams</small>
              <ArrowRight size={16} />
            </Link>
            <Link className="conversion-card" href="/convert">
              <span>Workaround</span>
              <strong>Use supported GIS inputs</strong>
              <small>Practical launch path</small>
              <ArrowRight size={16} />
            </Link>
          </div>
        </section>
      ) : (
        <FormatComparison pair={pair} />
      )}

      <section className="content-section">
        <div className="section-heading">
          <span className="section-kicker">Common problems</span>
          <h2>Issues to check before converting</h2>
          <p>
            Projection metadata, missing shapefile parts, unsupported output pairs, and large geometry collections are
            the main sources of conversion problems.
          </p>
        </div>
        <div className="format-grid">
          {pair.warnings.length ? (
            pair.warnings.map((warning) => (
              <article className="format-card" key={warning}>
                <Badge tone="amber">Warning</Badge>
                <p>{warning}</p>
              </article>
            ))
          ) : (
            <>
              <article className="format-card">
                <Badge tone="green">SHP</Badge>
                <p>Upload a ZIP with .shp, .shx, .dbf, and ideally .prj so attributes and projection data survive.</p>
              </article>
              <article className="format-card">
                <Badge tone="cyan">CRS</Badge>
                <p>CRS transformation is not active in this beta. Coordinates are preserved.</p>
              </article>
              <article className="format-card">
                <Badge tone="blue">Preview</Badge>
                <p>Check bounds and feature count before downloading the converted file.</p>
              </article>
            </>
          )}
        </div>
      </section>

      <ConversionFAQSection pair={pair} />
      <ArticleAd className="ad-page-band" />

      <section className="content-section">
        <div className="section-heading">
          <span className="section-kicker">Related conversions</span>
          <h2>More {formatLabel[pair.from]} and {formatLabel[pair.to]} workflows</h2>
        </div>
        <div className="conversion-grid">
          {related.map((relatedPair) => (
            <Link key={relatedPair.id} href={relatedPair.route} className="conversion-card">
              <span>{relatedPair.enabledInMVP ? "MVP" : "Roadmap"}</span>
              <strong>{relatedPair.title}</strong>
              <small>{relatedPair.difficulty}</small>
              <ArrowRight size={16} />
            </Link>
          ))}
        </div>
      </section>

      <CTASection />
    </>
  );
}
