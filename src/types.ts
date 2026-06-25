/**
 * Data contract for Regen Radar.
 *
 * These types mirror the static files in /public/demo-data exactly.
 * Tomorrow, a Python/Jupyter notebook can export real outputs to the same
 * paths with the same shape — no component changes required.
 *
 *   - manifest.json          -> Manifest
 *   - ndvi_timeseries.json   -> NdviPoint[]
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
  level: string; // e.g. "Moderate"
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
  /** "simulated" today; "notebook" once real exports land. */
  dataSource: string;

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

  timeseriesPath: string;
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
}
