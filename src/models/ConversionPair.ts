import type { SupportedFormat } from "@/models/FormatDefinition";

export interface ConversionPair {
  id: string;
  from: SupportedFormat;
  to: SupportedFormat;
  title: string;
  seoTitle: string;
  seoDescription: string;
  difficulty: "easy" | "medium" | "advanced";
  enabledInMVP: boolean;
  requiresCRSSelection: boolean;
  supportsBatch: boolean;
  route: string;
  warnings: string[];
}
