import { DEFAULT_BATCH_CONCURRENCY } from "@/lib/constants";
import type { FileJob } from "@/models/FileJob";

export function recommendConcurrency(jobs: FileJob[]) {
  const largestFile = Math.max(0, ...jobs.map((job) => job.fileSizeBytes));
  if (largestFile > 40 * 1024 * 1024) return 1;
  if (jobs.length > 20) return DEFAULT_BATCH_CONCURRENCY;
  return Math.min(3, Math.max(1, jobs.length));
}

export function summarizeBatch(jobs: FileJob[]) {
  return {
    total: jobs.length,
    ready: jobs.filter((job) => job.status === "ready").length,
    success: jobs.filter((job) => job.status === "success").length,
    failed: jobs.filter((job) => job.status === "failed").length,
    converting: jobs.filter((job) => job.status === "converting").length
  };
}
