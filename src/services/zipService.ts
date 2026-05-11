import JSZip from "jszip";
import type { ConversionResult } from "@/models/ConversionResult";

export async function zipConversionResults(results: ConversionResult[]) {
  const zip = new JSZip();
  results.forEach((result) => {
    zip.file(result.outputFileName, result.outputBlob);
  });
  return zip.generateAsync({ type: "blob" });
}
