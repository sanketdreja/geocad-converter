import Link from "next/link";
import { Grid3X3, ShieldCheck } from "lucide-react";
import { LinkButton } from "@/components/ui/Button";

export function Header() {
  return (
    <header className="site-header">
      <Link className="brand" href="/">
        <span className="brand-mark" aria-hidden="true">
          <Grid3X3 size={18} />
        </span>
        <span>GeoCAD Converter</span>
      </Link>
      <nav className="nav-links" aria-label="Primary">
        <Link href="/convert">Converter</Link>
        <Link href="/formats">Formats</Link>
        <Link href="/privacy">Privacy</Link>
        <Link href="/help">Guides</Link>
        <Link href="/dwg-beta">Waitlist</Link>
      </nav>
      <div className="header-actions">
        <span className="header-privacy">
          <ShieldCheck size={15} />
          Local processing
        </span>
        <LinkButton href="/convert" size="sm">
          Start converting
        </LinkButton>
      </div>
    </header>
  );
}
