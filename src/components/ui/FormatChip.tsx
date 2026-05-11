import { formatLabel } from "@/data/conversionPairs";
import type { SupportedFormat } from "@/models/FormatDefinition";

export function FormatChip({ format }: { format: SupportedFormat }) {
  return <span className="format-chip">{formatLabel[format] ?? format.toUpperCase()}</span>;
}
