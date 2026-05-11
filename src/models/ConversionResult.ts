import type { PreviewGeometry } from "@/models/PreviewGeometry";
import type { SupportedFormat } from "@/models/FormatDefinition";

export interface ConversionResult {
  jobId: string;
  outputFileName: string;
  outputBlob: Blob;
  outputFormat: SupportedFormat;
  outputSizeBytes: number;
  logs: string[];
  warnings: string[];
  featureCount?: number;
  layerCount?: number;
  preview?: PreviewGeometry;
}
