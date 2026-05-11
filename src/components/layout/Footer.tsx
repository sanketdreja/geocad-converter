import Link from "next/link";
import { SEOFooterLinks } from "@/components/layout/SEOFooterLinks";

export function Footer() {
  return (
    <footer className="site-footer">
      <SEOFooterLinks />
      <div className="footer-bottom">
        <div>
          <strong>GeoCAD Converter</strong>
          <p>Private browser GIS converter beta with lightweight DXF export.</p>
        </div>
        <div className="footer-nav">
          <Link href="/privacy">Privacy</Link>
          <Link href="/help">Help</Link>
          <Link href="/dwg-beta">DWG beta</Link>
        </div>
      </div>
    </footer>
  );
}
