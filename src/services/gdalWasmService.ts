import type { ConversionError } from "@/models/ErrorTypes";
import type { ConversionResult } from "@/models/ConversionResult";
import type { FileJob } from "@/models/FileJob";
import type { SupportedFormat } from "@/models/FormatDefinition";
import { isEnabledConversionPair } from "@/data/conversionPairs";
import { previewFromGeoJson } from "@/services/previewGeometryService";
import { inspectShapefileZip } from "@/services/formatDetectionService";

type GeoJsonGeometry = {
  type: string;
  coordinates: unknown;
};

type GeoJsonFeature = {
  type: "Feature";
  geometry: GeoJsonGeometry | null;
  properties: Record<string, unknown>;
};

type GeoJsonCollection = {
  type: "FeatureCollection";
  features: GeoJsonFeature[];
};

type ParsedGeoJson = {
  geojson: GeoJsonCollection;
  warnings: string[];
};

export type ConversionSettings = {
  sourceCRS: string;
  targetCRS: string;
  keepAttributes: boolean;
  keepLayerNames: boolean;
  removeEmptyGeometries: boolean;
  force2D: boolean;
};

export class ConversionUserError extends Error {
  conversionError: ConversionError;

  constructor(conversionError: ConversionError) {
    super(conversionError.userMessage);
    this.name = "ConversionUserError";
    this.conversionError = conversionError;
  }
}

const mimeByFormat: Record<SupportedFormat, string> = {
  shp: "application/zip",
  kml: "application/vnd.google-earth.kml+xml",
  kmz: "application/vnd.google-earth.kmz",
  dxf: "application/dxf",
  geojson: "application/geo+json",
  csv: "text/csv",
  gpx: "application/gpx+xml",
  gpkg: "application/geopackage+sqlite3",
  dwg: "application/acad"
};

const supportedGeometryTypes = new Set(["Point", "MultiPoint", "LineString", "MultiLineString", "Polygon", "MultiPolygon"]);

function outputName(inputName: string, format: SupportedFormat) {
  const clean = inputName.replace(/\.[^.]+$/, "");
  return `${clean}_converted-to-${format}.${format}`;
}

async function readText(file: File) {
  return file.text();
}

function userError(
  code: ConversionError["code"],
  title: string,
  userMessage: string,
  suggestions: string[],
  technicalMessage?: string
): never {
  throw new ConversionUserError({ code, title, userMessage, suggestions, technicalMessage });
}

function assertSupportedPair(inputFormat: SupportedFormat, outputFormat: SupportedFormat) {
  if (!isEnabledConversionPair(inputFormat, outputFormat)) {
    userError(
      "UNSUPPORTED_PAIR",
      "Unsupported conversion pair",
      `${inputFormat.toUpperCase()} to ${outputFormat.toUpperCase()} is not enabled in this browser beta.`,
      ["Choose a supported pair from the converter", "Use GeoJSON as an intermediate format when possible"]
    );
  }
}

function parseXml(text: string, format: "KML" | "GPX") {
  const doc = new DOMParser().parseFromString(text, "application/xml");
  const parserError = doc.getElementsByTagName("parsererror")[0];
  if (parserError) {
    userError("INVALID_FILE", `Invalid ${format}`, `The ${format} file is not valid XML.`, ["Re-export the file", "Check for truncated XML"]);
  }
  return doc;
}

function parseCsvRows(text: string) {
  const rows: string[][] = [];
  let row: string[] = [];
  let cell = "";
  let inQuotes = false;

  for (let index = 0; index < text.length; index += 1) {
    const char = text[index];
    const next = text[index + 1];

    if (inQuotes) {
      if (char === '"' && next === '"') {
        cell += '"';
        index += 1;
      } else if (char === '"') {
        inQuotes = false;
      } else {
        cell += char;
      }
      continue;
    }

    if (char === '"') {
      inQuotes = true;
    } else if (char === ",") {
      row.push(cell.trim());
      cell = "";
    } else if (char === "\n") {
      row.push(cell.trim());
      rows.push(row);
      row = [];
      cell = "";
    } else if (char !== "\r") {
      cell += char;
    }
  }

  if (cell.length || row.length) {
    row.push(cell.trim());
    rows.push(row);
  }

  return rows.filter((candidate) => candidate.some((value) => value.length > 0));
}

