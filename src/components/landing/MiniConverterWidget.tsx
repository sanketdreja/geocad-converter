"use client";

import Link from "next/link";
import { ArrowRight, FileArchive, ShieldCheck } from "lucide-react";
import { LinkButton } from "@/components/ui/Button";
import { FormatChip } from "@/components/ui/FormatChip";
import { conversionPairById, formatLabel } from "@/data/conversionPairs";

export function MiniConverterWidget({ pairId = "shp-to-geojson" }: { pairId?: string }) {
  const pair = conversionPairById[pairId] ?? conversionPairById["shp-to-geojson"];
  const dwgGuide = pair.from === "dwg" || pair.to === "dwg";

  return (
    <div className="mini-converter">
      <div className="mini-drop">
        <FileArchive size={28} />
        <strong>{dwgGuide ? "DWG guidance workflow" : "Drop your file"}</strong>
        <span>{dwgGuide ? "Export DWG to DXF first; browser DWG conversion is waitlist-only" : "SHP ZIP, KML, GeoJSON, CSV, GPX"}</span>
      </div>
      <div className="pair-selector">
        <div>
          <span>From</span>
          <FormatChip format={pair.from} />
        </div>
        <ArrowRight size={16} />
        <div>
          <span>To</span>
          <FormatChip format={pair.to} />
        </div>
      </div>
      <div className="mini-privacy">
        <ShieldCheck size={15} />
        {dwgGuide ? "DWG conversion is not claimed in this browser MVP" : "Your files never leave your computer"}
      </div>
      <LinkButton href={dwgGuide ? "/dwg-beta" : `/convert?to=${pair.to}`} className="wide-button">
        {dwgGuide ? "Join waitlist" : "Start converting"}
      </LinkButton>
      <Link className="small-link" href={pair.route}>
        {formatLabel[pair.from]} to {formatLabel[pair.to]} details
      </Link>
    </div>
  );
}
