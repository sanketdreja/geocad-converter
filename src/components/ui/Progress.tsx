export function Progress({ value }: { value: number }) {
  const clamped = Math.max(0, Math.min(100, value));
  return (
    <div className="progress-track" aria-label={`Progress ${clamped}%`}>
      <span className="progress-fill" style={{ width: `${clamped}%` }} />
    </div>
  );
}
