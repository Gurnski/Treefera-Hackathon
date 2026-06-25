import type { Coordinates, DateRange } from "../types";

interface GlobeHeroProps {
  projectName: string;
  tagline: string;
  challengeName: string;
  siteName: string;
  country: string;
  coordinates: Coordinates;
  areaHectares: number;
  dateRange: DateRange;
  satellite: string;
}

/**
 * Hero + location visual.
 *
 * Design choice: instead of pulling in react-globe.gl (WebGL, heavier, can be
 * finicky in a hackathon demo), this is a hand-built SVG/CSS "orbital location"
 * visual — a stylised globe with graticule, an animated radar sweep, and a
 * pulsing site marker that reads as "zooming to the selected site". Zero extra
 * deps, no WebGL risk, and it still looks like a satellite-intelligence product.
 */
export function GlobeHero({
  projectName,
  tagline,
  challengeName,
  siteName,
  country,
  coordinates,
  areaHectares,
  dateRange,
  satellite,
}: GlobeHeroProps) {
  const fmt = (n: number) => `${Math.abs(n).toFixed(4)}° ${n >= 0 ? "" : "S"}`;
  const lat = `${Math.abs(coordinates.lat).toFixed(4)}° ${coordinates.lat >= 0 ? "N" : "S"}`;
  const lng = `${Math.abs(coordinates.lng).toFixed(4)}° ${coordinates.lng >= 0 ? "E" : "W"}`;

  return (
    <header className="relative overflow-hidden rounded-3xl border border-white/10 bg-ink-900/60 shadow-card">
      {/* ambient backdrop */}
      <div className="pointer-events-none absolute inset-0 bg-dotgrid opacity-40" />
      <div className="pointer-events-none absolute inset-0 bg-grid-fade" />

      <div className="relative grid gap-10 px-6 py-10 sm:px-10 sm:py-14 lg:grid-cols-[1.1fr_0.9fr] lg:gap-6">
        {/* Left: copy */}
        <div className="flex flex-col justify-center animate-fade-up">
          <div className="mb-5 flex items-center gap-2">
            <span className="relative flex h-2.5 w-2.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-signal-400 opacity-75" />
              <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-signal-500" />
            </span>
            <span className="eyebrow">Live demo · {challengeName}</span>
          </div>

          <h1 className="text-5xl font-extrabold tracking-tight text-white sm:text-6xl">
            {projectName}
          </h1>
          <p className="mt-4 max-w-xl text-lg leading-relaxed text-slate-300/90">
            {tagline}
          </p>

          {/* site meta */}
          <div className="mt-8 grid max-w-lg grid-cols-2 gap-3 font-mono text-xs sm:grid-cols-3">
            <MetaCell label="Site" value={siteName} accent />
            <MetaCell label="Region" value={country} />
            <MetaCell label="Area" value={`${areaHectares} ha`} />
            <MetaCell label="Latitude" value={lat} />
            <MetaCell label="Longitude" value={lng} />
            <MetaCell
              label="Window"
              value={`${dateRange.start.slice(0, 4)}–${dateRange.end.slice(0, 4)}`}
            />
          </div>

          <div className="mt-6 flex flex-wrap items-center gap-2 text-xs text-slate-400">
            <span className="chip">
              <SatIcon /> {satellite}
            </span>
            <span className="chip">
              <span className="h-1.5 w-1.5 rounded-full bg-radar-400" /> Signal,
              not proof
            </span>
          </div>
        </div>

        {/* Right: location visual */}
        <div className="relative flex items-center justify-center">
          <LocationVisual coordinates={coordinates} latLabel={lat} lngLabel={lng} fmt={fmt} />
        </div>
      </div>
    </header>
  );
}

function MetaCell({
  label,
  value,
  accent = false,
}: {
  label: string;
  value: string;
  accent?: boolean;
}) {
  return (
    <div className="rounded-xl border border-white/5 bg-white/[0.02] px-3 py-2">
      <div className="text-[10px] uppercase tracking-widest text-slate-500">
        {label}
      </div>
      <div
        className={`mt-0.5 truncate text-sm ${accent ? "text-radar-300" : "text-slate-200"}`}
        title={value}
      >
        {value}
      </div>
    </div>
  );
}

