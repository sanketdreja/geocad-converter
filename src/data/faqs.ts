export const homepageFaqs = [
  {
    question: "Are my files uploaded to a server?",
    answer: "No. The MVP is designed around local browser processing. Uploaded files remain in memory on your machine while conversion runs."
  },
  {
    question: "Which formats should I start with?",
    answer: "The safest launch set is SHP ZIP, KML, GeoJSON, CSV, and GPX, with DXF output for simpler geometries. DWG is handled as a beta request."
  },
  {
    question: "Can I batch convert files?",
    answer: "The interface supports a batch queue and ZIP download flow. Heavy conversions should be limited to a few concurrent jobs to keep the browser responsive."
  },
  {
    question: "Why does a shapefile need a ZIP?",
    answer: "A shapefile is a group of files, usually .shp, .shx, and .dbf, with .prj strongly recommended for projection information."
  }
];
