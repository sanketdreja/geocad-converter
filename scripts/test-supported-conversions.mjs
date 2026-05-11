import fs from "node:fs/promises";
import path from "node:path";
import JSZip from "jszip";
import { runBrowserConversion } from "../src/services/gdalWasmService.ts";

class XmlNode {
  constructor(source, attrs = "", parentElement = null) {
    this.source = source;
    this.attrs = attrs;
    this.parentElement = parentElement;
  }

  get textContent() {
    return this.source.replace(/<[^>]+>/g, "").trim();
  }

  getAttribute(name) {
    const match = this.attrs.match(new RegExp(`${name}=["']([^"']*)["']`, "i"));
    return match?.[1] ?? null;
  }

  getElementsByTagName(tagName) {
    const escaped = tagName.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const paired = new RegExp(`<(?:[\\w.-]+:)?${escaped}\\b([^>]*)>([\\s\\S]*?)</(?:[\\w.-]+:)?${escaped}>`, "gi");
    const selfClosing = new RegExp(`<(?:[\\w.-]+:)?${escaped}\\b([^>]*)\\/>`, "gi");
    const nodes = [];
    let match = paired.exec(this.source);
    while (match) {
      nodes.push(new XmlNode(match[2], match[1], this));
      match = paired.exec(this.source);
    }
    match = selfClosing.exec(this.source);
    while (match) {
      nodes.push(new XmlNode("", match[1], this));
      match = selfClosing.exec(this.source);
    }
    return nodes;
  }
}

globalThis.DOMParser = class DOMParser {
  parseFromString(text) {
    return new XmlNode(text);
  }
};

const settings = {
  sourceCRS: "EPSG:4326",
  targetCRS: "EPSG:4326",
  keepAttributes: true,
  keepLayerNames: true,
  removeEmptyGeometries: true,
  force2D: true
};

const pairs = [
  ["shp", "geojson"],
  ["shp", "kml"],
  ["shp", "csv"],
  ["shp", "dxf"],
  ["kml", "geojson"],
  ["kml", "csv"],
  ["kml", "dxf"],
  ["geojson", "kml"],
  ["geojson", "csv"],
  ["geojson", "dxf"],
  ["csv", "geojson"],
  ["csv", "kml"],
  ["csv", "dxf"],
  ["gpx", "geojson"],
  ["gpx", "kml"],
  ["gpx", "csv"],
  ["gpx", "dxf"]
];

function writeInt32BE(view, offset, value) {
  view.setInt32(offset, value, false);
}

function writeInt32LE(view, offset, value) {
  view.setInt32(offset, value, true);
}

function writeDoubleLE(view, offset, value) {
  view.setFloat64(offset, value, true);
}

function shapefileHeader(fileLengthWords) {
  const buffer = new ArrayBuffer(100);
  const view = new DataView(buffer);
  writeInt32BE(view, 0, 9994);
  writeInt32BE(view, 24, fileLengthWords);
  writeInt32LE(view, 28, 1000);
  writeInt32LE(view, 32, 1);
  writeDoubleLE(view, 36, 77.209);
  writeDoubleLE(view, 44, 28.6139);
  writeDoubleLE(view, 52, 77.209);
  writeDoubleLE(view, 60, 28.6139);
  return new Uint8Array(buffer);
}

function createShp() {
  const buffer = new ArrayBuffer(128);
  const bytes = new Uint8Array(buffer);
  bytes.set(shapefileHeader(64), 0);
  const view = new DataView(buffer);
  writeInt32BE(view, 100, 1);
  writeInt32BE(view, 104, 10);
  writeInt32LE(view, 108, 1);
  writeDoubleLE(view, 112, 77.209);
  writeDoubleLE(view, 120, 28.6139);
  return bytes;
}

function createShx() {
  const buffer = new ArrayBuffer(108);
  const bytes = new Uint8Array(buffer);
  bytes.set(shapefileHeader(54), 0);
  const view = new DataView(buffer);
  writeInt32BE(view, 100, 50);
  writeInt32BE(view, 104, 10);
  return bytes;
}

function createDbf() {
  const buffer = new ArrayBuffer(87);
  const bytes = new Uint8Array(buffer);
  const view = new DataView(buffer);
  bytes[0] = 0x03;
  bytes[1] = 126;
  bytes[2] = 5;
  bytes[3] = 11;
  view.setUint32(4, 1, true);
  view.setUint16(8, 65, true);
  view.setUint16(10, 21, true);
  "NAME".split("").forEach((char, index) => {
    bytes[32 + index] = char.charCodeAt(0);
  });
  bytes[43] = "C".charCodeAt(0);
  bytes[48] = 20;
  bytes[64] = 0x0d;
  bytes[65] = 0x20;
  const value = "Sample Point".padEnd(20, " ");
  value.split("").forEach((char, index) => {
    bytes[66 + index] = char.charCodeAt(0);
  });
  bytes[86] = 0x1a;
  return bytes;
}

async function createShapefileZip() {
  const zip = new JSZip();
  zip.file("sample.shp", createShp());
  zip.file("sample.shx", createShx());
  zip.file("sample.dbf", createDbf());
  zip.file(
    "sample.prj",
    'GEOGCS["WGS 84",DATUM["WGS_1984",SPHEROID["WGS 84",6378137,298.257223563]],PRIMEM["Greenwich",0],UNIT["degree",0.0174532925199433]]'
  );
  return zip.generateAsync({ type: "uint8array" });
}

async function sampleFile(format) {
  if (format === "shp") {
    const data = await createShapefileZip();
    return new File([data], "sample-shp.zip", { type: "application/zip" });
  }

  const names = {
    csv: "sample.csv",
    geojson: "sample.geojson",
    kml: "sample.kml",
    gpx: "sample.gpx"
  };
  const fileName = names[format];
  const data = await fs.readFile(path.join(process.cwd(), "public", "samples", fileName));
  return new File([data], fileName);
}

function assertOutput(format, text) {
  if (!text.trim()) throw new Error(`${format} output was empty`);
  if (format === "geojson" && JSON.parse(text).type !== "FeatureCollection") throw new Error("GeoJSON output was not a FeatureCollection");
  if (format === "kml" && !text.includes("<kml")) throw new Error("KML output did not contain a KML document");
  if (format === "csv" && !text.startsWith("id,geometry_type,longitude,latitude")) throw new Error("CSV output header was invalid");
  if (format === "dxf" && !text.includes("SECTION")) throw new Error("DXF output did not contain an ENTITIES section");
}

for (const [inputFormat, outputFormat] of pairs) {
  const file = await sampleFile(inputFormat);
  const result = await runBrowserConversion(
    {
      id: `${inputFormat}-to-${outputFormat}`,
      originalFileName: file.name,
      originalExtension: file.name.split(".").pop() ?? "",
      fileSizeBytes: file.size,
      inputFormat,
      outputFormat,
      fileObject: file,
      status: "ready",
      progress: 0,
      createdAt: Date.now(),
      warnings: []
    },
    settings
  );
  assertOutput(outputFormat, await result.outputBlob.text());
  console.log(`ok ${inputFormat} -> ${outputFormat} (${result.featureCount} feature(s))`);
}
