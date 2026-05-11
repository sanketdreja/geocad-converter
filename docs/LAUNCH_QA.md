# Launch QA Checklist

## Build gates

- [ ] `npm run lint`
- [ ] `npm run test:conversions`
- [ ] `npm run build`

## Page checks

- [ ] Homepage loads and copy says private browser GIS converter beta
- [ ] Mobile layout works at narrow viewport
- [ ] `/convert` loads the workbench
- [ ] `/dwg-beta` shows waitlist-only DWG/GPKG/KMZ copy
- [ ] `/privacy` says supported files process locally and are not uploaded
- [ ] `/privacy` discloses AdSense cookies when ads are enabled
- [ ] `/help` explains CRS, DXF, and shapefile sidecar limits
- [ ] `/formats` marks DXF as output-only and DWG/GPKG/KMZ as waitlist
- [ ] `/ads.txt` returns the configured publisher ID line in production
- [ ] `/sitemap.xml` includes supported converter pages only
- [ ] `/robots.txt` allows indexing and references the sitemap

## Upload tests

- [ ] Upload `public/samples/sample.csv`
- [ ] Upload `public/samples/sample.geojson`
- [ ] Upload `public/samples/sample.kml`
- [ ] Upload `public/samples/sample.gpx`
- [ ] Upload a tiny SHP ZIP containing `.shp`, `.shx`, `.dbf`, and `.prj`

## Conversion tests

- [ ] CSV to GeoJSON, KML, lightweight DXF
- [ ] GeoJSON to KML, CSV, lightweight DXF
- [ ] KML to GeoJSON, CSV, lightweight DXF
- [ ] GPX to GeoJSON, KML, CSV, lightweight DXF
- [ ] SHP ZIP to GeoJSON, KML, CSV, lightweight DXF
- [ ] Download one output file
- [ ] Download all successful outputs as ZIP
- [ ] Preview shows bounds, feature count, and geometry

## Warnings and unsupported flows

- [ ] Changing source and target CRS shows preserved-coordinate warning
- [ ] DXF output shows lightweight 2D warning
- [ ] Large file warning appears for files above the warning threshold
- [ ] SHP ZIP missing `.shx` or `.dbf` fails clearly
- [ ] SHP ZIP missing `.prj` warns that CRS may be unknown
- [ ] DXF, DWG, KMZ, and GPKG uploads fail as unsupported beta inputs
- [ ] Unsupported conversion pairs are not offered as active SEO converter pages
- [ ] DWG waitlist form accepts email and use case without asking for files
