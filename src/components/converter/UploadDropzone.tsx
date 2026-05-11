"use client";

import { UploadCloud } from "lucide-react";
import { useRef, useState } from "react";
import { Button } from "@/components/ui/Button";
import { FormatChip } from "@/components/ui/FormatChip";
import type { SupportedFormat } from "@/models/FormatDefinition";

const supported: SupportedFormat[] = ["shp", "kml", "geojson", "csv", "gpx"];

export function UploadDropzone({ onFiles }: { onFiles: (files: File[]) => void }) {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [dragging, setDragging] = useState(false);

  function handleFiles(fileList: FileList | null) {
    if (!fileList?.length) return;
    onFiles([...fileList]);
  }

  return (
    <section
      className={dragging ? "upload-zone upload-zone-active" : "upload-zone"}
      onDragOver={(event) => {
        event.preventDefault();
        setDragging(true);
      }}
      onDragLeave={() => setDragging(false)}
      onDrop={(event) => {
        event.preventDefault();
        setDragging(false);
        handleFiles(event.dataTransfer.files);
      }}
    >
      <input
        ref={inputRef}
        type="file"
        multiple
        className="sr-only"
        accept=".zip,.kml,.geojson,.json,.csv,.gpx"
        onChange={(event) => handleFiles(event.target.files)}
      />
      <div className="upload-icon">
        <UploadCloud size={26} />
      </div>
      <h2>Drop GIS files here</h2>
      <p>Supports SHP ZIP, KML, GeoJSON, CSV, and GPX input. DXF is export-only in this beta.</p>
      <Button type="button" variant="secondary" onClick={() => inputRef.current?.click()}>
        Browse files
      </Button>
      <div className="chip-row">
        {supported.map((format) => (
          <FormatChip key={format} format={format} />
        ))}
      </div>
      <div className="sample-links" aria-label="Sample files">
        <a href="/samples/sample.csv" download>
          CSV sample
        </a>
        <a href="/samples/sample.geojson" download>
          GeoJSON sample
        </a>
        <a href="/samples/sample.kml" download>
          KML sample
        </a>
        <a href="/samples/sample.gpx" download>
          GPX sample
        </a>
      </div>
      <span className="upload-note">Files are processed locally in your browser.</span>
    </section>
  );
}