function parseCsv(text: string): ParsedGeoJson {
  const rows = parseCsvRows(text.replace(/^\uFEFF/, ""));
  const headers = rows.shift()?.map((header) => header.trim()) ?? [];
  const latIndex = headers.findIndex((header) => /^(lat|latitude|y)$/i.test(header));
  const lonIndex = headers.findIndex((header) => /^(lon|lng|long|longitude|x)$/i.test(header));

  if (!headers.length) {
    userError("INVALID_FILE", "CSV is empty", "The CSV file does not contain a header row.", ["Add a header row", "Try the sample CSV"]);
  }

  if (latIndex < 0 || lonIndex < 0) {
    userError(
      "MISSING_CSV_COORDINATES",
      "Missing latitude/longitude columns",
      "CSV conversion requires recognizable latitude and longitude columns.",
      ["Use columns named latitude/longitude, lat/lon, lat/lng, or y/x"]
    );
  }

  const features = rows
    .map((row): GeoJsonFeature | null => {
      const lat = Number(row[latIndex]);
      const lon = Number(row[lonIndex]);
      if (!Number.isFinite(lat) || !Number.isFinite(lon)) return null;
      const properties = Object.fromEntries(headers.map((header, index) => [header, row[index] ?? ""]));
      return {
        type: "Feature" as const,
        geometry: { type: "Point", coordinates: [lon, lat] },
        properties
      };
    })
    .filter((feature): feature is GeoJsonFeature => Boolean(feature));

  return {
    geojson: { type: "FeatureCollection", features },
    warnings: rows.length !== features.length ? ["Rows with invalid latitude/longitude values were skipped."] : []
  };
}

function coordTextToPairs(text: string) {
  return text
    .trim()
    .split(/\s+/)
    .map((point) => point.split(",").map(Number))
    .filter(([lon, lat]) => Number.isFinite(lon) && Number.isFinite(lat))
    .map(([lon, lat, z]) => (Number.isFinite(z) ? [lon, lat, z] : [lon, lat]));
}

function placemarkProperties(placemark: Element, fallbackName: string) {
  const name = placemark.getElementsByTagName("name")[0]?.textContent?.trim() || fallbackName;
  const description = placemark.getElementsByTagName("description")[0]?.textContent?.trim();
  const properties: Record<string, unknown> = { name };

  if (description) properties.description = description;

  [...placemark.getElementsByTagName("Data")].forEach((data) => {
    const key = data.getAttribute("name");
    const value = data.getElementsByTagName("value")[0]?.textContent ?? "";
    if (key) properties[key] = value;
  });

  return properties;
}

function parseKml(text: string): ParsedGeoJson {
  const doc = parseXml(text, "KML");
  const placemarks = [...doc.getElementsByTagName("Placemark")];
  const warnings: string[] = [];
  const features: GeoJsonFeature[] = [];

  placemarks.forEach((placemark, index) => {
    const properties = placemarkProperties(placemark, `Placemark ${index + 1}`);
    if (placemark.getElementsByTagName("MultiGeometry").length) {
      warnings.push("KML MultiGeometry is partially supported: simple child points, lines, and polygons are exported as separate features.");
    }

    [...placemark.getElementsByTagName("Point")].forEach((point) => {
      const [coordinates] = coordTextToPairs(point.getElementsByTagName("coordinates")[0]?.textContent ?? "");
      if (coordinates) features.push({ type: "Feature", geometry: { type: "Point", coordinates }, properties });
    });

    [...placemark.getElementsByTagName("LineString")].forEach((line) => {
      const coordinates = coordTextToPairs(line.getElementsByTagName("coordinates")[0]?.textContent ?? "");
      if (coordinates.length) features.push({ type: "Feature", geometry: { type: "LineString", coordinates }, properties });
    });

    [...placemark.getElementsByTagName("Polygon")].forEach((polygon) => {
      const rings = [...polygon.getElementsByTagName("LinearRing")]
        .map((ring) => coordTextToPairs(ring.getElementsByTagName("coordinates")[0]?.textContent ?? ""))
        .filter((ring) => ring.length);
      if (rings.length) features.push({ type: "Feature", geometry: { type: "Polygon", coordinates: rings }, properties });
    });
  });

  return { geojson: { type: "FeatureCollection", features }, warnings };
}

