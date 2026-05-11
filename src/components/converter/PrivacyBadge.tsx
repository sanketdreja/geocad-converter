import { ShieldCheck } from "lucide-react";

export function PrivacyBadge() {
  return (
    <div className="privacy-badge">
      <ShieldCheck size={17} />
      <span>Local processing - files never upload to a server.</span>
    </div>
  );
}
