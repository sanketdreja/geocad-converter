import JSZip from "jszip";
import type { SupportedFormat } from "@/models/FormatDefinition";

export type ShapefileInspection = {
  hasShp: boolean;
  hasShx: boolean;
  hasDbf: boolean;
  hasPrj: boolean;
  entries: string[];
};

const extensionToFormat: Record<string, SupportedFormat> = {
  shp: "shp",
  shx: "shp",
  dbf: "shp",
  prj: "shp",
  zip: "shp",
  kml: "kml",
  kmz: "kmz",
  dxf: "dxf",
  geojson: "geojson",
  json: "geojson",
  csv: "csv",
  gpx: "gpx",
  gpkg: "gpkg",
  dwg: "dwg"
};

export function getExtension(fileName: string) {
  return fileName.split(".").pop()?.toLowerCase() ?? "";
}

export function detectFormatFromName(fileName: string): SupportedFormat | null {
  return extensionToFormat[getExtension(fileName)] ?? null;
}

export async function inspectShapefileZip(file: File): Promise<ShapefileInspection> {
  const zip = await JSZip.loadAsync(await file.arrayBuffer());
  const entries = Object.keys(zip.files).map((name) => name.toLowerCase());

  return {
    hasShp: entries.some((name) => name.endsWith(".shp")),
    hasShx: entries.some((name) => name.endsWith(".shx")),
    hasDbf: entries.some((name) => name.endsWith(".dbf")),
    hasPrj: entries.some((name) => name.endsWith(".prj")),
    entries
  };
}
