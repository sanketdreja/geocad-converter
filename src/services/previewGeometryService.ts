import { createPreviewGeometry } from "@/lib/geometry";
import type { PreviewGeometry } from "@/models/PreviewGeometry";

export function previewFromGeoJson(geojson: unknown): PreviewGeometry | undefined {
  try {
    return createPreviewGeometry(geojson as Parameters<typeof createPreviewGeometry>[0]);
  } catch {
    return undefined;
  }
}
