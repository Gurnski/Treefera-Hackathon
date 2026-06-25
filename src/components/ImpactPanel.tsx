interface ImpactPanelProps {
  nextSteps: string[];
  siteName: string;
}

/**
 * Impact / next validation. Frames the tool's value: triage — deciding which
 * fields deserve scarce ground-truth investigation — and lays out the concrete
 * validation path (management records, labelled data, ground truth).
 */
export function ImpactPanel({ nextSteps, siteName }: ImpactPanelProps) {
  return (
    <div className="glass glass-hover relative overflow-hidden p-6 sm:p-8">
      <div className="pointer-events-none absolute -left-20 bottom-0 h-48 w-48 rounded-full bg-signal-500/10 blur-3xl" />

      <div className="eyebrow">Impact &amp; Next Validation</div>
      <h3 className="mt-2 text-lg font-semibold text-white">
        Triage scarce verification toward the strongest signals
      </h3>
      <p className="mt-2 max-w-2xl text-[15px] leading-relaxed text-slate-300">
        Ground-truthing every field is expensive. A signal score lets teams rank
        candidates and spend field visits where the satellite evidence is
        strongest. <span className="text-radar-300">{siteName}</span> scoring
        medium-high makes it a priority candidate — not a confirmed case.
      </p>

      <ol className="mt-6 space-y-3">
        {nextSteps.map((step, i) => (
          <li key={i} className="flex items-start gap-3">
            <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-radar-400/30 bg-radar-500/10 font-mono text-xs text-radar-300">
              {i + 1}
            </span>
            <span className="pt-0.5 text-sm leading-relaxed text-slate-300">
              {step}
            </span>
          </li>
        ))}
      </ol>

      <div className="mt-6 flex flex-wrap gap-2">
        <span className="chip border-signal-500/30 text-signal-400">
          Management records
        </span>
        <span className="chip border-signal-500/30 text-signal-400">
          Labelled training data
        </span>
        <span className="chip border-signal-500/30 text-signal-400">
          On-the-ground verification
        </span>
      </div>
    </div>
  );
}
