import { useState } from "react";
import type { EvidenceImage } from "../types";

interface EvidencePanelProps {
  before: EvidenceImage;
  after: EvidenceImage;
}

/**
 * Before/after satellite evidence.
 *
 * Robust to missing images: if a PNG fails to load, we swap in a stylised
 * generated placeholder (CSS) instead of a broken-image icon, and keep the
 * caption that explains real notebook exports can replace these.
 */
export function EvidencePanel({ before, after }: EvidencePanelProps) {
  return (
    <div className="glass glass-hover p-6 sm:p-8">
      <div className="flex items-center justify-between">
        <div>
          <div className="eyebrow">Before / After Evidence</div>
          <h3 className="mt-1 text-lg font-semibold text-white">
            Dry-season composites around the adoption window
          </h3>
        </div>
        <span className="chip">Sentinel-2 · simulated</span>
      </div>

      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        <EvidenceTile image={before} tone="before" />
        <EvidenceTile image={after} tone="after" />
      </div>

      <p className="mt-4 text-xs leading-relaxed text-slate-500">
        Placeholder composites for the demo. Replace{" "}
        <code className="rounded bg-white/5 px-1 text-radar-300">
          /demo-data/before.png
        </code>{" "}
        and{" "}
        <code className="rounded bg-white/5 px-1 text-radar-300">
          /demo-data/after.png
        </code>{" "}
        with real notebook-exported satellite scenes — captions and dates come
        from manifest.json.
      </p>
    </div>
  );
}

function EvidenceTile({
  image,
  tone,
}: {
  image: EvidenceImage;
  tone: "before" | "after";
}) {
  const [failed, setFailed] = useState(false);

  return (
    <figure className="group overflow-hidden rounded-xl border border-white/10 bg-ink-800">
      <div className="relative aspect-[4/3] w-full overflow-hidden">
        {!failed ? (
          <img
            src={image.src}
            alt={image.label}
            loading="lazy"
            onError={() => setFailed(true)}
            className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
          />
        ) : (
          <GeneratedPlaceholder tone={tone} />
        )}

        {/* label + date overlay */}
        <div className="absolute inset-x-0 top-0 flex items-center justify-between bg-gradient-to-b from-ink-950/80 to-transparent px-3 py-2">
          <span className="text-xs font-semibold text-white">{image.label}</span>
          <span className="font-mono text-[11px] text-slate-300">{image.date}</span>
        </div>

        {/* corner reticle for that satellite-product feel */}
        <Reticle />
      </div>
      <figcaption className="px-3 py-2.5 text-xs leading-relaxed text-slate-400">
        {image.caption}
      </figcaption>
    </figure>
  );
}

/** CSS-only fallback that still reads as a satellite tile. */
function GeneratedPlaceholder({ tone }: { tone: "before" | "after" }) {
  const grad =
    tone === "before"
      ? "from-[#3a2e1c] via-[#6b5634] to-[#a8864a]"
      : "from-[#123020] via-[#1f6b3f] to-[#4ab460]";
  return (
    <div className={`relative h-full w-full bg-gradient-to-br ${grad}`}>
      <div className="absolute inset-0 bg-dotgrid opacity-30" />
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="rounded-md bg-black/30 px-2 py-1 text-[11px] text-white/70 backdrop-blur">
          placeholder · image not found
        </span>
      </div>
    </div>
  );
}

function Reticle() {
  // Corner brackets via viewBox coords; scales with the tile.
  return (
    <svg
      viewBox="0 0 100 75"
      preserveAspectRatio="none"
      className="pointer-events-none absolute inset-0 h-full w-full text-white/25"
      fill="none"
    >
      <path d="M4 4h8M4 4v8" stroke="currentColor" strokeWidth="0.8" />
      <path d="M96 4h-8M96 4v8" stroke="currentColor" strokeWidth="0.8" />
      <path d="M4 71h8M4 71v-8" stroke="currentColor" strokeWidth="0.8" />
      <path d="M96 71h-8M96 71v-8" stroke="currentColor" strokeWidth="0.8" />
    </svg>
  );
}
