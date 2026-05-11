# SemesterOS Architecture

- **Frontend:** Next.js App Router + TypeScript + Tailwind + Framer Motion.
- **Data layer:** Local seeded demo dataset in `data/demo.ts` for frictionless judging demos.
- **AI layer:** `/api/ai-plan` server route calls NVIDIA NIM chat completions with JSON structured output.
- **Resilience path:** If NIM key is missing/unavailable, endpoint returns polished fallback planning content.
- **UX structure:** single premium dashboard with 5 modes (overview, timeline, planner, focus, milestones).
- **State strategy:** Local client state for fast interactions and no setup burden.
