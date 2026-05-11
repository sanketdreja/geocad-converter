import { detectFormatFromName, inspectShapefileZip } from "@/services/formatDetectionService";

export const FormatDetectionController = {
  detectFromFileName: detectFormatFromName,
  inspectShapefileZip
};
