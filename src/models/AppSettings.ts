import type { SupportedFormat } from "@/models/FormatDefinition";

export interface AppSettings {
  preferredOutputFormat: SupportedFormat;
  lastSelectedSourceCRS: string;
  lastSelectedTargetCRS: string;
  theme: "dark" | "light" | "system";
  keepAttributes: boolean;
  keepLayerNames: boolean;
  removeEmptyGeometries: boolean;
  force2D: boolean;
}
