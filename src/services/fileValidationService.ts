import { LARGE_FILE_WARNING_SIZE, MAX_RECOMMENDED_FILE_SIZE } from "@/lib/constants";
import type { ConversionError } from "@/models/ErrorTypes";
import type { SupportedFormat } from "@/models/FormatDefinition";
import { detectFormatFromName, inspectShapefileZip } from "@/services/formatDetectionService";

export type ValidationResult = {
  ok: boolean;
  inputFormat?: SupportedFormat;
  warnings: string[];
  error?: ConversionError;
};

export async function validateUploadedFile(file: File): Promise<ValidationResult> {
  const detected = detectFormatFromName(file.name);

  if (!detected) {
    return {
      ok: false,
      warnings: [],
      error: {
        code: "UNSUPPORTED_FORMAT",
        title: "Unsupported file format",
        userMessage: "This beta accepts SHP ZIP, KML, GeoJSON, CSV, and GPX as conversion inputs.",
        suggestions: ["Try exporting the data as GeoJSON, KML, CSV, GPX, or a shapefile ZIP."]
      }
    };
  }

  if (detected === "dwg") {
    return {
      ok: false,
      inputFormat: detected,
      warnings: [],
      error: {
        code: "DWG_NOT_SUPPORTED_YET",
        title: "DWG support is not available yet",
        userMessage: "DWG is a complex proprietary CAD format. DWG browser conversion is waitlist-only in this beta.",
        suggestions: ["Join the DWG beta waitlist", "Export to GeoJSON, KML, CSV, GPX, or SHP ZIP first", "Read the DWG guide"]
      }
    };
  }

  if (detected === "dxf" || detected === "kmz" || detected === "gpkg") {
    return {
      ok: false,
      inputFormat: detected,
      warnings: [],
      error: {
        code: "UNSUPPORTED_FORMAT",
        title: `${detected.toUpperCase()} input is not enabled in this beta`,
        userMessage:
          detected === "dxf"
            ? "DXF is currently supported as a lightweight output format only. DXF input conversion is planned for a later engine."
            : `${detected.toUpperCase()} conversion is waitlist-only in this launch beta.`,
        suggestions:
          detected === "dxf"
            ? ["Export the source data as SHP ZIP, KML, GeoJSON, CSV, or GPX first"]
            : ["Join the waitlist", "Export to GeoJSON or KML first"]
      }
    };
  }

  if (file.size > MAX_RECOMMENDED_FILE_SIZE) {
    return {
      ok: false,
      inputFormat: detected,
      warnings: [],
      error: {
        code: "FILE_TOO_LARGE",
        title: "This file may be too large for browser conversion",
        userMessage: "Your file is larger than the recommended browser processing limit.",
        suggestions: ["Try a smaller file", "Split the dataset", "Use desktop GIS software for this file"]
      }
    };
  }

  const warnings: string[] = [];

  if (file.size > LARGE_FILE_WARNING_SIZE) {
    warnings.push("Large file warning: browser conversion may be slow or memory intensive. Split the dataset if this tab becomes unresponsive.");
  }

  if (detected === "shp" && file.name.toLowerCase().endsWith(".zip")) {
    try {
      const inspection = await inspectShapefileZip(file);
      if (!inspection.hasShp || !inspection.hasShx || !inspection.hasDbf) {
        return {
          ok: false,
          inputFormat: detected,
          warnings,
          error: {
            code: "MISSING_SHAPEFILE_PARTS",
            title: "Shapefile parts are missing",
            userMessage: "A shapefile usually needs .shp, .shx, and .dbf files. Upload a ZIP containing all required parts.",
            suggestions: ["Upload ZIP again", "Make sure .shp, .shx, and .dbf share the same base name"]
          }
        };
      }
      if (!inspection.hasPrj) {
        warnings.push("Projection file missing. You can still convert, but coordinates may be interpreted incorrectly.");
      }
    } catch (error) {
      return {
        ok: false,
        inputFormat: detected,
        warnings,
        error: {
          code: "INVALID_FILE",
          title: "ZIP could not be read",
          userMessage: "The uploaded shapefile ZIP could not be inspected in the browser.",
          technicalMessage: error instanceof Error ? error.message : String(error),
          suggestions: ["Recreate the ZIP", "Check that it is not password-protected"]
        }
      };
    }
  }

  if (detected === "shp" && !file.name.toLowerCase().endsWith(".zip")) {
    return {
      ok: false,
      inputFormat: detected,
      warnings,
      error: {
        code: "MISSING_SHAPEFILE_PARTS",
        title: "Upload shapefiles as one ZIP",
        userMessage: "A shapefile is a sidecar set. Upload a ZIP containing .shp, .shx, .dbf, and ideally .prj.",
        suggestions: ["Zip the matching shapefile sidecars together", "Make sure the base file names match"]
      }
    };
  }

  return { ok: true, inputFormat: detected, warnings };
}
