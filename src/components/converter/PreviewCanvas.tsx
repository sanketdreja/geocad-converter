"use client";

import { Layers, Maximize2, Minus, Plus } from "lucide-react";
import { useEffect, useRef } from "react";
import { CRSChip } from "@/components/ui/CRSChip";
import type { PreviewGeometry } from "@/models/PreviewGeometry";

export function PreviewCanvas({ preview, crs }: { preview?: PreviewGeometry; crs: string }) {
  const ref = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const context = canvas.getContext("2d");
    if (!context) return;

    const width = canvas.width;
    const height = canvas.height;
    context.clearRect(0, 0, width, height);
    context.fillStyle = "#061522";
    context.fillRect(0, 0, width, height);

    context.strokeStyle = "rgba(148, 163, 184, 0.16)";
    context.lineWidth = 1;
    for (let x = 0; x < width; x += 40) {
      context.beginPath();
      context.moveTo(x, 0);
      context.lineTo(x, height);
      context.stroke();
    }
    for (let y = 0; y < height; y += 40) {
      context.beginPath();
      context.moveTo(0, y);
      context.lineTo(width, y);
      context.stroke();
    }

    if (!preview || (!preview.paths.length && !preview.points.length)) {
      context.fillStyle = "rgba(226, 232, 240, 0.68)";
      context.font = "24px Inter, sans-serif";
      context.textAlign = "center";
      context.fillText("No preview geometry yet", width / 2, height / 2);
      return;
    }

    const [minX, minY, maxX, maxY] = preview.bounds;
    const padding = 44;
    const spanX = Math.max(maxX - minX, 0.000001);
    const spanY = Math.max(maxY - minY, 0.000001);
    const scale = Math.min((width - padding * 2) / spanX, (height - padding * 2) / spanY);
    const offsetX = (width - spanX * scale) / 2;
    const offsetY = (height - spanY * scale) / 2;
    const project = ([x, y]: number[]) => [offsetX + (x - minX) * scale, height - (offsetY + (y - minY) * scale)];

    context.strokeStyle = "#22d3ee";
    context.lineWidth = 2;
    context.globalAlpha = 0.9;
    preview.paths.forEach((path) => {
      context.beginPath();
      path.forEach((coordinate, index) => {
        const [x, y] = project(coordinate);
        if (index === 0) context.moveTo(x, y);
        else context.lineTo(x, y);
      });
      context.stroke();
    });

    context.fillStyle = "#f59e0b";
    preview.points.forEach((coordinate) => {
      const [x, y] = project(coordinate);
      context.beginPath();
      context.arc(x, y, 4, 0, Math.PI * 2);
      context.fill();
    });

    context.globalAlpha = 1;
  }, [preview]);

  return (
    <section className="preview-panel">
      <div className="preview-toolbar">
        <div>
          <span className="section-kicker">Preview</span>
          <h2>{preview ? "Geometry preview" : "Awaiting file"}</h2>
        </div>
        <div className="preview-tools">
          <button className="icon-button" title="Zoom in" aria-label="Zoom in">
            <Plus size={15} />
          </button>
          <button className="icon-button" title="Zoom out" aria-label="Zoom out">
            <Minus size={15} />
          </button>
          <button className="icon-button" title="Fit to bounds" aria-label="Fit to bounds">
            <Maximize2 size={15} />
          </button>
        </div>
      </div>

      <div className="canvas-shell">
        <canvas ref={ref} width={920} height={560} aria-label="Map geometry preview canvas" />
        <div className="coordinate-label top-left">{preview ? `N ${preview.bounds[3].toFixed(4)}` : "No bounds"}</div>
        <div className="coordinate-label bottom-right">{preview ? `E ${preview.bounds[2].toFixed(4)}` : "Awaiting file"}</div>
      </div>

      <div className="preview-metadata">
        <div>
          <span>Features</span>
          <strong>{preview?.featureCount ?? "0"}</strong>
        </div>
        <div>
          <span>Layers</span>
          <strong>{preview?.layers.length ?? "0"}</strong>
        </div>
        <div>
          <span>Bounds</span>
          <strong>{preview ? preview.bounds.map((item) => item.toFixed(3)).join(", ") : "No geometry"}</strong>
        </div>
        <div>
          <span>CRS</span>
          <CRSChip code={crs} />
        </div>
      </div>

      <div className="layer-panel">
        <div className="layer-heading">
          <Layers size={16} />
          <span>Layers</span>
        </div>
        {(preview?.layers.length ? preview.layers : [{ id: "empty", name: "Preview layer", geometryType: "mixed", featureCount: 0 }]).map(
          (layer) => (
            <label key={layer.id} className="layer-row">
              <input type="checkbox" defaultChecked />
              <span>{layer.name}</span>
              <code>{layer.geometryType}</code>
              <strong>{layer.featureCount}</strong>
            </label>
          )
        )}
      </div>
    </section>
  );
}
