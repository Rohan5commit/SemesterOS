# SemesterOS

SemesterOS is a premium, visually expressive student operating system built for NEXA HACK.

## Highlights
- Beautiful onboarding flow with persona-based demo start.
- Unified dashboard: overview, timeline, planner, focus mode, milestones.
- AI-powered weekly planning via NVIDIA NIM with strict JSON outputs.
- Seamless fallback mode for offline/no-key demos.
- Fully responsive and presentation-ready.

## Tech Stack
- Next.js 14 (App Router)
- TypeScript
- Tailwind CSS
- Framer Motion

## Quick Start
```bash
npm install
cp .env.example .env.local
npm run dev
```
Open `http://localhost:3000`.

## Environment Variables
```bash
NVIDIA_NIM_API_KEY=
```
If the key is missing/unavailable, SemesterOS automatically serves polished fallback planning output.

## Deploy to Vercel
```bash
npm i -g vercel
vercel
vercel --prod
```
Then add `NVIDIA_NIM_API_KEY` in Vercel project settings.

## Submission Assets
- `architecture.md`
- `submission-description.md`
- `demo-script.md`
- `pitch-deck-outline.md`
- `product-presentation-outline.md`
- `final-submission-checklist.md`
- `docs/repo-tree.txt`
