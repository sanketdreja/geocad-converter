import type { ConversionError } from "@/models/ErrorTypes";
import { ConversionUserError } from "@/services/gdalWasmService";

export function errorFromException(error: unknown): ConversionError {
  if (error instanceof ConversionUserError) {
    return error.conversionError;
  }

  return {
    code: "CONVERSION_FAILED",
    title: "Conversion failed",
    userMessage:
      "The file could not be converted. This may happen because of invalid geometry, unsupported layers, missing projection data, or an unusual file structure.",
    technicalMessage: error instanceof Error ? error.message : String(error),
    suggestions: ["View conversion log", "Try a different output format", "Check the file in QGIS"]
  };
}
