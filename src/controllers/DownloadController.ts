import { downloadResult } from "@/services/downloadService";
import { zipConversionResults } from "@/services/zipService";
import type { ConversionResult } from "@/models/ConversionResult";

export async function downloadAllResults(results: ConversionResult[]) {
  const zip = await zipConversionResults(results);
  const { downloadBlob } = await import("@/services/downloadService");
  downloadBlob(zip, `batch-geocad-converter-${new Date().toISOString().slice(0, 10)}.zip`);
}

export const DownloadController = {
  downloadResult,
  downloadAllResults
};
