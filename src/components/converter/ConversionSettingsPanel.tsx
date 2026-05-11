"use client";

import { ChevronDown, Settings2 } from "lucide-react";
import { crsPresets } from "@/data/crsPresets";
import { enabledConversionPairs, formatLabel } from "@/data/conversionPairs";
import type { AppSettings } from "@/models/AppSettings";
import type { SupportedFormat } from "@/models/FormatDefinition";

export type SettingsState = Pick<
  AppSettings,
  "keepAttributes" | "keepLayerNames" | "removeEmptyGeometries" | "force2D"
> & {
  outputFormat: SupportedFormat;
  sourceCRS: string;
  targetCRS: string;
};

const outputFormats: SupportedFormat[] = ["geojson", "kml", "dxf", "csv"];

export function ConversionSettingsPanel({
  settings,
  onChange
}: {
  settings: SettingsState;
  onChange: (settings: SettingsState) => void;
}) {
  function update<T extends keyof SettingsState>(key: T, value: SettingsState[T]) {
    onChange({ ...settings, [key]: value });
  }

  return (
    <aside className="settings-panel">
      <div className="panel-heading">
        <div>
          <span className="section-kicker">Settings</span>
          <h2>Conversion controls</h2>
        </div>
        <Settings2 size={18} />
      </div>

      <label className="field-label">
        Output format
        <select value={settings.outputFormat} onChange={(event) => update("outputFormat", event.target.value as SupportedFormat)}>
          {outputFormats.map((format) => (
            <option key={format} value={format}>
              {formatLabel[format]}
            </option>
          ))}
        </select>
      </label>

      <label className="field-label">
        Source CRS
        <select value={settings.sourceCRS} onChange={(event) => update("sourceCRS", event.target.value)}>
          {crsPresets.map((crs) => (
            <option key={crs.code} value={crs.code}>
              {crs.code} - {crs.name}
            </option>
          ))}
        </select>
      </label>

      <label className="field-label">
        Target CRS
        <select value={settings.targetCRS} onChange={(event) => update("targetCRS", event.target.value)}>
          {crsPresets.map((crs) => (
            <option key={crs.code} value={crs.code}>
              {crs.code} - {crs.name}
            </option>
          ))}
        </select>
      </label>

      <div className="settings-warning">
        CRS transformation is not active in this beta. Coordinates are preserved even when source and target CRS differ.
      </div>

      <div className="option-group">
        <label>
          <input
            type="checkbox"
            checked={settings.keepAttributes}
            onChange={(event) => update("keepAttributes", event.target.checked)}
          />
          Keep attributes
        </label>
        <label>
          <input
            type="checkbox"
            checked={settings.keepLayerNames}
            onChange={(event) => update("keepLayerNames", event.target.checked)}
          />
          Keep layer names
        </label>
        <label>
          <input
            type="checkbox"
            checked={settings.removeEmptyGeometries}
            onChange={(event) => update("removeEmptyGeometries", event.target.checked)}
          />
          Remove empty geometries
        </label>
        <label>
          <input type="checkbox" checked={settings.force2D} onChange={(event) => update("force2D", event.target.checked)} />
          Force 2D geometry
        </label>
      </div>

      <details className="advanced-options">
        <summary>
          Advanced options
          <ChevronDown size={15} />
        </summary>
        <div className="advanced-grid">
          <span>Geometry simplification</span>
          <strong>Off</strong>
          <span>Encoding</span>
          <strong>UTF-8</strong>
          <span>Coordinate precision</span>
          <strong>Auto</strong>
          <span>Suggested MVP pairs</span>
          <strong>{enabledConversionPairs.length}</strong>
        </div>
      </details>
    </aside>
  );
}
