import { DEFAULT_SOURCE_CRS, DEFAULT_TARGET_CRS } from "@/lib/constants";
import { crsPresets } from "@/data/crsPresets";

export function getDefaultCRSSettings() {
  return {
    sourceCRS: DEFAULT_SOURCE_CRS,
    targetCRS: DEFAULT_TARGET_CRS,
    presets: crsPresets
  };
}
