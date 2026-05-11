"use client";

import { Download, Trash2 } from "lucide-react";
import { FormatChip } from "@/components/ui/FormatChip";
import { Progress } from "@/components/ui/Progress";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { formatFileSize } from "@/lib/fileSize";
import type { FileJob } from "@/models/FileJob";

export function BatchQueueTable({
  jobs,
  onRemove,
  onDownload
}: {
  jobs: FileJob[];
  onRemove: (jobId: string) => void;
  onDownload: (job: FileJob) => void;
}) {
  if (!jobs.length) {
    return (
      <div className="queue-empty">
        <span>No files queued</span>
        <p>Drop one file or a batch to inspect format and readiness.</p>
      </div>
    );
  }

  return (
    <div className="queue-table-wrap">
      <table className="queue-table">
        <thead>
          <tr>
            <th>File</th>
            <th>Input</th>
            <th>Output</th>
            <th>Status</th>
            <th>Progress</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {jobs.map((job) => (
            <tr key={job.id}>
              <td>
                <span className="file-name">{job.originalFileName}</span>
                <span className="file-size">{formatFileSize(job.fileSizeBytes)}</span>
              </td>
              <td>
                <FormatChip format={job.inputFormat} />
              </td>
              <td>
                <FormatChip format={job.outputFormat} />
              </td>
              <td>
                <StatusBadge status={job.status} />
              </td>
              <td>
                <Progress value={job.progress} />
              </td>
              <td>
                <div className="icon-actions">
                  <button
                    aria-label="Download result"
                    className="icon-button"
                    disabled={!job.result}
                    onClick={() => onDownload(job)}
                    title="Download result"
                  >
                    <Download size={15} />
                  </button>
                  <button className="icon-button" aria-label="Remove file" onClick={() => onRemove(job.id)} title="Remove">
                    <Trash2 size={15} />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
