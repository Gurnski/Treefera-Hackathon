import { useEffect, useState } from "react";
import { loadDemoData } from "./lib/loadDemoData";
import type { DemoData } from "./types";
import { Reveal } from "./components/Reveal";
import { GlobeHero } from "./components/GlobeHero";
import { RegenScoreCard } from "./components/RegenScoreCard";
import { TargetVsControlChart } from "./components/TargetVsControlChart";
import { RogerFieldChart } from "./components/RogerFieldChart";
import { EvidencePanel } from "./components/EvidencePanel";
import { AiInsightCard } from "./components/AiInsightCard";
import { LimitationsCard } from "./components/LimitationsCard";
import { ImpactPanel } from "./components/ImpactPanel";

type LoadState =
  | { status: "loading" }
  | { status: "ready"; data: DemoData }
  | { status: "error"; message: string };

export default function App() {
  const [state, setState] = useState<LoadState>({ status: "loading" });

  useEffect(() => {
    let alive = true;
    loadDemoData()
      .then((data) => alive && setState({ status: "ready", data }))
      .catch((err) =>
        alive &&
        setState({
          status: "error",
          message: err?.message ?? "Unknown error loading demo data",
        })
      );
    return () => {
      alive = false;
    };
  }, []);

  if (state.status === "loading") return <LoadingScreen />;
  if (state.status === "error") return <ErrorScreen message={state.message} />;

  const {
    manifest: m,
    timeseries,
    rogerFieldTimeseries,
    rogerFieldSummary,
  } = state.data;

  return (
    <div className="mx-auto max-w-6xl px-4 pb-24 pt-6 sm:px-6 lg:px-8">
      <GlobeHero
        projectName={m.projectName}
        tagline={m.tagline}
        challengeName={m.challengeName}
        siteName={m.siteName}
        country={m.country}
        coordinates={m.coordinates}
        areaHectares={m.areaHectares}
        dateRange={m.dateRange}
        satellite={m.satellite}
      />

      {/* Roger Field Chart — primary signal (up top, hero chart) */}
      <Reveal className="mt-6">
        <RogerFieldChart
          timeseries={rogerFieldTimeseries ?? []}
          summary={rogerFieldSummary}
        />
      </Reveal>

      {/* Score + AI insight */}
      <div className="mt-6 grid gap-6 lg:grid-cols-[1.25fr_1fr]">
        <Reveal>
          <RegenScoreCard
            score={m.score}
            scoreLabel={m.scoreLabel}
            factors={m.factors}
            confidence={m.confidence}
          />
        </Reveal>
        <Reveal delay={80}>
          <AiInsightCard insight={m.aiInsight} />
        </Reveal>
      </div>

      {/* AOI evidence (Roger field + AOI) */}
      <Reveal className="mt-6">
        <EvidencePanel before={m.images.before} after={m.images.after} />
      </Reveal>

      {/* AOI piggyback (behind RO lines) + ROi study ... */}
      <Reveal className="mt-6">
        <TargetVsControlChart data={timeseries} adoptionPeriod={m.adoptionPeriod} />
      </Reveal>

      {/* Limitations + impact */}
      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <Reveal>
          <LimitationsCard confidence={m.confidence} limitations={m.limitations} />
        </Reveal>
        <Reveal delay={80}>
          <ImpactPanel nextSteps={m.nextSteps} siteName={m.siteName} />
        </Reveal>
      </div>

      <Footer
        dataSource={m.dataSource}
        generatedAt={m.generatedAt}
        schemaVersion={m.schemaVersion}
      />
    </div>
  );
}

function Footer({
  dataSource,
  generatedAt,
  schemaVersion,
}: {
  dataSource: string;
  generatedAt: string;
  schemaVersion: string;
}) {
  return (
    <footer className="mt-12 flex flex-wrap items-center justify-between gap-3 border-t border-white/10 pt-6 text-xs text-slate-500">
      <span>
        Regen Radar · evidence over proof. Data source:{" "}
        <span className="font-mono text-slate-400">{dataSource}</span>
      </span>
      <span className="font-mono">
        schema v{schemaVersion} · {generatedAt.slice(0, 10)}
      </span>
    </footer>
  );
}

function LoadingScreen() {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <div className="h-12 w-12 animate-spin rounded-full border-2 border-white/10 border-t-radar-400" />
        <p className="font-mono text-sm text-slate-400">
          Acquiring satellite signal…
        </p>
      </div>
    </div>
  );
}

function ErrorScreen({ message }: { message: string }) {
  return (
    <div className="flex min-h-screen items-center justify-center px-6">
      <div className="glass max-w-md p-8 text-center">
        <h2 className="text-lg font-semibold text-white">
          Couldn’t load demo data
        </h2>
        <p className="mt-2 text-sm text-slate-400">{message}</p>
        <p className="mt-4 text-xs leading-relaxed text-slate-500">
          Make sure the files exist in{" "}
          <code className="rounded bg-white/5 px-1 text-radar-300">
            public/demo-data/
          </code>{" "}
          (manifest.json and ndvi_timeseries.json) and reload.
        </p>
      </div>
    </div>
  );
}
