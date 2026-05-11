# GeoCAD Converter

Private browser GIS converter beta.

## Launch promise

Convert SHP ZIP, KML, GeoJSON, CSV, and GPX locally in your browser. Preview geometry, preserve simple attributes where possible, and export to GeoJSON, KML, CSV, or lightweight 2D DXF.

DWG, GPKG, and KMZ conversion are waitlist-only in this launch. For professional DWG workflows, export DWG to DXF in CAD software first, then prepare a supported GIS input.

## Run locally

```bash
npm install
npm run lint
npm run test:conversions
npm run build
npm run dev
```

Open `http://localhost:3000`.

## Supported conversion pairs

- SHP ZIP to GeoJSON, KML, CSV, lightweight DXF
- KML to GeoJSON, CSV, lightweight DXF
- GeoJSON to KML, CSV, lightweight DXF
- CSV to GeoJSON, KML, lightweight DXF
- GPX to GeoJSON, KML, CSV, lightweight DXF

## Not supported as live conversion

- DWG conversion
- DXF input conversion
- KMZ conversion
- GPKG conversion
- SHP output
- CRS reprojection
- CAD blocks, labels, styles, dimensions, annotations, or advanced CAD layers

## Browser limitations

Supported files are processed in browser memory and are not uploaded to a server in the current MVP. Very large files may be slow or fail because of browser memory limits. CRS transformation is not active in this beta; coordinates are preserved.

Shapefiles must be uploaded as a ZIP containing `.shp`, `.shx`, `.dbf`, and ideally `.prj`. If `.prj` is missing, the source CRS may be unknown.

## Samples

Small samples live in `public/samples/`:

- `sample.csv`
- `sample.geojson`
- `sample.kml`
- `sample.gpx`

For SHP ZIP testing, export a tiny point or polygon layer from QGIS and zip the matching `.shp`, `.shx`, `.dbf`, and `.prj` sidecars.

## Vercel deploy

Use the default Next.js project settings:

- Build command: `npm run build`
- Install command: `npm install`
- Output: Next.js default

Run `npm run lint`, `npm run test:conversions`, and `npm run build` before deploying.

## Google AdSense setup

1. Create or open a Google AdSense account.
2. Add and verify your production site/domain in AdSense.
3. Copy your AdSense client ID, usually shaped like `ca-pub-XXXXXXXXXXXXXXXX`.
4. Copy your publisher ID for `ads.txt`, usually shaped like `pub-XXXXXXXXXXXXXXXX`.
5. Add the environment variables from `.env.example` to `.env.local` for local testing and to Vercel Project Settings for production.
6. Check `/ads.txt` after deploy. It should return `google.com, pub-XXXXXXXXXXXXXXXX, DIRECT, f08c47fec0942fa0`.
7. Turn Auto ads on in AdSense if you want Google-managed placements.
8. Create manual display ad units later and fill the slot variables:
   `NEXT_PUBLIC_ADSENSE_SLOT_TOP`, `NEXT_PUBLIC_ADSENSE_SLOT_IN_CONTENT`, `NEXT_PUBLIC_ADSENSE_SLOT_SIDEBAR`,
   `NEXT_PUBLIC_ADSENSE_SLOT_BOTTOM`, `NEXT_PUBLIC_ADSENSE_SLOT_CONVERTER`, and `NEXT_PUBLIC_ADSENSE_SLOT_ARTICLE`.
9. Ads may not appear until AdSense approves the site and has inventory for the page.

Required AdSense variables:

```bash
NEXT_PUBLIC_SITE_URL=https://your-domain.com
NEXT_PUBLIC_ADSENSE_ENABLED=true
NEXT_PUBLIC_ADSENSE_CLIENT=ca-pub-XXXXXXXXXXXXXXXX
NEXT_PUBLIC_ADSENSE_AUTO_ADS=true
ADSENSE_PUBLISHER_ID=pub-XXXXXXXXXXXXXXXX
```

Manual slot IDs are optional. A manual slot renders only when its slot ID is configured.

## Deploy to Vercel

```bash
npm ci
npm run lint
npm run test:conversions
npm run build
vercel
vercel --prod
```

In Vercel, add the same AdSense variables from `.env.example` under Project Settings > Environment Variables, then redeploy.
