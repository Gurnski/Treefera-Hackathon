# Regen Radar

Regen Radar placed second at the Treefera LCAW 2026 Hackathon.

The project tests whether a change in farming practice produced a measurable vegetation signal in satellite data. It compares the target field with nearby controls and keeps the uncertainty visible instead of forcing a confident answer.

## The result

Roger's field improved after the proposed practice-change window, but the candidate controls also improved and often moved more strongly. The final assessment was deliberately conservative:

- Regen score: 38/100
- Confidence: 0.32
- Conclusion: a useful signal, but not enough evidence to attribute the change to regenerative practice alone

That distinction became the core of the project: signal, not proof.

## What the dashboard shows

- NDVI history for Roger's field
- target-versus-control comparisons
- the proposed adoption window
- a transparent score breakdown
- before-and-after evidence
- limitations and recommended next steps

The interface turns notebook output into something a non-specialist can inspect quickly without hiding the weaknesses in the analysis.

## Stack

- React and TypeScript
- Vite
- Tailwind CSS
- Recharts
- Python and Jupyter notebooks
- Sentinel-2 time-series data

## Run locally

```bash
npm install
npm run dev
```

Create a production build with:

```bash
npm run build
```

The demo data is stored in `public/demo-data/`. The app loads the manifest and time-series files at runtime.

## Method

The analysis used baseline-harmonised Sentinel-2 observations from 2017 to 2025. NDVI was extracted for the target field, refined to reduce non-crop edge effects, and compared with candidate control fields across the same period.

The controls were manually selected and are not a substitute for a properly matched experimental design. Weather, crop rotation, harvest timing and management records would all need to be added before making a stronger attribution claim.

## Status

This repository contains the hackathon prototype, analysis outputs and the dashboard used to present the result. It is a reproducible investigation, not proof of environmental impact.

Built by Daniel Rea during the Treefera LCAW 2026 Hackathon.