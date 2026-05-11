"use client";

import { Play, ShieldCheck, Trash2 } from "lucide-react";
import { useMemo, useState } from "react";
import { recommendConcurrency, summarizeBatch } from "@/controllers/BatchController";
import { convertJob } from "@/controllers/ConversionController";
import { DownloadController } from "@/controllers/DownloadController";
import { createJobsFromFiles } from "@/controllers/UploadController";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { ConverterAd } from "@/components/ads/AdBanner";
import { BatchQueueTable } from "@/components/converter/BatchQueueTable";
import { ConversionLog } from "@/components/converter/ConversionLog";
import { ConversionSettingsPanel, type SettingsState } from "@/components/converter/ConversionSettingsPanel";
import { DownloadPanel } from "@/components/converter/DownloadPanel";
import { ErrorExplainer } from "@/components/converter/ErrorExplainer";
import { PreviewCanvas } from "@/components/converter/PreviewCanvas";
import { PrivacyBadge } from "@/components/converter/PrivacyBadge";
import { UploadDropzone } from "@/components/converter/UploadDropzone";
import { formatLabel, isEnabledConversionPair } from "@/data/conversionPairs";
import { errorFromException } from "@/controllers/ErrorController";
import type { ConversionResult } from "@/models/ConversionResult";
import type { FileJob } from "@/models/FileJob";
import type { SupportedFormat } from "@/models/FormatDefinition";

const defaultSettings: SettingsState = {
  outputFormat: "geojson",
  sourceCRS: "EPSG:4326",
  targetCRS: "EPSG:4326",
  keepAttributes: true,
  keepLayerNames: true,
  removeEmptyGeometries: true,
  force2D: false
};

function unsupportedPairError(inputFormat: SupportedFormat, outputFormat: SupportedFormat) {
  return {
    code: "UNSUPPORTED_PAIR" as const,
    title: "Unsupported conversion pair",
    userMessage: `${inputFormat.toUpperCase()} to ${outputFormat.toUpperCase()} is not enabled in this browser beta.`,
    suggestions: ["Choose a supported output format", "Use GeoJSON as an intermediate format when possible"]
  };
}

