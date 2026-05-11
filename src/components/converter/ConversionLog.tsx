import type { FileJob } from "@/models/FileJob";

export function ConversionLog({ jobs }: { jobs: FileJob[] }) {
  const lines = jobs.flatMap((job) => [
    `[${job.status.toUpperCase()}] ${job.originalFileName}`,
    ...job.warnings.map((warning) => `Warning: ${warning}`),
    ...(job.result?.logs ?? []),
    ...(job.result?.warnings.map((warning) => `Warning: ${warning}`) ?? []),
    ...(job.error ? [`Error: ${job.error.userMessage}`] : [])
  ]);

  return (
    <section className="conversion-log">
      <div className="panel-heading">
        <div>
          <span className="section-kicker">Log</span>
          <h2>Conversion log</h2>
        </div>
      </div>
      <pre>{lines.length ? lines.join("\n") : "No conversion events yet."}</pre>
    </section>
  );
}
