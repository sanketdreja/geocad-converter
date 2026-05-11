import type { ConversionResult } from "@/models/ConversionResult";

export function downloadBlob(blob: Blob, fileName: string) {
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = fileName;
  anchor.click();
  window.setTimeout(() => URL.revokeObjectURL(url), 1000);
}

export function downloadResult(result: ConversionResult) {
  downloadBlob(result.outputBlob, result.outputFileName);
}
