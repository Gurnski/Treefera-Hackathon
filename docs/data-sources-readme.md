# Satellite data sources

Concise reference for the seven Earth-observation products staged for the hackathon: what each one measures, where it comes from, and the gotchas that bite. For formats, S3 layout, and AOIs see [`README.md`](README.md); for run instructions and the harmonisation fix see the notebooks.

> ## ⚠️ Sentinel-2 users — read this first
>
> The Sentinel-2 cubes are **not baseline-harmonised**. There is an artificial **+1000 DN
> step at 2022-01-25** (ESA Processing Baseline 04.00, `BOA_ADD_OFFSET = -1000`), because Microsoft Planetary Computer does not expose the offset metadata and it was never applied at build time. Any multi-year analysis crossing that date (NDVI, change detection, model training) **will be wrong unless you harmonise first** — subtract 1000 (clamp at 0) from the optical bands of scenes on/after 2022-01-25. `01_sentinel2_optical.ipynb` shows the step and the fix.

## Sentinel-2 (S2) — optical reflectance

Multispectral optical imagery from the ESA Copernicus Sentinel-2 mission (twin satellites, ~5-day revisit). Surface reflectance across visible, red-edge, near-infrared and SWIR bands (B02–B12), the workhorse for vegetation indices (NDVI), land cover and change detection.

- **Provider**: ESA Copernicus, via Microsoft Planetary Computer (L2A surface reflectance).
- **What we staged**: monthly-median Zarr cube, bands B02–B12 + `n_obs`, uint16, 10 m.
- **Watch out**:
  - **Not baseline-harmonised.** An artificial **+1000 DN step at 2022-01-25** (ESA
    Processing Baseline 04.00, `BOA_ADD_OFFSET = -1000`) was never applied. Any analysis crossing that date is wrong unless you subtract 1000 (clamp at 0) from optical bands on/after it. `01_sentinel2_optical.ipynb` shows the step and the fix.
  - `n_obs == 0` means no clear observation that month — treat as nodata.

## Sentinel-1 (S1) — SAR backscatter

C-band synthetic-aperture radar from ESA Copernicus Sentinel-1. Radar penetrates cloud and works day or night, measuring surface roughness/structure and moisture via VV and VH backscatter — complementary to optical, essential in persistently cloudy regions.

- **Provider**: ESA Copernicus. Staged from two routes:
  - **MPC** (Microsoft Planetary Computer): monthly-median VV/VH **linear** backscatter + `n_obs`, Zarr, 10 m.
  - **GEE** (Google Earth Engine): annual VV/VH in **dB**, COG, 2017–2025.
- **Watch out**:
  - **MPC cubes are linear; GEE GeoTIFFs are dB.** Filter/despeckle in linear, convert to dB gionly for display. `03_sentinel1_sar_despeckle.ipynb` applies an adaptive Lee filter.
  - SAR is inherently speckly — despeckle before quantitative use.
  - `n_obs == 0` means no observation that month.

## PALSAR — L-band SAR backscatter

L-band synthetic-aperture radar from JAXA's ALOS/ALOS-2 PALSAR yearly mosaic. L-band's longer wavelength (~24 cm) penetrates further into vegetation canopy than Sentinel-1's C-band, so it responds to woody biomass and forest structure — a complementary SAR view, useful for forest and land-cover work.

- **Provider**: JAXA (`JAXA/ALOS/PALSAR/YEARLY/SAR_EPOCH`), via Google Earth Engine.
- **What we staged**: annual HH/HV gamma0 in **dB**, COG, 25 m, EPSG:4326, years 2017–2024 — currently the `G_sar_borneo` AOI only. See [`../palsar_README.md`](../palsar_README.md).
- **Watch out**:
  - **dB like Sentinel-1 GEE** (not linear like Sentinel-1 MPC) — convert to linear power before quantitative filtering, back to dB for display.
  - **Coarser 25 m grid** than the 10 m S1/S2 products — resample deliberately when combining sensors.
  - The source mosaic has a **data gap 2011–2014** (only 2007–2010 and 2015–2024 exist); SAR is speckly, so despeckle before quantitative use.

