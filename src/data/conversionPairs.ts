import type { ConversionPair } from "@/models/ConversionPair";
import type { SupportedFormat } from "@/models/FormatDefinition";

const labels: Record<SupportedFormat, string> = {
  shp: "SHP ZIP",
  kml: "KML",
  kmz: "KMZ",
  dxf: "DXF",
  geojson: "GeoJSON",
  csv: "CSV",
  gpx: "GPX",
  gpkg: "GPKG",
  dwg: "DWG"
};

const supportedPairs: Array<{
  from: SupportedFormat;
  to: SupportedFormat;
  difficulty: ConversionPair["difficulty"];
  supportsBatch: boolean;
}> = [
  { from: "shp", to: "geojson", difficulty: "medium", supportsBatch: true },
  { from: "shp", to: "kml", difficulty: "medium", supportsBatch: true },
  { from: "shp", to: "csv", difficulty: "medium", supportsBatch: true },
  { from: "shp", to: "dxf", difficulty: "advanced", supportsBatch: true },
  { from: "kml", to: "geojson", difficulty: "easy", supportsBatch: true },
  { from: "kml", to: "csv", difficulty: "easy", supportsBatch: true },
  { from: "kml", to: "dxf", difficulty: "medium", supportsBatch: true },
  { from: "geojson", to: "kml", difficulty: "easy", supportsBatch: true },
  { from: "geojson", to: "csv", difficulty: "easy", supportsBatch: true },
  { from: "geojson", to: "dxf", difficulty: "medium", supportsBatch: true },
  { from: "csv", to: "geojson", difficulty: "easy", supportsBatch: true },
  { from: "csv", to: "kml", difficulty: "easy", supportsBatch: true },
  { from: "csv", to: "dxf", difficulty: "medium", supportsBatch: true },
  { from: "gpx", to: "geojson", difficulty: "easy", supportsBatch: true },
  { from: "gpx", to: "kml", difficulty: "easy", supportsBatch: true },
  { from: "gpx", to: "csv", difficulty: "easy", supportsBatch: true },
  { from: "gpx", to: "dxf", difficulty: "medium", supportsBatch: true }
];

const seoPairIds = [
  "shp-to-geojson",
  "shp-to-kml",
  "shp-to-csv",
  "shp-to-dxf",
  "kml-to-geojson",
  "kml-to-csv",
  "geojson-to-kml",
  "geojson-to-csv",
  "csv-to-geojson",
  "csv-to-kml"
];

function pairWarnings(from: SupportedFormat, to: SupportedFormat) {
  const warnings: string[] = [
    "CRS transformation is not active in this beta. Coordinates are preserved.",
    "Large files can exhaust browser memory; split very large datasets before converting."
  ];

  if (from === "shp") {
    warnings.push("Upload a ZIP containing .shp, .shx, .dbf, and ideally .prj sidecar files.");
    warnings.push("If .prj is missing, the source CRS may be unknown.");
  }

  if (to === "dxf") {
    warnings.push("DXF export is lightweight 2D geometry only. CAD blocks, labels, styles, dimensions, and annotations are not preserved.");
  }

  return warnings;
}

function makeSupportedPair({
  from,
  to,
  difficulty,
  supportsBatch
}: {
  from: SupportedFormat;
  to: SupportedFormat;
  difficulty: ConversionPair["difficulty"];
  supportsBatch: boolean;
}): ConversionPair {
  const fromLabel = labels[from];
  const toLabel = labels[to];

  return {
    id: `${from}-to-${to}`,
    from,
    to,
    title: `Convert ${fromLabel} to ${toLabel}`,
    seoTitle: `Convert ${fromLabel} to ${toLabel} Locally | Private Browser GIS Converter`,
    seoDescription: `Convert ${fromLabel} files to ${toLabel} in your browser. Files stay on your device, attributes are preserved where possible, and CRS coordinates are kept unchanged in this beta.`,
    difficulty,
    enabledInMVP: true,
    requiresCRSSelection: from === "shp",
    supportsBatch,
    route: `/convert/${from}-to-${to}`,
    warnings: pairWarnings(from, to)
  };
}

export const conversionPairs = supportedPairs.map(makeSupportedPair);
export const enabledConversionPairs = conversionPairs;
export const seoConversionPairs = seoPairIds
  .map((id) => conversionPairs.find((pair) => pair.id === id))
  .filter((pair): pair is ConversionPair => Boolean(pair));
export const conversionPairById = Object.fromEntries(conversionPairs.map((pair) => [pair.id, pair]));
export const enabledConversionPairIds = new Set(conversionPairs.map((pair) => pair.id));
export const formatLabel = labels;

export function isEnabledConversionPair(from: SupportedFormat, to: SupportedFormat) {
  return enabledConversionPairIds.has(`${from}-to-${to}`);
}
