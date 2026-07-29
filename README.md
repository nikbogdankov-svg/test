# BullSequana AI Platform · Data Catalog

Enterprise data catalog UI for discovering, trusting, governing, and requesting access to municipal datasets used by AI systems.

## Stack

- Next.js App Router
- React + TypeScript
- Tailwind CSS
- shadcn/ui-style primitives (Radix)
- TanStack Table
- Lucide React
- Framer Motion
- Recharts

## Getting started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). The app redirects to `/catalog`.

## Scripts

```bash
npm run dev
npm run build
npm run start
npm run lint
```

## Product surfaces

- `/catalog` — Data Catalog home with stats, search, filters, and dataset table
- `/catalog/[id]` — Dataset detail with Overview, Schema, Lineage, Permissions, Quality, Audit, Usage
- `/collections`, `/lineage`, `/sources`, `/requests`, `/audit`, `/teams`, `/settings`

## Data

Realistic Ville Métropole mock data lives in `src/data/` and is served through `src/mock/api.ts`.
