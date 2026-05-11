import type { FormatDefinition } from "@/models/FormatDefinition";

export const formats: FormatDefinition[] = [
  {
    id: "shp",
    label: "Shapefile ZIP",
    extensions: [".zip", ".shp", ".shx", ".dbf", ".prj"],
    category: "GIS",
    canBeInput: true,
    canBeOutput: false,
    requiresZip: true,
    requiresMultipleFiles: true,
    privacyNote: "Best uploaded as a ZIP containing .shp, .shx, .dbf, and ideally .prj.",
    commonUseCases: ["Parcel boundaries", "utility maps", "survey layers"],
    limitations: ["Projection depends on .prj", "Multiple sidecar files must stay together"]
  },
  {
    id: "kml",
    label: "KML",
    extensions: [".kml"],
    category: "GIS",
    canBeInput: true,
    canBeOutput: true,
    commonUseCases: ["Google Earth overlays", "planning exports", "site boundary sharing"],
    limitations: ["Styling can vary by source application"]
  },
  {
    id: "kmz",
    label: "KMZ",
    extensions: [".kmz"],
    category: "GIS",
    canBeInput: false,
    canBeOutput: false,
    commonUseCases: ["Compressed Google Earth projects"],
    limitations: ["Phase 2 conversion target"]
  },
  {
    id: "dxf",
    label: "DXF",
    extensions: [".dxf"],
    category: "CAD",
    canBeInput: false,
    canBeOutput: true,
    commonUseCases: ["CAD exchange", "survey drafting", "civil drawings"],
    limitations: ["Lightweight 2D geometry export only; no CAD blocks, labels, dimensions, styles, or annotations"]
  },
  {
    id: "geojson",
    label: "GeoJSON",
    extensions: [".geojson", ".json"],
    category: "GIS",
    canBeInput: true,
    canBeOutput: true,
    commonUseCases: ["Web maps", "API payloads", "preview geometry"],
    limitations: ["Large files can be memory intensive in browsers"]
  },
  {
    id: "csv",
    label: "CSV",
    extensions: [".csv"],
    category: "Tabular",
    canBeInput: true,
    canBeOutput: true,
    commonUseCases: ["Latitude/longitude lists", "survey point tables", "asset registers"],
    limitations: ["Requires recognizable latitude and longitude columns"]
  },
  {
    id: "gpx",
    label: "GPX",
    extensions: [".gpx"],
    category: "GPS",
    canBeInput: true,
    canBeOutput: false,
    commonUseCases: ["Route tracks", "field surveys", "GPS waypoints"],
    limitations: ["Primarily point and route data"]
  },
  {
    id: "gpkg",
    label: "GeoPackage",
    extensions: [".gpkg"],
    category: "GIS",
    canBeInput: false,
    canBeOutput: false,
    commonUseCases: ["QGIS projects", "portable spatial databases"],
    limitations: ["Planned for Phase 2"]
  },
  {
    id: "dwg",
    label: "DWG",
    extensions: [".dwg"],
    category: "CAD",
    canBeInput: false,
    canBeOutput: false,
    commonUseCases: ["AutoCAD drawings", "architectural plans"],
    limitations: ["Waitlist only; export to DXF in CAD software first"]
  }
];

export const formatById = Object.fromEntries(formats.map((format) => [format.id, format]));