export function ConverterWorkspace({ initialOutput = "geojson" }: { initialOutput?: SettingsState["outputFormat"] }) {
  const [jobs, setJobs] = useState<FileJob[]>([]);
  const [settings, setSettings] = useState<SettingsState>({ ...defaultSettings, outputFormat: initialOutput });
  const [busy, setBusy] = useState(false);
  const summary = useMemo(() => summarizeBatch(jobs), [jobs]);
  const results = jobs.map((job) => job.result).filter(Boolean) as ConversionResult[];
  const activePreview = [...jobs].reverse().find((job) => job.result?.preview)?.result?.preview;
  const concurrency = recommendConcurrency(jobs);

  async function addFiles(files: File[]) {
    const newJobs = await createJobsFromFiles(files, settings.outputFormat);
    setJobs((current) => [...newJobs, ...current]);
  }

  function updateSettings(next: SettingsState) {
    setSettings(next);
    setJobs((current) =>
      current.map((job) => {
        const canRecheck = ["ready", "queued", "failed"].includes(job.status);
        if (!canRecheck) return job;

        const pairSupported = isEnabledConversionPair(job.inputFormat, next.outputFormat);
        const failedOnlyForPair = job.status === "failed" && job.error?.code === "UNSUPPORTED_PAIR";

        if (pairSupported && (["ready", "queued"].includes(job.status) || failedOnlyForPair)) {
          return { ...job, outputFormat: next.outputFormat, status: "ready", progress: 0, error: undefined };
        }

        if (!pairSupported && ["ready", "queued"].includes(job.status)) {
          return {
            ...job,
            outputFormat: next.outputFormat,
            status: "failed",
            progress: 100,
            error: unsupportedPairError(job.inputFormat, next.outputFormat)
          };
        }

        return job;
      })
    );
  }

  async function runConversions() {
    const readyJobs = jobs.filter((job) => job.status === "ready");
    if (!readyJobs.length) return;
    setBusy(true);

    for (const job of readyJobs) {
      setJobs((current) =>
        current.map((candidate) =>
          candidate.id === job.id ? { ...candidate, status: "converting", progress: 35, startedAt: Date.now() } : candidate
        )
      );

      try {
        const currentJob = { ...job, outputFormat: settings.outputFormat };
        const result = await convertJob(currentJob, settings);
        setJobs((current) =>
          current.map((candidate) =>
            candidate.id === job.id
              ? {
                  ...candidate,
                  outputFormat: settings.outputFormat,
                  status: "success",
                  progress: 100,
                  finishedAt: Date.now(),
                  result
                }
              : candidate
          )
        );
      } catch (error) {
        setJobs((current) =>
          current.map((candidate) =>
            candidate.id === job.id
              ? {
                  ...candidate,
                  status: "failed",
                  progress: 100,
                  finishedAt: Date.now(),
                  error: errorFromException(error)
                }
              : candidate
          )
        );
      }
    }

    setBusy(false);
  }

  return (
    <main className="converter-page">
      <section className="workspace-topbar">
        <div>
          <Badge tone="cyan">Browser beta workbench</Badge>
          <h1>Private browser GIS converter beta</h1>
          <p>
            Convert SHP ZIP, KML, GeoJSON, CSV, and GPX locally. Export GeoJSON, KML, CSV, or lightweight 2D DXF.
          </p>
        </div>
        <PrivacyBadge />
      </section>

      <ConverterAd className="ad-converter-band" />

      <section className="workspace-stats">
        <div>
          <span>Queued</span>
          <strong>{summary.total}</strong>
        </div>
        <div>
          <span>Ready</span>
          <strong>{summary.ready}</strong>
        </div>
        <div>
          <span>Complete</span>
          <strong>{summary.success}</strong>
        </div>
        <div>
          <span>Browser concurrency</span>
          <strong>{concurrency}</strong>
        </div>
      </section>

      <section className="converter-workspace">
        <div className="workspace-left">
          <UploadDropzone onFiles={addFiles} />
          <div className="queue-header">
            <div>
              <span className="section-kicker">Batch queue</span>
              <h2>Files</h2>
            </div>
            <Button type="button" size="sm" variant="ghost" onClick={() => setJobs([])} disabled={!jobs.length}>
              <Trash2 size={15} />
              Clear
            </Button>
          </div>
          <BatchQueueTable
            jobs={jobs}
            onRemove={(jobId) => setJobs((current) => current.filter((job) => job.id !== jobId))}
            onDownload={(job) => job.result && DownloadController.downloadResult(job.result)}
          />
          {jobs.find((job) => job.error) ? (
            <ErrorExplainer error={jobs.find((job) => job.error)?.error ?? errorFromException("Unknown error")} />
          ) : null}
        </div>

        <PreviewCanvas preview={activePreview} crs={settings.targetCRS} />

        <div className="workspace-right">
          <ConversionSettingsPanel settings={settings} onChange={updateSettings} />
          <Button type="button" size="lg" onClick={runConversions} disabled={busy || !jobs.some((job) => job.status === "ready")}>
            <Play size={17} />
            {busy ? "Converting locally" : `Convert to ${formatLabel[settings.outputFormat]}`}
          </Button>
          <div className="privacy-inline">
            <ShieldCheck size={16} />
            Conversion runs in browser memory. Keep this tab open while jobs run.
          </div>
          <DownloadPanel
            results={results}
            onDownloadFirst={() => results[0] && DownloadController.downloadResult(results[0])}
            onDownloadZip={() => DownloadController.downloadAllResults(results)}
            onReset={() => setJobs([])}
          />
          <ConversionLog jobs={jobs} />
        </div>
      </section>
    </main>
  );
}
