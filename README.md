# SemesterOS

A premium, design-first student operating system for NEXA HACK.

## Stack
- Next.js 14 + TypeScript
- Tailwind CSS + Framer Motion
- NVIDIA NIM API integration for study planning

## Local setup
```bash
npm install
cp .env.example .env.local
npm run dev
```

Open `http://localhost:3000`.

## Environment
Set in `.env.local`:
- `NVIDIA_NIM_API_KEY=...`

If key is absent, SemesterOS serves polished fallback AI outputs automatically.

## Deployment (Vercel)
```bash
npm i -g vercel
vercel
vercel --prod
```
Add `NVIDIA_NIM_API_KEY` in Vercel project environment variables.

## Repo tree
See `docs/repo-tree.txt`.
