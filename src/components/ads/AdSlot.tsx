"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";
import { adsConfig, getAdSlot, type AdPlacement } from "@/config/ads";

export type AdSlotProps = {
  placement: AdPlacement;
  className?: string;
  label?: string;
};

const isDevelopment = process.env.NODE_ENV !== "production";

function AdPlaceholder({ placement, className }: { placement: AdPlacement; className?: string }) {
  return (
    <div className={["ad-slot", "ad-slot-placeholder", className].filter(Boolean).join(" ")}>
      Ad slot: {placement}
    </div>
  );
}

export function AdSlot({ placement, className, label }: AdSlotProps) {
  const pathname = usePathname();
  const slot = getAdSlot(placement);
  const canRenderAd = adsConfig.enabled && Boolean(slot);

  useEffect(() => {
    if (!canRenderAd) return;

    try {
      window.adsbygoogle = window.adsbygoogle || [];
      window.adsbygoogle.push({});
    } catch (error) {
      if (process.env.NODE_ENV === "development") {
        console.warn("AdSense slot could not be requested.", error);
      }
    }
  }, [canRenderAd, pathname, slot]);

  if (!canRenderAd) {
    return isDevelopment ? <AdPlaceholder placement={placement} className={className} /> : null;
  }

  return (
    <aside
      className={["ad-slot", className].filter(Boolean).join(" ")}
      aria-label={label ?? `Advertisement: ${placement}`}
      data-ad-placement={placement}
    >
      <span className="ad-label">Advertisement</span>
      <ins
        className="adsbygoogle"
        style={{ display: "block" }}
        data-ad-client={adsConfig.client}
        data-ad-slot={slot}
        data-ad-format="auto"
        data-full-width-responsive="true"
      />
    </aside>
  );
}
