import type { JobStatus } from "@/models/FileJob";

const label: Record<JobStatus, string> = {
  queued: "Queued",
  validating: "Validating",
  ready: "Ready",
  converting: "Converting",
  success: "Complete",
  failed: "Failed",
  cancelled: "Cancelled"
};

export function StatusBadge({ status }: { status: JobStatus }) {
  return <span className={`status-badge status-${status}`}>{label[status]}</span>;
}