function parseGpx(text: string): ParsedGeoJson {
  const doc = parseXml(text, "GPX");
  const waypointFeatures: GeoJsonFeature[] = [...doc.getElementsByTagName("wpt")]
    .map((node, index): GeoJsonFeature | null => {
      const lon = Number(node.getAttribute("lon"));
      const lat = Number(node.getAttribute("lat"));
      if (!Number.isFinite(lon) || !Number.isFinite(lat)) return null;
      return {
        type: "Feature" as const,
        geometry: { type: "Point", coordinates: [lon, lat] },
        properties: { name: node.getElementsByTagName("name")[0]?.textContent ?? `Waypoint ${index + 1}` }
      };
    })
    .filter((feature): feature is GeoJsonFeature => Boolean(feature));

  const trackFeatures: GeoJsonFeature[] = [...doc.getElementsByTagName("trkseg")]
    .map((segment, index): GeoJsonFeature | null => {
      const coordinates = [...segment.getElementsByTagName("trkpt")]
        .map((node) => [Number(node.getAttribute("lon")), Number(node.getAttribute("lat"))])
        .filter(([lon, lat]) => Number.isFinite(lon) && Number.isFinite(lat));
      if (!coordinates.length) return null;
      return {
        type: "Feature" as const,
        geometry: { type: "LineString", coordinates },
        properties: { name: segment.parentElement?.getElementsByTagName("name")[0]?.textContent ?? `Track ${index + 1}` }
      };
    })
    .filter((feature): feature is GeoJsonFeature => Boolean(feature));

  return { geojson: { type: "FeatureCollection", features: [...waypointFeatures, ...trackFeatures] }, warnings: [] };
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return Boolean(value) && typeof value === "object" && !Array.isArray(value);
}

function normalizeCoordinates(coords: unknown, force2D: boolean): unknown {
  if (!Array.isArray(coords)) return coords;
  if (typeof coords[0] === "number" && typeof coords[1] === "number") {
    return force2D ? [Number(coords[0]), Number(coords[1])] : coords.map(Number);
  }
  return coords.map((coord) => normalizeCoordinates(coord, force2D));
}

function flattenCoordinates(coords: unknown, bucket: number[][] = []) {
  if (!Array.isArray(coords)) return bucket;
  if (typeof coords[0] === "number" && typeof coords[1] === "number") {
    bucket.push([Number(coords[0]), Number(coords[1])]);
    return bucket;
  }
  coords.forEach((coord) => flattenCoordinates(coord, bucket));
  return bucket;
}

function normalizeFeature(feature: unknown, settings: ConversionSettings): GeoJsonFeature | null {
  if (!isRecord(feature) || feature.type !== "Feature") return null;

  const geometry = isRecord(feature.geometry) ? feature.geometry : null;
  const properties = isRecord(feature.properties) && settings.keepAttributes ? { ...feature.properties } : {};
  if (!settings.keepLayerNames) delete properties.layer;

  if (!geometry) return { type: "Feature", geometry: null, properties };
  if (typeof geometry.type !== "string" || !supportedGeometryTypes.has(geometry.type)) return null;

  return {
    type: "Feature",
    geometry: {
      type: geometry.type,
      coordinates: normalizeCoordinates(geometry.coordinates, settings.force2D)
    },
    properties
  };
}

