import {
  Area,
  CartesianGrid,
  ComposedChart,
  Line,
  ReferenceArea,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import type { AdoptionPeriod, NdviPoint } from "../types";

interface TargetVsControlChartProps {
  data: NdviPoint[];
  adoptionPeriod: AdoptionPeriod;
}

/**
 * Target field NDVI vs control-field average over time, with the suspected
 * adoption window highlighted. Reads ndvi_timeseries.json (passed in as `data`).
 *
 * Degrades gracefully: if `data` is empty (file missing), shows an empty state
 * instead of a broken chart.
 */
export function TargetVsControlChart({
  data,
  adoptionPeriod,
}: TargetVsControlChartProps) {
  const hasData = data.length > 0;

  // Map the manifest's YYYY-MM-DD adoption window onto the YYYY-MM series keys.
  const adoptStart = adoptionPeriod.start.slice(0, 7);
  const adoptEnd = adoptionPeriod.end.slice(0, 7);

  return (
    <div className="glass glass-hover p-6 sm:p-8">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <div className="eyebrow">AOI-level NDVI · Support</div>
          <h3 className="mt-1 text-lg font-semibold text-white">
            Baseline-harmonised NDVI across the full AOI
          </h3>
        </div>
        <Legend2 />
      </div>

      <div className="mt-6 h-[320px] w-full">
        {hasData ? (
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart data={data} margin={{ top: 8, right: 8, bottom: 0, left: -12 }}>
              <defs>
                <linearGradient id="targetFill" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#22c55e" stopOpacity={0.35} />
                  <stop offset="100%" stopColor="#22c55e" stopOpacity={0} />
                </linearGradient>
              </defs>

              <CartesianGrid stroke="rgba(255,255,255,0.06)" vertical={false} />
              <XAxis
                dataKey="date"
                tick={{ fill: "#64748b", fontSize: 11 }}
                tickFormatter={(d: string) => d.slice(2)} // YY-MM
                interval={3}
                axisLine={{ stroke: "rgba(255,255,255,0.1)" }}
                tickLine={false}
              />
              <YAxis
                domain={[0.2, 0.8]}
                tick={{ fill: "#64748b", fontSize: 11 }}
                tickFormatter={(v: number) => v.toFixed(1)}
                axisLine={false}
                tickLine={false}
                width={40}
              />

              {/* suspected adoption window */}
              <ReferenceArea
                x1={adoptStart}
                x2={adoptEnd}
                fill="#38bdf8"
                fillOpacity={0.08}
                stroke="#38bdf8"
                strokeOpacity={0.25}
                strokeDasharray="4 4"
                label={{
                  value: "Suspected adoption",
                  position: "insideTop",
                  fill: "#7dd3fc",
                  fontSize: 11,
                }}
              />

              <Tooltip content={<RadarTooltip />} />

              <Area
                type="monotone"
                dataKey="target"
                stroke="#22c55e"
                strokeWidth={2.5}
                fill="url(#targetFill)"
                name="Target field"
                dot={false}
                activeDot={{ r: 4, fill: "#4ade80" }}
              />
              <Line
                type="monotone"
                dataKey="control"
                stroke="#7dd3fc"
                strokeWidth={2}
                strokeDasharray="5 4"
                dot={false}
                name="Control average"
                activeDot={{ r: 4, fill: "#7dd3fc" }}
              />
            </ComposedChart>
          </ResponsiveContainer>
        ) : (
          <EmptyState />
        )}
      </div>

      <p className="mt-4 text-xs leading-relaxed text-slate-500">
        Support file: AOI-level NDVI before/after the switch to no-till. For full
        target-vs-control verification, real neighbour polygons are needed.
      </p>
    </div>
  );
}

function Legend2() {
  return (
    <div className="flex items-center gap-4 text-xs text-slate-400">
      <span className="flex items-center gap-1.5">
        <span className="h-2.5 w-2.5 rounded-full bg-signal-500" /> Roger target field
      </span>
      <span className="flex items-center gap-1.5">
        <span className="h-0.5 w-4 rounded-full bg-radar-300" /> AOI aggregate
      </span>
    </div>
  );
}

interface TooltipProps {
  active?: boolean;
  payload?: Array<{ payload: NdviPoint }>;
  label?: string;
}

function RadarTooltip({ active, payload, label }: TooltipProps) {
  if (!active || !payload?.length) return null;
  const p = payload[0].payload;
  return (
    <div className="rounded-xl border border-white/10 bg-ink-900/95 px-3 py-2 text-xs shadow-glow backdrop-blur">
      <div className="mb-1 font-mono text-slate-400">{label}</div>
      <Row color="#4ade80" name="Target" value={p.target} />
      <Row color="#7dd3fc" name="Control" value={p.control} />
      <div className="mt-1 border-t border-white/10 pt-1">
        <span className="text-slate-400">Δ </span>
        <span className={p.delta >= 0 ? "text-signal-400" : "text-amber-400"}>
          {p.delta >= 0 ? "+" : ""}
          {p.delta.toFixed(3)}
        </span>
        {p.adoption && (
          <span className="ml-2 rounded bg-radar-500/20 px-1.5 py-0.5 text-radar-300">
            adoption
          </span>
        )}
      </div>
    </div>
  );
}

function Row({ color, name, value }: { color: string; name: string; value: number }) {
  return (
    <div className="flex items-center gap-2">
      <span className="h-2 w-2 rounded-full" style={{ background: color }} />
      <span className="text-slate-300">{name}</span>
      <span className="ml-auto font-mono text-slate-200">{value.toFixed(3)}</span>
    </div>
  );
}

function EmptyState() {
  return (
    <div className="flex h-full flex-col items-center justify-center rounded-xl border border-dashed border-white/10 text-center">
      <p className="text-sm text-slate-400">NDVI time-series unavailable</p>
      <p className="mt-1 text-xs text-slate-600">
        Drop a valid ndvi_timeseries.json into /public/demo-data to populate this chart.
      </p>
    </div>
  );
}
