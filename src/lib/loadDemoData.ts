import type {
  DemoData,
  Manifest,
  NdviPoint,
  RogerFieldTimestamped,
  RogerFieldSummary,
  RogerFieldMetadata,
  RogerVsAoiPoint,
  NdviLongPoint,
  FieldControlMetadata,
  CleanVsControlPoint,
  CleanVsControlSummary,
} from "../types";

/**
 * Loads the static demo data from /public/demo-data.
 *
 * No backend, no live API. These are plain fetches of static JSON served by
 * Vite. To swap in real data tomorrow, just overwrite the JSON files in
 * public/demo-data/ with notebook exports that match src/types.ts.
 *
 * The loader is defensive: if any file is missing it degrades gracefully.
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

  // AOI-level NDVI time-series.
  let timeseries: NdviPoint[] = [];
  try {
    const data = await fetchJson<NdviPoint[]>(
      manifest.timeseriesPath ?? "demo-data/ndvi_timeseries.json"
    );
    if (data) timeseries = data;
  } catch (err) {
    console.warn("[Regen Radar] AOI NDVI timeseries:", err);
  }
  // Roger target-field NDVI time-series.
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

  // Roger vs AOI NDVI.
  let rogerVsAoiTimeseries: RogerVsAoiPoint[] = [];
  try {
    const data = await fetchJson<RogerVsAoiPoint[]>(
      manifest.rogerVsAoiTimeseriesPath ?? "demo-data/roger_vs_aoi_ndvi_timeseries.json"
    );
    if (data) rogerVsAoiTimeseries = data;
  } catch (err) {
    console.warn("[Regen Radar] Roger vs AOI timeseries:", err);
  }

  // Aggregated control field NDVI.
  let fieldControlNdviLong: NdviLongPoint[] = [];
  try {
    const data = await fetchJson<NdviLongPoint[]>(
      manifest.fieldControlLongPath ?? "demo-data/field_control_ndvi_long.json"
    );
    if (data) fieldControlNdviLong = data;
  } catch (err) {
    console.warn("[Regen Radar] Field control NDVI long:", err);
  }

  // Control field metadata.
  let fieldControlMetadata: FieldControlMetadata[] = [];
  try {
    const data = await fetchJson<FieldControlMetadata[]>(
      manifest.fieldControlMetadataPath
    );
    if (data) fieldControlMetadata = data;
  } catch (err) {
    console.warn("[Regen Radar] Field control metadata:", err);
  }

  // Roger clean vs controls NDVI.
  let rogerCleanVsControlsTimeseries: CleanVsControlPoint[] = [];
  let rogerCleanVsControlsSummary: CleanVsControlSummary | undefined;
  if (manifest.rogerCleanVsControlsTimeseriesPath) {
    try {
      const data = await fetchJson<CleanVsControlPoint[]>(
        manifest.rogerCleanVsControlsTimeseriesPath
      );
      if (data) rogerCleanVsControlsTimeseries = data;
    } catch (err) {
      console.warn("[Regen Radar] Roger clean vs controls timeseries:", err);
    }
  }
  if (manifest.rogerCleanVsControlsSummaryPath) {
    try {
      const data = await fetchJson<CleanVsControlSummary>(
        manifest.rogerCleanVsControlsSummaryPath
      );
      if (data) rogerCleanVsControlsSummary = data;
    } catch (err) {
      console.warn("[Regen Radar] Roger clean vs controls summary:", err);
    }
  }

  return {
    manifest,
    timeseries,
    rogerFieldTimeseries: rogerFieldTimeseries.length > 0 ? rogerFieldTimeseries : undefined,
    rogerFieldSummary,
    rogerFieldMetadata,
    rogerVsAoiTimeseries: rogerVsAoiTimeseries.length > 0 ? rogerVsAoiTimeseries : undefined,
    fieldControlNdviLong: fieldControlNdviLong.length > 0 ? fieldControlNdviLong : undefined,
    fieldControlMetadata: fieldControlMetadata.length > 0 ? fieldControlMetadata : undefined,
    rogerCleanVsControlsTimeseries: rogerCleanVsControlsTimeseries.length > 0
      ? rogerCleanVsControlsTimeseries
      : undefined,
    rogerCleanVsControlsSummary,
  };
}