function normalizeCollection(input: unknown, settings: ConversionSettings): GeoJsonCollection {
  let rawFeatures: unknown[] = [];

  if (isRecord(input) && input.type === "FeatureCollection" && Array.isArray(input.features)) {
    rawFeatures = input.features;
  } else if (isRecord(input) && input.type === "Feature") {
    rawFeatures = [input];
  } else if (isRecord(input) && typeof input.type === "string" && "coordinates" in input) {
    rawFeatures = [{ type: "Feature", geometry: input, properties: {} }];
  } else {
    userError("INVALID_GEOJSON", "Invalid GeoJSON", "The file is not a valid GeoJSON FeatureCollection, Feature, or geometry.", [
      "Validate the file as GeoJSON",
      "Try exporting again from your GIS tool"
    ]);
  }

  const features = rawFeatures
    .map((feature) => normalizeFeature(feature, settings))
    .filter((feature): feature is GeoJsonFeature => Boolean(feature))
    .filter((feature) => !settings.removeEmptyGeometries || flattenCoordinates(feature.geometry?.coordinates).length > 0);

  if (!features.length) {
    userError("EMPTY_GEOMETRY", "No usable geometry found", "The file did not contain supported point, line, or polygon geometry.", [
      "Check that the source layer is not empty",
      "Try disabling empty geometry removal",
      "Export a simpler point, line, or polygon layer"
    ]);
  }

  return { type: "FeatureCollection", features };
}

async function parseShapefile(file: File, settings: ConversionSettings): Promise<ParsedGeoJson> {
  const warnings: string[] = [];
  const inspection = await inspectShapefileZip(file);

  if (!inspection.hasShp || !inspection.hasShx || !inspection.hasDbf) {
    userError(
      "MISSING_SHAPEFILE_PARTS",
      "Shapefile parts are missing",
      "A shapefile ZIP must include .shp, .shx, and .dbf files.",
      ["Zip the required sidecar files together", "Make sure the sidecar file names match"]
    );
  }

  if (!inspection.hasPrj) {
    warnings.push("Projection file missing. CRS may be unknown; coordinates are preserved as-is.");
  }

  const shp = (await import("shpjs")).default;
  const parsed = await shp(await file.arrayBuffer());

  if (Array.isArray(parsed)) {
    const merged = {
      type: "FeatureCollection",
      features: parsed.flatMap((collection) => {
        const featureCollection = collection as GeoJsonCollection & { fileName?: string };
        return featureCollection.features.map((feature) => ({
          ...feature,
          properties: { ...(feature.properties ?? {}), layer: featureCollection.fileName ?? "Shapefile" }
        }));
      })
    };
    return { geojson: normalizeCollection(merged, settings), warnings };
  }

  return { geojson: normalizeCollection(parsed, settings), warnings };
}

async function fileToGeoJson(file: File, inputFormat: SupportedFormat, settings: ConversionSettings): Promise<ParsedGeoJson> {
  if (inputFormat === "geojson") {
    try {
      return { geojson: normalizeCollection(JSON.parse(await readText(file)), settings), warnings: [] };
    } catch (error) {
      if (error instanceof ConversionUserError) throw error;
      userError("INVALID_GEOJSON", "Invalid GeoJSON", "The GeoJSON file could not be parsed.", ["Check the JSON syntax"], String(error));
    }
  }

  if (inputFormat === "csv") {
    const parsed = parseCsv(await readText(file));
    return { geojson: normalizeCollection(parsed.geojson, settings), warnings: parsed.warnings };
  }

  if (inputFormat === "kml") {
    const parsed = parseKml(await readText(file));
    return { geojson: normalizeCollection(parsed.geojson, settings), warnings: parsed.warnings };
  }

  if (inputFormat === "gpx") {
    const parsed = parseGpx(await readText(file));
    return { geojson: normalizeCollection(parsed.geojson, settings), warnings: parsed.warnings };
  }

  if (inputFormat === "shp") return parseShapefile(file, settings);

  userError(
    "UNSUPPORTED_FORMAT",
    `${inputFormat.toUpperCase()} input is not enabled`,
    `${inputFormat.toUpperCase()} input conversion is not supported in this browser beta.`,
    ["Use SHP ZIP, KML, GeoJSON, CSV, or GPX as the input format"]
  );
}

function escapeXml(value: unknown) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&apos;");
}

function coordinateTupleToKml(coordinate: unknown) {
  if (!Array.isArray(coordinate)) return "";
  const lon = Number(coordinate[0]);
  const lat = Number(coordinate[1]);
  const z = Number(coordinate[2]);
  if (!Number.isFinite(lon) || !Number.isFinite(lat)) return "";
  return `${lon},${lat},${Number.isFinite(z) ? z : 0}`;
}

