export interface ConversionError {
  code:
    | "UNSUPPORTED_FORMAT"
    | "INVALID_FILE"
    | "MISSING_SHAPEFILE_PARTS"
    | "CRS_NOT_FOUND"
    | "WASM_LOAD_FAILED"
    | "CONVERSION_FAILED"
    | "FILE_TOO_LARGE"
    | "DWG_NOT_SUPPORTED_YET"
    | "UNSUPPORTED_PAIR"
    | "INVALID_GEOJSON"
    | "MISSING_CSV_COORDINATES"
    | "EMPTY_GEOMETRY";
  title: string;
  userMessage: string;
  technicalMessage?: string;
  suggestions: string[];
}
