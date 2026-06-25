# Treefera June 2026 Hackathon — Earth-observation dataset

Welcome. This is a curated, analysis-ready Earth-observation dataset for the
June 2026 LCAW Hackathon: seven satellite/derived products staged over nine study sites
("AOIs") around the world, plus AOI boundaries and supplementary ground-truth. Everything is
shared via the hackathon Google Drive.

Everything here is pre-processed into open, cloud-native formats — **Zarr** cubes for
dense time series and **Cloud-Optimised GeoTIFFs (COGs)** for annual layers — so you can
open a file and start analysing without wrangling raw scenes.

## Start here

Begin with the **bundled demo pack** —a tiny (~30 MB) clipped sample of every product that
runs entirely from local files:

1. Download `hackathon-demo.zip` from the top level of the shared Google Drive (or grab the
   `example-scripts/` folder from the hackathon repo).
2. Follow `example-scripts/README.md` — `uv sync`, then run the four example notebooks in
   JupyterLab or VSCode. Each notebook opens one product and produces a figure you can copy.

For setup/prerequisites (Python, uv, QGIS, etc.) see `hackathon-info.md` in the repo. For a
plain-language description of each data source and its gotchas, see `data-sources-readme.md`.

## Dataset layout

Every top-level folder in the shared Google Drive:

| Folder | Format | What it is |
|--------|--------|------------|
| `sentinel2/<aoi>/<range>/cube.zarr` | Zarr v3 | Monthly-median optical reflectance, bands B02–B12 + `n_obs`, uint16, 10 m. Provided zipped — see note below. See `sentinel2/README.md`. **Read the band-quality caveat below.** |
| `sentinel1_mpc/<aoi>/<range>/cube.zarr` | Zarr v3 | Monthly-median VV/VH SAR backscatter, **linear** power + `n_obs`, 10 m (Microsoft Planetary Computer). Provided zipped — see note below. |
| `sentinel1_gee/<aoi>/annual/<yr>/*.tif` | COG | Annual VV/VH SAR backscatter in **dB**, 2017–2025 (Google Earth Engine). |
| `palsar_gee/<aoi>/annual/<yr>/*.tif` | COG | Annual L-band HH/HV SAR in **dB**, 25 m, 2017–2024 (JAXA ALOS/ALOS-2). **Currently `G_sar_borneo` only.** See `palsar_gee/README.md`. |
| `esri_lulc/<aoi>/annual/<yr>/*.tif` | COG | Annual land-cover class, uint8, 10 m, EPSG:4326. Palette in `esri_lulc/esri_lulc_classes.json`; see `esri_lulc/README.md`. |
| `hansen_lossyear/<aoi>/*.tif` | COG | Forest-loss year, uint8 (`0` none, `1`–`24` → `2000+n`), 30 m. See `hansen_lossyear/README.md`. |
| `aef_embeddings/<aoi>/annual/*.tif` | COG | 64-band AlphaEarth learned embeddings, float32, ~10 m, native UTM. See `aef_embeddings/README.md`. |
| `ecostress/france/<range>/cube.zarr` | Zarr v3 | Land-surface temperature (Kelvin), 70 m, EPSG:2154 — **`D_Chablis_Vineyard` AOI only**. Provided zipped — see note below. See `ecostress/README.md`. |
| `boundary-files/<aoi>_aoi.geojson` | GeoJSON | AOI footprints (one per site). |
| `useful-data/` | mixed | Per-AOI supplementary ground-truth/labels — see below. |
| `hackathon-demo.zip`, `example-scripts/`, `hackathon-demo/` | — | The bundled demo pack and example notebooks. |

Each product folder carries (or will carry) its own `README.md` with the full data
dictionary; this page is the index.

### Some products are provided as zip archives

`ecostress`, `sentinel1_mpc` and `sentinel2` are shared as zip files. Download, unzip, then
point your reader at the extracted files — the paths match the table above.

- `ecostress.zip` — the full ECOSTRESS product.
- `sentinel1_mpc.zip` / `sentinel2.zip` — the full Sentinel-1 (MPC) and Sentinel-2 products.

