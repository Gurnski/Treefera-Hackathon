import type { Confidence } from "../types";

interface LimitationsCardProps {
  confidence: Confidence;
  limitations: string[];
}

/**
 * Confidence + limitations. This is the scientific-honesty section: it states
 * the confidence level and enumerates what could confound the signal.
 */
export function LimitationsCard({ confidence, limitations }: LimitationsCardProps) {
  const pct = Math.round(confidence.value * 100);

  return (
    <div className="glass glass-hover p-6 sm:p-8">
      <div className="eyebrow">Confidence &amp; Limitations</div>

      {/* confidence meter */}
      <div className="mt-4 flex items-center justify-between">
        <span className="text-sm text-slate-400">Overall confidence</span>
        <span className="text-sm font-semibold text-amber-400">
          {confidence.level} · {pct}%
        </span>
      </div>
      <div className="mt-2 h-2 overflow-hidden rounded-full bg-white/5">
        <div
          className="h-full rounded-full bg-gradient-to-r from-amber-400 to-signal-500"
          style={{ width: `${pct}%` }}
        />
      </div>
      <p className="mt-2 text-xs leading-relaxed text-slate-500">{confidence.note}</p>

      {/* limitations list */}
      <ul className="mt-5 space-y-2.5">
        {limitations.map((item, i) => (
          <li key={i} className="flex items-start gap-2.5 text-sm text-slate-300">
            <CautionDot />
            <span className="leading-relaxed">{item}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

function CautionDot() {
  return (
    <span className="mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-amber-400/15">
      <svg width="10" height="10" viewBox="0 0 24 24" fill="none">
        <path d="M12 3l9 16H3L12 3z" stroke="#fbbf24" strokeWidth="2" strokeLinejoin="round" />
        <path d="M12 10v4M12 17h.01" stroke="#fbbf24" strokeWidth="2" strokeLinecap="round" />
      </svg>
    </span>
  );
}
