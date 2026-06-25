import type { Confidence, Factor } from "../types";

interface RegenScoreCardProps {
  score: number; // 0..100
  scoreLabel: string;
  factors: Factor[];
  confidence: Confidence;
}

/**
 * Regen Signal Score — the headline metric.
 * Big animated radial gauge + factor chips with weight bars.
 * Deliberately framed as "signal, not proof".
 */
export function RegenScoreCard({
  score,
  scoreLabel,
  factors,
  confidence,
}: RegenScoreCardProps) {
  const clamped = Math.max(0, Math.min(100, score));
  const R = 78;
  const C = 2 * Math.PI * R;
  const dash = (clamped / 100) * C;

  return (
    <div className="glass glass-hover p-6 sm:p-8">
      <div className="flex items-center justify-between">
        <div>
          <div className="eyebrow">Regen Signal Score</div>
          <p className="mt-1 text-sm text-slate-400">
            Composite of vegetation behaviour vs neighbouring controls
          </p>
        </div>
        <span className="chip border-amber-400/30 text-amber-400">
          Signal, not proof
        </span>
      </div>

      <div className="mt-6 grid gap-8 sm:grid-cols-[auto_1fr] sm:items-center">
        {/* radial gauge */}
        <div className="relative mx-auto h-48 w-48">
          <svg viewBox="0 0 200 200" className="h-full w-full -rotate-90">
            <defs>
              <linearGradient id="scoreGrad" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="#7dd3fc" />
                <stop offset="100%" stopColor="#22c55e" />
              </linearGradient>
            </defs>
            <circle
              cx="100"
              cy="100"
              r={R}
              fill="none"
              stroke="rgba(255,255,255,0.08)"
              strokeWidth="14"
            />
            <circle
              cx="100"
              cy="100"
              r={R}
              fill="none"
              stroke="url(#scoreGrad)"
              strokeWidth="14"
              strokeLinecap="round"
              strokeDasharray={`${dash} ${C}`}
              style={{ transition: "stroke-dasharray 1.2s cubic-bezier(0.22,1,0.36,1)" }}
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <div className="flex items-end gap-1">
              <span className="text-5xl font-extrabold tracking-tight text-white">
                {clamped}
              </span>
              <span className="mb-1.5 text-sm font-medium text-slate-500">/100</span>
            </div>
            <span className="mt-1 rounded-full bg-signal-500/15 px-3 py-0.5 text-xs font-semibold text-signal-400">
              {scoreLabel}
            </span>
          </div>
        </div>

        {/* factors */}
        <div className="space-y-3">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span className="eyebrow !tracking-widest">Contributing factors</span>
            <ConfidenceBadge confidence={confidence} />
          </div>
          {factors.map((f) => (
            <FactorRow key={f.id} factor={f} />
          ))}
        </div>
      </div>
    </div>
  );
}

function FactorRow({ factor }: { factor: Factor }) {
  const pct = Math.round(factor.weight * 100);
  return (
    <div
      className="group rounded-xl border border-white/5 bg-white/[0.02] p-3 transition-colors hover:border-white/15"
      title={factor.detail}
    >
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <CheckDot />
          <span className="text-sm font-medium text-slate-200">{factor.label}</span>
        </div>
        <span className="font-mono text-xs text-slate-500">{pct}%</span>
      </div>
      <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-white/5">
        <div
          className="h-full rounded-full bg-gradient-to-r from-radar-400 to-signal-500"
          style={{ width: `${pct}%` }}
        />
      </div>
      <p className="mt-2 text-xs leading-relaxed text-slate-400">{factor.detail}</p>
    </div>
  );
}

function ConfidenceBadge({ confidence }: { confidence: Confidence }) {
  return (
    <span
      className="chip"
      title={confidence.note}
    >
      <span className="h-1.5 w-1.5 rounded-full bg-amber-400" />
      Confidence: {confidence.level}
    </span>
  );
}

function CheckDot() {
  return (
    <span className="flex h-4 w-4 items-center justify-center rounded-full bg-signal-500/20">
      <svg width="10" height="10" viewBox="0 0 24 24" fill="none">
        <path d="M5 13l4 4L19 7" stroke="#4ade80" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </span>
  );
}