The two Sentinel archives are large. If downloading a whole archive is impractical, grab only
the AOI(s) you need instead: inside the `sentinel1_mpc/` and `sentinel2/` folders there is a
per-AOI zip for each challenge theme, named `<product>_<aoi>.zip`
(e.g. `sentinel2_D_Chablis_Vineyard.zip`). Each unzips to just that AOI's data.

## Areas of interest (AOIs)

The nine study sites. Use the same `<aoi>` id as the folder name in every product folder
(swap the `AOI` variable at the top of any example notebook to switch site).

| AOI ID | Location | Theme |
|--------|----------|-------|
| `A_koranga_forks_nz` | Koranga Forks, New Zealand | Native forest |
| `B_grinnell_iowa` | Grinnell, Iowa, USA | Row-crop agriculture |
| `C_aus_dingo_fence` | Dingo Fence, Australia | Rangeland boundary |
| `D_Chablis_Vineyard` | Chablis, France | Vineyards (the ECOSTRESS site) |
| `E_saudi_arabia_aquifer` | Saudi Arabia | Centre-pivot irrigation |
| `F1_coffee_leaf_rust_ethiopia` | Ethiopia | Coffee leaf rust |
| `F3_Germany_BarkBeetle` | Germany | Bark-beetle forest dieback |
| `F4_fall_armyworm_kenya` | Kenya | Fall armyworm |
| `G_sar_borneo` | Borneo | Tropical forest / SAR |
| `H_RIV06_region`| Konza Prairie Biological Station, Kansas, USA | (Biodiversity)

Notes on naming quirks:

- `boundary-files/` filenames differ slightly from the data-folder ids for a few sites
  (e.g. `F1_coffee_leaf_rust_detection_ethiopia_aoi.geojson`,
  `F4_fall_anrmyworm_kenya_aoi.geojson` — note the typo). Match by site, not exact string.

## `useful-data/` — ground-truth and labels

Per-AOI supplementary vector data to support modelling and validation, organised by site
(`A-koranga-forks-nz/`, `D-chablis-vineyard/`, `F-disease/`, `G-sar/`, …). For the disease
AOIs this includes field-survey points, for example:

- `F-disease/F1_CLR Survey Farm Level.geojson` — coffee leaf rust survey (farm level).
- `F-disease/F3_bark_bettle_locations.geojson` — bark-beetle locations.
- `F-disease/F4_FAW Occurrence Points FAO 2018-2020.geojson` — fall-armyworm occurrence (FAO).

Coverage varies by site — browse the folder to see what exists for the AOI you are working on.

## Caveats — read before analysis

These bite if ignored. The example notebooks already handle them; full detail is in
`data-sources-readme.md`.

- **Sentinel-2 is not baseline-harmonised.** There is an artificial **+1000 DN step at
  2022-01-25** (ESA Processing Baseline 04.00). Any multi-year analysis crossing that date
  is wrong unless you subtract 1000 (clamp at 0) from optical bands on/after it.
- **SAR units differ by source.** Sentinel-1 MPC cubes are **linear**; Sentinel-1 GEE and
  PALSAR GeoTIFFs are **dB**. Filter/average in linear, display in dB.
- **ECOSTRESS is sparse by design.** ~70% of timesteps are fully NaN. Filter empty
  timesteps, do not fill the NaNs.

## Accessing the dataset

Everything is shared via the hackathon Google Drive. The bundled demo pack
(`hackathon-demo.zip`) needs nothing else and is the recommended starting point.

To work with a full product, download it from the shared Google Drive, extract any zips
locally, and open the files directly:

```python
# Zarr cube (after downloading/extracting)
import xarray as xr
ds = xr.open_zarr("sentinel2/A_koranga_forks_nz/<range>/cube.zarr")

# COG
import rioxarray
da = rioxarray.open_rasterio(
    "esri_lulc/B_grinnell_iowa/annual/2025/lulc_B_grinnell_iowa_2025.tif")
```
