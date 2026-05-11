import type { ConversionResult } from "@/models/ConversionResult";
import type { ConversionError } from "@/models/ErrorTypes";
import type { SupportedFormat } from "@/models/FormatDefinition";

export type JobStatus = "queued" | "validating" | "ready" | "converting" | "success" | "failed" | "cancelled";

export interface FileJob {
  id: string;
  originalFileName: string;
  originalExtension: string;
  fileSizeBytes: number;
  inputFormat: SupportedFormat;
  outputFormat: SupportedFormat;
  fileObject: File | File[];
  status: JobStatus;
  progress: number;
  createdAt: number;
  startedAt?: number;
  finishedAt?: number;
  selectedCRS?: string;
  targetCRS?: string;
  warnings: string[];
  result?: ConversionResult;
  error?: ConversionError;
}