/** The stylised globe + radar sweep + site marker. */
function LocationVisual({
  latLabel,
  lngLabel,
}: {
  coordinates: Coordinates;
  latLabel: string;
  lngLabel: string;
  fmt: (n: number) => string;
}) {
  return (
    <div className="relative aspect-square w-full max-w-sm">
      {/* outer pulse rings to suggest "zoom-to-site" */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="h-1/2 w-1/2 rounded-full border border-radar-400/30 [animation:pulse-ring_2.8s_ease-out_infinite]" />
        <div className="absolute h-1/2 w-1/2 rounded-full border border-radar-400/20 [animation:pulse-ring_2.8s_ease-out_infinite_0.9s]" />
      </div>

      <svg viewBox="0 0 320 320" className="relative h-full w-full">
        <defs>
          <radialGradient id="globeFill" cx="42%" cy="38%" r="75%">
            <stop offset="0%" stopColor="#0b3a5a" />
            <stop offset="55%" stopColor="#072133" />
            <stop offset="100%" stopColor="#04111c" />
          </radialGradient>
          <radialGradient id="sweepGrad" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="rgba(56,189,248,0.0)" />
            <stop offset="80%" stopColor="rgba(56,189,248,0.0)" />
            <stop offset="100%" stopColor="rgba(56,189,248,0.35)" />
          </radialGradient>
          <linearGradient id="ring" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#7dd3fc" />
            <stop offset="100%" stopColor="#22c55e" />
          </linearGradient>
        </defs>

        {/* globe body */}
        <circle cx="160" cy="160" r="120" fill="url(#globeFill)" stroke="url(#ring)" strokeOpacity="0.5" />

        {/* graticule */}
        <g stroke="#7dd3fc" strokeOpacity="0.18" fill="none">
          <ellipse cx="160" cy="160" rx="120" ry="40" />
          <ellipse cx="160" cy="160" rx="120" ry="80" />
          <ellipse cx="160" cy="160" rx="40" ry="120" />
          <ellipse cx="160" cy="160" rx="80" ry="120" />
          <line x1="40" y1="160" x2="280" y2="160" />
          <line x1="160" y1="40" x2="160" y2="280" />
        </g>

        {/* rotating radar sweep */}
        <g style={{ transformOrigin: "160px 160px" }} className="animate-sweep">
          <path d="M160 160 L160 40 A120 120 0 0 1 268 200 Z" fill="url(#sweepGrad)" />
        </g>

        {/* site marker — slightly lower-left to match a southern site */}
        <g>
          <circle cx="126" cy="206" r="20" fill="none" stroke="#4ade80" strokeOpacity="0.5" />
          <circle cx="126" cy="206" r="20" fill="none" stroke="#4ade80" strokeOpacity="0.25">
            <animate attributeName="r" values="20;30;20" dur="2.8s" repeatCount="indefinite" />
            <animate attributeName="stroke-opacity" values="0.5;0;0.5" dur="2.8s" repeatCount="indefinite" />
          </circle>
          <circle cx="126" cy="206" r="5" fill="#bbf7d0" />
          <line x1="126" y1="206" x2="126" y2="120" stroke="#4ade80" strokeOpacity="0.5" strokeDasharray="3 3" />
        </g>
      </svg>

      {/* coordinate readout pinned to the marker */}
      <div className="absolute left-1/2 top-2 -translate-x-1/2 rounded-lg border border-white/10 bg-ink-900/80 px-3 py-1.5 font-mono text-[11px] text-radar-300 backdrop-blur">
        TARGET LOCK · {latLabel}, {lngLabel}
      </div>
    </div>
  );
}

function SatIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" className="text-radar-300">
      <path d="M5 5l4 4M3 11l3-3M13 19l-3 3M16 8l-8 8M15 3l6 6-3 3-6-6z" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