function lineToKml(coordinates: unknown) {
  if (!Array.isArray(coordinates)) return "";
  return coordinates.map((coordinate) => coordinateTupleToKml(coordinate)).filter(Boolean).join(" ");
}

function polygonToKml(coordinates: unknown) {
  if (!Array.isArray(coordinates)) return "";
  const [outerRing, ...innerRings] = coordinates;
  const outer = `<outerBoundaryIs><LinearRing><coordinates>${lineToKml(outerRing)}</coordinates></LinearRing></outerBoundaryIs>`;
  const inner = innerRings
    .map((ring) => `<innerBoundaryIs><LinearRing><coordinates>${lineToKml(ring)}</coordinates></LinearRing></innerBoundaryIs>`)
    .join("");
  return `<Polygon>${outer}${inner}</Polygon>`;
}

function geometryToKml(geometry: GeoJsonGeometry | null): string {
  if (!geometry) return "";

  if (geometry.type === "Point") {
    return `<Point><coordinates>${coordinateTupleToKml(geometry.coordinates)}</coordinates></Point>`;
  }

  if (geometry.type === "MultiPoint" && Array.isArray(geometry.coordinates)) {
    return `<MultiGeometry>${geometry.coordinates
      .map((point) => `<Point><coordinates>${coordinateTupleToKml(point)}</coordinates></Point>`)
      .join("")}</MultiGeometry>`;
  }

  if (geometry.type === "LineString") {
    return `<LineString><coordinates>${lineToKml(geometry.coordinates)}</coordinates></LineString>`;
  }

  if (geometry.type === "MultiLineString" && Array.isArray(geometry.coordinates)) {
    return `<MultiGeometry>${geometry.coordinates
      .map((line) => `<LineString><coordinates>${lineToKml(line)}</coordinates></LineString>`)
      .join("")}</MultiGeometry>`;
  }

  if (geometry.type === "Polygon") {
    return polygonToKml(geometry.coordinates);
  }

  if (geometry.type === "MultiPolygon" && Array.isArray(geometry.coordinates)) {
    return `<MultiGeometry>${geometry.coordinates.map((polygon) => polygonToKml(polygon)).join("")}</MultiGeometry>`;
  }

  return "";
}

function geoJsonToKml(collection: GeoJsonCollection) {
  const placemarks = collection.features
    .map((feature, index) => {
      const geometry = geometryToKml(feature.geometry);
      if (!geometry) return "";
      const name = escapeXml(feature.properties?.name ?? feature.properties?.Name ?? `Feature ${index + 1}`);
      return `<Placemark><name>${name}</name>${geometry}</Placemark>`;
    })
    .filter(Boolean)
    .join("");

  return `<?xml version="1.0" encoding="UTF-8"?><kml xmlns="http://www.opengis.net/kml/2.2"><Document>${placemarks}</Document></kml>`;
}

