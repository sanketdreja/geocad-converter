export interface PreviewGeometry {
  type: "point" | "line" | "polygon" | "mixed";
  bounds: [number, number, number, number];
  featureCount: number;
  layers: PreviewLayer[];
  points: number[][];
  paths: number[][][];
}

export interface PreviewLayer {
  id: string;
  name: string;
  visible: boolean;
  geometryType: "point" | "line" | "polygon" | "mixed";
  featureCount: number;
  style: {
    strokeWidth: number;
    opacity: number;
  };
}
