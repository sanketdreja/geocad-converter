import { Cpu, Eye, Layers, ShieldCheck } from "lucide-react";

const items = [
  { icon: ShieldCheck, label: "Files stay on your machine" },
  { icon: Cpu, label: "Browser-memory conversion" },
  { icon: Layers, label: "Attributes preserved where possible" },
  { icon: Eye, label: "Preview geometry before export" }
];

export function TrustBar() {
  return (
    <section className="trust-bar">
      {items.map(({ icon: Icon, label }) => (
        <div key={label}>
          <Icon size={18} />
          <span>{label}</span>
        </div>
      ))}
    </section>
  );
}
