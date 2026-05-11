import type { PreviewGeometry, PreviewLayer } from "@/models/PreviewGeometry";

type GeoJsonFeature = {
  type: "Feature";
  geometry?: {
    type: string;
    coordinates: unknown;
  } | null;
  properties?: Record<string, unknown> | null;
};

type GeoJsonLike =
  | { type: "FeatureCollection"; features: GeoJsonFeature[] }
  | GeoJsonFeature
  | { type: string; coordinates: unknown };

function isFeatureCollection(input: GeoJsonLike): input is { type: "FeatureCollection"; features: GeoJsonFeature[] } {
  return input.type === "FeatureCollection" && "features" in input;
}

function flattenCoords(coords: unknown, bucket: number[][] = []) {
  if (!Array.isArray(coords)) return bucket;
  if (typeof coords[0] === "number" && typeof coords[1] === "number") {
    bucket.push([Number(coords[0]), Number(coords[1])]);
    return bucket;
  }
  coords.forEach((item) => flattenCoords(item, bucket));
  return bucket;
}

function collectPaths(type: string | undefined, coords: unknown): number[][][] {
  if (!type) return [];
  if (type === "LineString" && Array.isArray(coords)) return [flattenCoords(coords)];
  if (type === "MultiLineString" && Array.isArray(coords)) return coords.map((line) => flattenCoords(line));
  if (type === "Polygon" && Array.isArray(coords)) return coords.map((ring) => flattenCoords(ring));
  if (type === "MultiPolygon" && Array.isArray(coords)) {
    return coords.flatMap((polygon) => (Array.isArray(polygon) ? polygon.map((ring) => flattenCoords(ring)) : []));
  }
  return [];
}

function collectPoints(type: string | undefined, coords: unknown): number[][] {
  if (type === "Point" || type === "MultiPoint") return flattenCoords(coords);
  return [];
}

function previewKind(type: string): PreviewLayer["geometryType"] {
  if (type.includes("Point")) return "point";
  if (type.includes("Line")) return "line";
  if (type.includes("Polygon")) return "polygon";
  return "mixed";
}

export function createPreviewGeometry(input: GeoJsonLike): PreviewGeometry {
  const features: GeoJsonFeature[] =
    isFeatureCollection(input)
      ? input.features
      : input.type === "Feature"
        ? [input as GeoJsonFeature]
        : [{ type: "Feature", geometry: input as GeoJsonFeature["geometry"], properties: {} }];

  const coords = features.flatMap((feature) => flattenCoords(feature.geometry?.coordinates));
  const points = features.flatMap((feature) => collectPoints(feature.geometry?.type, feature.geometry?.coordinates)).slice(0, 1200);
  const paths = features
    .flatMap((feature) => collectPaths(feature.geometry?.type, feature.geometry?.coordinates))
    .filter((path) => path.length > 1)
    .slice(0, 600);
  const xs = coords.map(([x]) => x);
  const ys = coords.map(([, y]) => y);
  const geometryTypes = new Set(features.map((feature) => previewKind(feature.geometry?.type ?? "mixed")));
  const type = geometryTypes.size === 1 ? [...geometryTypes][0] : "mixed";

  const layerMap = new Map<string, PreviewLayer>();
  features.forEach((feature, index) => {
    const name = String(feature.properties?.layer ?? feature.properties?.name ?? "Layer 1");
    const existing = layerMap.get(name);
    const geometryType = previewKind(feature.geometry?.type ?? "mixed");
    if (existing) {
      existing.featureCount += 1;
      if (existing.geometryType !== geometryType) existing.geometryType = "mixed";
      return;
    }
    layerMap.set(name, {
      id: `${name.toLowerCase().replace(/[^a-z0-9]+/g, "-")}-${index}`,
      name,
      visible: true,
      geometryType,
      featureCount: 1,
      style: { strokeWidth: 1.6, opacity: 0.86 }
    });
  });

  return {
    type,
    bounds: coords.length
      ? [Math.min(...xs), Math.min(...ys), Math.max(...xs), Math.max(...ys)]
      : [0, 0, 0, 0],
    featureCount: features.length,
    layers: [...layerMap.values()],
    points,
    paths
  };
}
