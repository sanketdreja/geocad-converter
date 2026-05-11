export type SupportedFormat = "shp" | "kml" | "kmz" | "dxf" | "geojson" | "csv" | "gpx" | "gpkg" | "dwg";

export interface FormatDefinition {
  id: SupportedFormat;
  label: string;
  extensions: string[];
  category: "GIS" | "CAD" | "Tabular" | "GPS";
  canBeInput: boolean;
  canBeOutput: boolean;
  requiresZip?: boolean;
  requiresMultipleFiles?: boolean;
  privacyNote?: string;
  commonUseCases: string[];
  limitations: string[];
}