function csvCell(value: unknown) {
  const text = String(value ?? "");
  return /[",\r\n]/.test(text) ? `"${text.replaceAll('"', '""')}"` : text;
}

function geoJsonToCsv(collection: GeoJsonCollection) {
  const propertyKeys = [...new Set(collection.features.flatMap((feature) => Object.keys(feature.properties ?? {})))];
  const header = ["id", "geometry_type", "longitude", "latitude", "properties_json", ...propertyKeys];
  const rows = collection.features.map((feature, index) => {
    const [lon = "", lat = ""] = flattenCoordinates(feature.geometry?.coordinates)[0] ?? [];
    return [
      index + 1,
      feature.geometry?.type ?? "",
      lon,
      lat,
      JSON.stringify(feature.properties ?? {}),
      ...propertyKeys.map((key) => feature.properties?.[key] ?? "")
    ]
      .map(csvCell)
      .join(",");
  });

  return [header.join(","), ...rows].join("\n");
}

function pointEntities(coordinates: unknown) {
  return flattenCoordinates(coordinates);
}

function linePaths(geometry: GeoJsonGeometry | null): number[][][] {
  if (!geometry) return [];
  const coords = geometry.coordinates;

  if (geometry.type === "LineString" && Array.isArray(coords)) return [flattenCoordinates(coords)];
  if (geometry.type === "MultiLineString" && Array.isArray(coords)) return coords.map((line) => flattenCoordinates(line));
  if (geometry.type === "Polygon" && Array.isArray(coords)) return coords.map((ring) => flattenCoordinates(ring));
  if (geometry.type === "MultiPolygon" && Array.isArray(coords)) {
    return coords.flatMap((polygon) => (Array.isArray(polygon) ? polygon.map((ring) => flattenCoordinates(ring)) : []));
  }
  return [];
}

function safeLayerName(value: unknown) {
  return String(value ?? "GEOCAD")
    .replace(/[^a-z0-9_-]+/gi, "_")
    .slice(0, 64);
}

function geoJsonToDxf(collection: GeoJsonCollection) {
  const lines: string[] = ["0", "SECTION", "2", "ENTITIES"];

  collection.features.forEach((feature) => {
    const layer = safeLayerName(feature.properties?.layer ?? feature.properties?.name ?? "GEOCAD");

    if (feature.geometry?.type === "Point" || feature.geometry?.type === "MultiPoint") {
      pointEntities(feature.geometry.coordinates).forEach(([lon, lat]) => {
        lines.push("0", "POINT", "8", layer, "10", String(lon), "20", String(lat), "30", "0");
      });
      return;
    }

    linePaths(feature.geometry).forEach((path) => {
      for (let index = 1; index < path.length; index += 1) {
        lines.push(
          "0",
          "LINE",
          "8",
          layer,
          "10",
          String(path[index - 1][0]),
          "20",
          String(path[index - 1][1]),
          "30",
          "0",
          "11",
          String(path[index][0]),
          "21",
          String(path[index][1]),
          "31",
          "0"
        );
      }
    });
  });

  lines.push("0", "ENDSEC", "0", "EOF");
  return lines.join("\n");
}

export async function runBrowserConversion(job: FileJob, settings: ConversionSettings): Promise<ConversionResult> {
  assertSupportedPair(job.inputFormat, job.outputFormat);

  const file = Array.isArray(job.fileObject) ? job.fileObject[0] : job.fileObject;
  const logs = [
    "Validated local file input.",
    `Input format: ${job.inputFormat.toUpperCase()}`,
    `Output format: ${job.outputFormat.toUpperCase()}`,
    `Source CRS: ${settings.sourceCRS}`,
    `Target CRS: ${settings.targetCRS}`
  ];
  const warnings = [...job.warnings];
  const parsed = await fileToGeoJson(file, job.inputFormat, settings);
  const geojson = parsed.geojson;
  warnings.push(...parsed.warnings);

  if (settings.sourceCRS !== settings.targetCRS) {
    warnings.push("CRS transformation is not active in this beta. Coordinates are preserved.");
  }

  let output = "";
  if (job.outputFormat === "geojson") {
    output = JSON.stringify(geojson, null, 2);
  } else if (job.outputFormat === "kml") {
    output = geoJsonToKml(geojson);
  } else if (job.outputFormat === "csv") {
    output = geoJsonToCsv(geojson);
  } else if (job.outputFormat === "dxf") {
    output = geoJsonToDxf(geojson);
    warnings.push("DXF output is lightweight 2D geometry only. Blocks, labels, styles, dimensions, annotations, and advanced layers are not preserved.");
  } else {
    userError(
      "UNSUPPORTED_FORMAT",
      `${job.outputFormat.toUpperCase()} output is not enabled`,
      `${job.outputFormat.toUpperCase()} output is not supported in this browser beta.`,
      ["Choose GeoJSON, KML, CSV, or lightweight DXF output"]
    );
  }

  const outputBlob = new Blob([output], { type: mimeByFormat[job.outputFormat] });
  const preview = previewFromGeoJson(geojson);

  return {
    jobId: job.id,
    outputFileName: outputName(job.originalFileName, job.outputFormat),
    outputBlob,
    outputFormat: job.outputFormat,
    outputSizeBytes: outputBlob.size,
    logs: [...logs, "Normalized geometry through the browser GeoJSON pipeline.", "Generated downloadable output and preview metadata."],
    warnings,
    featureCount: geojson.features.length,
    layerCount: preview?.layers.length,
    preview
  };
}
