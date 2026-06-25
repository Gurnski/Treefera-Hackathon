/**
 * Data contract for Regen Radar.
 *
 * These types mirror the static files in /public/demo-data exactly.
 * Tomorrow, a Python/Jupyter notebook can export real outputs to the same
 * paths with the same shape — no component changes required.
 *
 *   - manifest.json -> Manifest (all file paths in here)
 *   - ndvi_timeseries.json -> NdviPoint[]
 *   - roger_field_ndvi_timeseries.json -> RogerFieldTimestamped[]
 *
 * Keep these in sync with the JSON. If you add a field to the notebook export,
 * add it here first so the UI stays type-safe.
 */

export interface Coordinates {
  lat: number;
  lng: number;
}

export interface DateRange {
  start: string; // ISO date
  end: string; // ISO date
}

export type FactorDirection = "positive" | "negative" | "neutral";

export interface Factor {
  id: string;
  label: string;
  detail: string;
  /** 0..1 relative contribution to the score; used for the mini bar. */
  weight: number;
  direction: FactorDirection;
}

export interface Confidence {
  level: string; // e.g. "Moderate-low"
  value: number; // 0..1
  note: string;
}

export interface AdoptionPeriod {
  label: string;
  start: string; // ISO date
  end: string; // ISO date
}

export interface AiInsight {
  headline: string;
  body: string;
  model: string;
  disclaimer: string;
}

export interface EvidenceImage {
  src: string;
  label: string;
  date: string;
  caption: string;
}

export interface Manifest {
  schemaVersion: string;
  generatedAt: string;
  dataSource: string; // e.g. "treefera_local_exports"
  sourceModel?: string; // optional: which notebook / script produced this

  projectName: string;
  challengeName: string;
  tagline: string;

  siteName: string;
  country: string;
  coordinates: Coordinates;
  areaHectares: number;
  dateRange: DateRange;
  satellite: string;
  controlFieldCount: number;

  score: number; // 0..100
  scoreLabel: string;
  confidence: Confidence;

  adoptionPeriod: AdoptionPeriod;
  factors: Factor[];

  aiInsight: AiInsight;
  limitations: string[];
  nextSteps: string[];

  images: {
    before: EvidenceImage;
    after: EvidenceImage;
  };

  /** Internal paths — ignored by UI components, but referenced in the tool. */
  timeseriesPath: string;
  rogerFieldTimeseriesPath: string;
  rogerFieldSummaryPath: string;
  rogerFieldMetadataPath: string;
}

export type NdviPhase = "baseline" | "adoption" | "post";

export interface NdviPoint {
  date: string; // "YYYY-MM"
  target: number; // 0..1 NDVI
  control: number; // 0..1 NDVI (control-field average)
  delta: number; // target - control
  phase: NdviPhase;
  adoption: boolean; // true within the suspected adoption window
}

/** Everything the app needs, loaded once at startup. */
export interface DemoData {
  manifest: Manifest;
  timeseries: NdviPoint[];
  /** Roger target-field NDVI time-series (time / NDVI / scope). */
  rogerFieldTimeseries?: RogerFieldTimestamped[];
  /** Roger target-field NDVI summary (pre-adoption / cover-crop / no-till periods). */
  rogerFieldSummary?: RogerFieldSummary;
  /** Roger target-field metadata (polygon, CRS, pixel count, coords). */
  rogerFieldMetadata?: RogerFieldMetadata;
}

export interface RogerFieldTimestamped {
  time: string; // YYYY-MM-DD
  ndvi: number | null;
  scope: string;
  method: string;
  note: string;
}

export interface RogerFieldSummary {
  method: string;
  scope: string;
  warning: string;
  estimated_pixel_count: number;
  periods: {
    pre_adoption_2017_2020: { mean_ndvi: number; median_ndvi: number; max_ndvi: number; observations: number };
    cover_crop_period_2021_2022: { mean_ndvi: number; median_ndvi: number; max_ndvi: number; observations: number };
    no_till_period_2023_2025: { mean_ndvi: number; median_ndvi: number; max_ndvi: number; observations: number };
  };
}

export interface RogerFieldMetadata {
  name: string;
  geometry_type: string;
  source_crs: string; // e.g. "EPSG:4326"
  analysis_crs: string; // e.g. "EPSG:32615"
  coordinates_lonlat: [number, number][];
  coordinates_utm15n: [number, number][];
  estimated_pixel_count: number;
  note: string;
}
