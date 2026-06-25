import type {
  DemoData,
  Manifest,
  NdviPoint,
  RogerFieldTimestamped,
  RogerFieldSummary,
  RogerFieldMetadata,
} from "../types";

/**
 * Loads the static demo data from /public/demo-data.
 *
 * No backend, no live API. These are plain fetches of static JSON served by
 * Vite. To swap in real data tomorrow, just overwrite the JSON files in
 * public/demo-data/ with notebook exports that match src/types.ts.
 *
 * The loader is defensive: if any field is loaded.
 */

const BASE = import.meta.env.BASE_URL ?? "/";

function url(path: string): string {
  return `${BASE}${path.replace(/^\//, "")}`;
}

async function fetchJson<T>(path: string): Promise<T | null> {
  try {
    const res = await fetch(url(path), { cache: "no-cache" });
    if (!res.ok) return null;
    return (await res.json()) as T;
  } catch {
    return null;
  }
}

export async function loadDemoData(): Promise<DemoData> {
  const manifest = await fetchJson<Manifest>("demo-data/manifest.json");
  if (!manifest) throw new Error(`Failed to load manifest.json`);

  // AOI-level NDVI time-series (target vs control channel).
  let timeseries: NdviPoint[] = [];
  try {
    const data = await fetchJson<NdviPoint[]>(
      manifest.timeseriesPath ?? "demo-data/ndvi_timeseries.json"
    );
    if (data) timeseries = data;
  } catch (err) {
    console.warn("[Regen Radar] AOI timeseries:", err);
  }

  // Roger target-field NDVI time-series (polygon-masked).
  let rogerFieldTimeseries: RogerFieldTimestamped[] = [];
  try {
    const data = await fetchJson<RogerFieldTimestamped[]>(
      manifest.rogerFieldTimeseriesPath ?? "demo-data/roger_field_ndvi_timeseries.json"
    );
    if (data) rogerFieldTimeseries = data;
  } catch (err) {
    console.warn("[Regen Radar] Roger timeseries:", err);
  }

  // Roger target-field NDVI summary.
  let rogerFieldSummary: RogerFieldSummary | undefined;
  try {
    const data = await fetchJson<RogerFieldSummary>(
      manifest.rogerFieldSummaryPath ?? "demo-data/roger_field_ndvi_summary.json"
    );
    if (data) rogerFieldSummary = data;
  } catch (err) {
    console.warn("[Regen Radar] Roger summary:", err);
  }

  // Roger target-field metadata.
  let rogerFieldMetadata: RogerFieldMetadata | undefined;
  try {
    const data = await fetchJson<RogerFieldMetadata>(
      manifest.rogerFieldMetadataPath ?? "demo-data/roger_field_metadata.json"
    );
    if (data) rogerFieldMetadata = data;
  } catch (err) {
    console.warn("[Regen Radar] Roger metadata:", err);
  }

  return {
    manifest,
    timeseries,
    rogerFieldTimeseries: rogerFieldTimeseries.length > 0 ? rogerFieldTimeseries : undefined,
    rogerFieldSummary,
    rogerFieldMetadata,
  };
}
