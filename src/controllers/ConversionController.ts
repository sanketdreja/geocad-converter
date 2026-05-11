import type { ConversionSettings } from "@/services/gdalWasmService";
import type { FileJob } from "@/models/FileJob";
import { runBrowserConversion } from "@/services/gdalWasmService";
import { trackEvent } from "@/services/analyticsService";

export async function convertJob(job: FileJob, settings: ConversionSettings) {
  trackEvent("conversion_started", {
    from: job.inputFormat,
    to: job.outputFormat,
    size: job.fileSizeBytes
  });

  try {
    const result = await runBrowserConversion(job, settings);
    trackEvent("conversion_success", {
      from: job.inputFormat,
      to: job.outputFormat,
      features: result.featureCount
    });
    return result;
  } catch (error) {
    trackEvent("conversion_failed", {
      from: job.inputFormat,
      to: job.outputFormat,
      message: error instanceof Error ? error.message : String(error)
    });
    throw error;
  }
}
