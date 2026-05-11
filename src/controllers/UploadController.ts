import type { FileJob } from "@/models/FileJob";
import type { SupportedFormat } from "@/models/FormatDefinition";
import { isEnabledConversionPair } from "@/data/conversionPairs";
import { getExtension } from "@/services/formatDetectionService";
import { validateUploadedFile } from "@/services/fileValidationService";

export async function createJobsFromFiles(files: File[], outputFormat: SupportedFormat): Promise<FileJob[]> {
  const jobs = await Promise.all(
    files.map(async (file) => {
      const validation = await validateUploadedFile(file);
      const inputFormat = validation.inputFormat ?? "geojson";
      const pairSupported = validation.ok && isEnabledConversionPair(inputFormat, outputFormat);

      return {
        id: `${Date.now()}-${crypto.randomUUID()}`,
        originalFileName: file.name,
        originalExtension: getExtension(file.name),
        fileSizeBytes: file.size,
        inputFormat,
        outputFormat,
        fileObject: file,
        status: pairSupported ? ("ready" as const) : ("failed" as const),
        progress: pairSupported ? 0 : 100,
        createdAt: Date.now(),
        warnings: validation.warnings,
        error:
          validation.error ??
          (!pairSupported
            ? {
                code: "UNSUPPORTED_PAIR" as const,
                title: "Unsupported conversion pair",
                userMessage: `${inputFormat.toUpperCase()} to ${outputFormat.toUpperCase()} is not enabled in this browser beta.`,
                suggestions: ["Choose a supported output format", "Use GeoJSON as an intermediate format when possible"]
              }
            : undefined)
      };
    })
  );

  return jobs;
}
