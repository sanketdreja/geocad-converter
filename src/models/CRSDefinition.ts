export interface CRSDefinition {
  code: string;
  name: string;
  type: "geographic" | "projected";
  region?: string;
  commonFor?: string[];
  proj4Definition?: string;
}
