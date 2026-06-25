import type { DemoData, Manifest, NdviPoint } from "../types";

/**
 * Loads the static demo data from /public/demo-data.
 *
 * No backend, no live API. These are plain fetches of static JSON served by
 * Vite. To swap in real data tomorrow, just overwrite the JSON files in
 * public/demo-data/ with notebook exports that match src/types.ts.
 *
 * The loader is defensive: if the timeseries is missing it still returns the
 * manifest so the dashboard renders (charts degrade gracefully).
 */

const BASE = import.meta.env.BASE_URL ?? "/";

function url(path: string): string {
  // Respect Vite base path; strip any leading slash to join cleanly.
  return `${BASE}${path.replace(/^\//, "")}`;
}

async function fetchJson<T>(path: string): Promise<T> {
  const res = await fetch(url(path), { cache: "no-cache" });
  if (!res.ok) {
    throw new Error(`Failed to load ${path}: ${res.status} ${res.statusText}`);
  }
  return (await res.json()) as T;
}

export async function loadDemoData(): Promise<DemoData> {
  const manifest = await fetchJson<Manifest>("demo-data/manifest.json");

  // Timeseries path comes from the manifest so the contract stays in one place.
  let timeseries: NdviPoint[] = [];
  try {
    timeseries = await fetchJson<NdviPoint[]>(
      manifest.timeseriesPath ?? "demo-data/ndvi_timeseries.json"
    );
  } catch (err) {
    // Non-fatal: the chart component shows an empty-state instead of crashing.
    console.warn("[Regen Radar] timeseries unavailable, continuing:", err);
  }

  return { manifest, timeseries };
}
