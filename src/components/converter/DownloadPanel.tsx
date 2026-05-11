"use client";

import { Archive, ClipboardList, Download, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { formatFileSize } from "@/lib/fileSize";
import type { ConversionResult } from "@/models/ConversionResult";

export function DownloadPanel({
  results,
  onDownloadFirst,
  onDownloadZip,
  onReset
}: {
  results: ConversionResult[];
  onDownloadFirst: () => void;
  onDownloadZip: () => void;
  onReset: () => void;
}) {
  const first = results[0];

  return (
    <section className="download-panel">
      <div className="panel-heading">
        <div>
          <span className="section-kicker">Output</span>
          <h2>{results.length ? "Conversion complete" : "Ready to convert"}</h2>
        </div>
        <Download size={18} />
      </div>
      {first ? (
        <div className="download-file">
          <span>{first.outputFileName}</span>
          <strong>{formatFileSize(first.outputSizeBytes)}</strong>
        </div>
      ) : (
        <p className="muted">Review format and coordinate settings, then start local conversion.</p>
      )}
      <div className="download-actions">
        <Button type="button" onClick={onDownloadFirst} disabled={!first}>
          <Download size={16} />
          Download file
        </Button>
        <Button type="button" variant="secondary" onClick={onDownloadZip} disabled={!results.length}>
          <Archive size={16} />
          Download ZIP
        </Button>
        <Button type="button" variant="ghost" onClick={onReset}>
          <RotateCcw size={16} />
          New conversion
        </Button>
      </div>
      <button className="copy-log-button" type="button" disabled={!first}>
        <ClipboardList size={15} />
        Copy conversion log
      </button>
    </section>
  );
}
