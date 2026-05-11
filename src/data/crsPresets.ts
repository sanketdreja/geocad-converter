import type { CRSDefinition } from "@/models/CRSDefinition";

export const crsPresets: CRSDefinition[] = [
  {
    code: "EPSG:4326",
    name: "WGS 84",
    type: "geographic",
    region: "Global",
    commonFor: ["KML", "GeoJSON", "GPX", "GPS data"]
  },
  {
    code: "EPSG:3857",
    name: "Web Mercator",
    type: "projected",
    region: "Global web maps",
    commonFor: ["Tile maps", "web previews"]
  },
  {
    code: "EPSG:4269",
    name: "NAD83",
    type: "geographic",
    region: "North America",
    commonFor: ["US public datasets", "survey exports"]
  },
  {
    code: "EPSG:27700",
    name: "British National Grid",
    type: "projected",
    region: "United Kingdom",
    commonFor: ["UK planning", "Ordnance Survey"]
  },
  {
    code: "EPSG:32643",
    name: "WGS 84 / UTM Zone 43N",
    type: "projected",
    region: "India",
    commonFor: ["Western and central India projects"]
  },
  {
    code: "EPSG:32644",
    name: "WGS 84 / UTM Zone 44N",
    type: "projected",
    region: "India",
    commonFor: ["Central and eastern India projects"]
  }
];
