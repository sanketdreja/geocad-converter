import { ArrowRight, ShieldCheck } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { FormatChip } from "@/components/ui/FormatChip";
import { MiniConverterWidget } from "@/components/landing/MiniConverterWidget";
import { formatLabel } from "@/data/conversionPairs";
import type { ConversionPair } from "@/models/ConversionPair";

export function ConversionPairHero({ pair }: { pair: ConversionPair }) {
  const dwgGuide = pair.from === "dwg" || pair.to === "dwg";

  return (
    <section className="pair-hero">
      <div className="pair-copy">
        <Badge tone={pair.enabledInMVP ? "green" : "amber"}>{pair.enabledInMVP ? "MVP route" : "Guide + roadmap"}</Badge>
        <h1>
          {dwgGuide
            ? `${formatLabel[pair.from]} to ${formatLabel[pair.to]} guide`
            : `Convert ${formatLabel[pair.from]} to ${formatLabel[pair.to]} locally in your browser`}
        </h1>
        <p>
          {dwgGuide
            ? "DWG support is waitlist-only. For now, export DWG to DXF in your CAD software and use a GIS-friendly format for browser conversion."
            : pair.seoDescription}
        </p>
        <div className="pair-flow">
          <FormatChip format={pair.from} />
          <ArrowRight size={17} />
          <FormatChip format={pair.to} />
        </div>
        <div className="mini-privacy">
          <ShieldCheck size={16} />
          {dwgGuide
            ? "No full DWG browser conversion is promised on this page."
            : "Your files are processed locally whenever supported by the browser engine."}
        </div>
      </div>
      <MiniConverterWidget pairId={pair.id} />
    </section>
  );
}