## AEF — AlphaEarth Foundations embeddings

Learned 64-dimensional embeddings from Google DeepMind's AlphaEarth Foundations model, which
fuses many sensors and time into a single per-pixel feature vector. Each band is an abstract
learned feature, not a physical measurement — use them as ready-made inputs for clustering,
similarity search or downstream ML, no manual feature engineering required.

- **Provider**: Google DeepMind / Google Earth Engine.
- **What we staged**: 64-band float32 COG, ~10 m, native UTM, annual.
- **Watch out**: bands have no physical units. Visualise via dimensionality reduction —
  `04_aef_embeddings_and_ecostress.ipynb` shows the 64 bands as a PCA false-colour composite.

## ESRI LULC — land use / land cover

Annual global land-cover classification from Esri / Impact Observatory, derived from Sentinel-2 with a deep-learning model. A single categorical class per pixel (water, trees, crops, built area, etc.) — useful for masking, stratification and tracking land-cover change year on year.

- **Provider**: Esri / Impact Observatory (Sentinel-2-derived).
- **What we staged**: categorical uint8 COG, 10 m, EPSG:4326, annual.
- **Watch out**: values are class codes, not quantities. The legend/palette is in
  `esri_lulc_classes.json`. `02_lulc_and_hansen.ipynb` maps it with a labelled legend.

## Hansen — global forest change

The Hansen/UMD Global Forest Change dataset: annual tree-cover loss derived from the full Landsat archive. The `lossyear` layer encodes the year each pixel was first detected as deforested — the standard reference for forest loss timing and area.

- **Provider**: Hansen et al. / University of Maryland (Landsat-derived).
- **What we staged**: `lossyear` COG, uint8, 30 m (`0` = no loss, `1`–`24` → year `2000+n`).
- **Watch out**: 30 m grid (coarser than S1/S2). It is loss *year*, not a loss *fraction*.
  `02_lulc_and_hansen.ipynb` maps loss year and tallies area lost per year.

## ECOSTRESS — land-surface temperature

NASA ECOSTRESS thermal infrared measurements of land-surface temperature (LST) from an instrument on the International Space Station. Captures plant heat/water stress and evapotranspiration signals — but the ISS orbit means irregular, opportunistic overpasses.

- **Provider**: NASA (`ECO_L2T_LSTE.002`), via the AppEEARS API.
- **What we staged**: LST (Kelvin) + `LST_err`, `cloud`, `QC`, Zarr, 70 m, EPSG:2154 —
  **`D_Chablis_Vineyard` AOI only**. See [`../ecostress_README.md`](../ecostress_README.md).
- **Watch out**: **sparse and gappy by design.** Irregular cadence; ~70% of timesteps are
  fully NaN (granule missed the AOI or was cloudy). NaN means no valid retrieval — *filter*
  empty timesteps, do not *fill* them. Screen with `cloud == 0` and the `QC` bits.

## Cheat sheet

| Source | Measures | Provider | Format | Res. |
|---|---|---|---|---|
| Sentinel-2 | Optical reflectance (NDVI, etc.) | ESA / Planetary Computer | Zarr (monthly) | 10 m |
| Sentinel-1 | SAR backscatter (cloud-free) | ESA / MPC + GEE | Zarr (linear) / COG (dB) | 10 m |
| PALSAR | L-band SAR (canopy/biomass) | JAXA / GEE | COG (annual, dB) | 25 m |
| AEF | Learned 64-D feature embeddings | Google DeepMind / GEE | COG (annual) | ~10 m |
| ESRI LULC | Land-cover class | Esri / Impact Observatory | COG (annual) | 10 m |
| Hansen | Forest-loss year | Hansen / UMD | COG | 30 m |
| ECOSTRESS | Land-surface temperature | NASA / AppEEARS | Zarr | 70 m |
</content>
</invoke>
