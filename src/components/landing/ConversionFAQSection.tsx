import type { ConversionPair } from "@/models/ConversionPair";
import { formatLabel } from "@/data/conversionPairs";

export function ConversionFAQSection({ pair }: { pair: ConversionPair }) {
  const dwgGuide = pair.from === "dwg" || pair.to === "dwg";
  const from = formatLabel[pair.from];
  const to = formatLabel[pair.to];
  const faqs = dwgGuide
    ? [
        {
          question: `Can I convert ${from} to ${to} directly in the browser?`,
          answer:
            "Not yet. DWG is proprietary and reliable browser-side conversion is not part of the launch MVP. Export DWG to DXF from CAD software first."
        },
        {
          question: "What is the recommended DWG workaround?",
          answer:
            "Open the drawing in AutoCAD, BricsCAD, LibreCAD, or another CAD tool, export it as DXF, then prepare a supported GIS input such as SHP ZIP, GeoJSON, KML, CSV, or GPX."
        },
        {
          question: "Is DWG support planned?",
          answer:
            "DWG is being treated as a beta waitlist opportunity, not as a launch promise."
        },
        {
          question: "Are files uploaded to a server?",
          answer:
            "The converter workflow is designed for local browser processing. The DWG guide does not ask you to upload DWG files for unsupported conversion."
        }
      ]
    : [
        {
          question: `Is ${from} to ${to} conversion supported locally?`,
          answer: pair.enabledInMVP
            ? `This conversion page is part of the MVP route set. Supported browser-side paths run locally whenever the current engine can process the file.`
            : `This page is guidance only. It is not offered as a live browser conversion in the launch beta.`
        },
        {
          question: "Is my file uploaded to your server?",
          answer:
            "No. GeoCAD Converter is designed around local browser processing for supported conversions, with no server file storage."
        },
        {
          question: "Can I batch convert files?",
          answer:
            "Yes. The converter workspace supports a batch queue and ZIP download flow for successful conversion results."
        },
        {
          question: "What should I check if conversion fails?",
          answer:
            "Check for missing shapefile sidecar files, missing projection metadata, unusually large geometry, unsupported KML structures, or an unsupported output pair."
        }
      ];

  return (
    <section className="content-section faq-section">
      <div className="section-heading">
        <span className="section-kicker">FAQ</span>
        <h2>
          {dwgGuide ? `${from} to ${to} guide questions` : `${from} to ${to} conversion questions`}
        </h2>
      </div>
      <div className="faq-list">
        {faqs.map((faq) => (
          <details key={faq.question}>
            <summary>{faq.question}</summary>
            <p>{faq.answer}</p>
          </details>
        ))}
      </div>
    </section>
  );
}
