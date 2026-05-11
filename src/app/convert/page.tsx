import type { Metadata } from "next";
import { ConverterWorkspace } from "@/components/converter/ConverterWorkspace";
import type { SupportedFormat } from "@/models/FormatDefinition";

export const metadata: Metadata = {
  title: "Local Browser GIS Converter",
  description: "Convert SHP, KML, GeoJSON, CSV, GPX, and lightweight DXF output locally in your browser."
};

const outputFormats: SupportedFormat[] = ["geojson", "kml", "dxf", "csv"];

type ConvertPageProps = {
  searchParams?: Promise<{ to?: string }>;
};

export default async function ConvertPage({ searchParams }: ConvertPageProps) {
  const params = (await searchParams) ?? {};
  const initialOutput = outputFormats.includes(params.to as SupportedFormat) ? (params.to as SupportedFormat) : "geojson";

  return <ConverterWorkspace initialOutput={initialOutput} />;
}
