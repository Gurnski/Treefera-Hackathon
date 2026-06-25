import { useMemo } from "react";
import {
  ComposedChart,
  Area,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import type { RogerFieldTimestamped, RogerFieldSummary } from "../types";

/**
 * Roger field NDVI chart.
 *
 * Shows time-series NDVI extracted from the Roger Farm field polygon.
 * Pair with RogerFieldMetadata and RogerFieldSummary for context.
 */
interface RogerFieldChartInnerProps {
  timeseries: RogerFieldTimestamped[];
  summary?: RogerFieldSummary;
}

export function RogerFieldChart({ timeseries, summary }: RogerFieldChartInnerProps) {
  const md = summary;
  const dataPast = useMemo(
    () => timeseries.map((d) => ({ time: d.time, ndvi: d.ndvi })),
    [timeseries],
  );

  const showChart = timeseries.length > 0;

  return (
    <div className="glass glass-hover relative overflow-hidden p-6 sm:p-8">
      <div className="flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <div className="eyebrow">Roger Target Field</div>
          <h3 className="mt-1 text-lg font-semibold text-white">
            Polygon-masked NDVI time-series
          </h3>
          <p className="mt-1 text-sm text-slate-400">
            Sentinel-2 NDVI captured from Roger's target field (~{md?.estimated_pixel_count ?? 3608} pixels).
          </p>
        </div>
        <span className="chip mt-2 sm:mt-0">
          <span className="h-1.5 w-1.5 rounded-full bg-signal-500" />
          Signal, not proof
        </span>
      </div>

      <div className="mt-6 h-[320px] w-full">
        {showChart ? (
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart data={dataPast} margin={{ top: 8, right: 8, bottom: 0, left: -10 }}>
              <defs>
                <linearGradient id="rogerFieldFill" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#22c55e" stopOpacity={0.35} />
                  <stop offset="100%" stopColor="#22c55e" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid stroke="rgba(255,255,255,0.06)" vertical={false} />
              <XAxis
                dataKey="time"
                tick={{ fill: "#64748b", fontSize: 11 }}
                tickFormatter={(d: string) => d.slice(0, 7)}
                interval={6}
                axisLine={{ stroke: "rgba(255,255,255,0.1)" }}
                tickLine={false}
              />
              <YAxis
                domain={[0.1, 0.9]}
                tick={{ fill: "#64748b", fontSize: 11 }}
                tickFormatter={(v: number) => v.toFixed(2)}
                axisLine={false}
                tickLine={false}
                width={40}
              />
              <Tooltip content={<RogerTooltip />} />
              <Area
                type="monotone"
                dataKey="ndvi"
                stroke="#22c55e"
                strokeWidth={2.5}
                fill="url(#rogerFieldFill)"
                name="Roger field"
                dot={false}
                activeDot={{ r: 4, fill: "#4ade80" }}
              />
            </ComposedChart>
          </ResponsiveContainer>
        ) : (
          <EmptyStateRogerField />
        )}
      </div>

      {/* metadata footer row */}
      <div className="mt-4 grid gap-3 border-t border-white/5 pt-4 text-xs text-slate-400 sm:grid-cols-3">
        <InfoPill label="Method" value={md?.scope ?? "Roger field"} />
        <InfoPill label="Pixels" value={`${md?.estimated_pixel_count ?? 3608?.toLocaleString()}`} />
        <InfoPill
          label="Note"
          value="NB: no neighbour controls applied yet"
          className="text-amber-400/70"
        />
      </div>

      <p className="mt-3 text-xs leading-relaxed text-slate-500">
        Roger's field-specific NDVI (polygon-masked, baseline-harmonised). Values are averages across
        Sentinel-2 pixels within the field boundary. NB: controls are still pending.
        This is signal — not confirmation of regenerative practices.
      </p>
    </div>
  );
}

function RogerTooltip({
  active,
  payload,
}: {
  active?: boolean;
  payload?: Array<{ payload: { ndvi: number | null; time: string } }>;
}) {
  if (!active || !payload?.length) return null;

  const ndvi = payload[0].payload.ndvi;
  const timeStr = payload[0].payload.time ?? "";
  return (
    <div className="rounded-xl border border-white/10 bg-ink-900/95 px-3 py-2 text-xs shadow-glow backdrop-blur">
      <div className="mb-1 font-mono text-slate-400">{timeStr.slice(0, 7)}</div>
      {ndvi !== null ? (
        <div className="flex items-center gap-2">
          <span className="h-2 w-2 rounded-full bg-signal-500" />
          <span className="text-slate-300">NDVI</span>
          <span className="ml-auto font-mono text-slate-200">{ndvi.toFixed(3)}</span>
        </div>
      ) : (
        <div className="text-amber-400">No data</div>
      )}
    </div>
  );
}

function EmptyStateRogerField() {
  return (
    <div className="flex h-full flex-col items-center justify-center rounded-2xl border border-dashed border-white/10">
      <p className="text-sm text-slate-400">Roger field NDVI unavailable</p>
      <p className="mt-1 text-xs text-slate-600">Drop roger_field_ndvi_timeseries.json into /public/demo-data/ to update the chart.</p>
    </div>
  );
}

function InfoPill({ label, value, className = "" }: { label: string; value: string; className?: string }) {
  return (
    <div className="rounded-lg border border-white/10 bg-white/[0.02] px-3 py-1.5 text-xs leading-tight">
      <span className="mr-1 text-xs text-slate-500">{label}:</span>{" "}
      <span className={className}>{value}</span>
    </div>
  );
}
