import type { AiInsight } from "../types";

interface AiInsightCardProps {
  insight: AiInsight;
}

/**
 * AI Insight card.
 *
 * NO live model calls. The narrative is prewritten in manifest.json
 * (manifest.aiInsight). This keeps the demo deterministic and offline; a real
 * build could swap manifest.aiInsight for an LLM-generated summary of the same
 * metrics. The disclaimer keeps it honest: signal, not proof.
 */
export function AiInsightCard({ insight }: AiInsightCardProps) {
  return (
    <div className="glass glass-hover relative overflow-hidden p-6 sm:p-8">
      {/* soft brand glow */}
      <div className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full bg-radar-500/10 blur-3xl" />

      <div className="flex items-center gap-2">
        <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-to-br from-radar-400 to-signal-500">
          <SparkIcon />
        </span>
        <div className="eyebrow">AI Insight</div>
        <span className="ml-auto chip text-[10px]">{insight.model}</span>
      </div>

      <h3 className="mt-4 text-lg font-semibold text-white">{insight.headline}</h3>
      <p className="mt-2 text-[15px] leading-relaxed text-slate-300">
        {insight.body}
      </p>

      <div className="mt-5 flex items-start gap-2 rounded-xl border border-amber-400/20 bg-amber-400/[0.06] px-3 py-2.5">
        <InfoIcon />
        <p className="text-xs leading-relaxed text-amber-200/90">
          {insight.disclaimer}
        </p>
      </div>
    </div>
  );
}

function SparkIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
      <path
        d="M12 3l1.8 4.8L18.6 9.6 13.8 11.4 12 16.2 10.2 11.4 5.4 9.6 10.2 7.8 12 3z"
        fill="#04111c"
      />
    </svg>
  );
}

function InfoIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" className="mt-0.5 shrink-0 text-amber-400">
      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.6" />
      <path d="M12 11v5M12 8h.01" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}
