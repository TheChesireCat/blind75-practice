# Blind 75 — Practice

A small Next.js app for practicing the [Blind 75](https://www.techinterviewhandbook.org/grind75/)
LeetCode problems. Browse by category, read the problem, jot notes in a
scratchpad, track your progress, and reveal a worked Python solution.

- **Frontend:** Next.js 14 (App Router) + Tailwind
- **Backend:** [InstantDB](https://instantdb.com) (realtime) — stores the
  problems and your per-user practice progress
- **Auth:** InstantDB email magic-code login, mirrored into an httpOnly
  cookie session (verified server-side with the admin token)
- **Deploy:** Vercel

## Auth & sessions

Sign in with the **Sign in** button (top right): enter your email, receive a
one-time code, and verify. On success the InstantDB refresh token is sent to
`/api/auth/session`, verified with the admin token, and stored in an
`httpOnly` cookie so the server can authenticate requests too. Progress
(status, scratchpad, notes) is scoped per signed-in user. Browsing problems
and revealing solutions works without signing in.

## Getting started

```bash
npm install
cp .env.example .env.local   # already includes the public app id
```

Add your **InstantDB admin token** to `.env.local` (Dash → your app → Admin
tab). It's only used by the seed script and is never sent to the browser.

```env
NEXT_PUBLIC_INSTANT_APP_ID=3d1538c1-28c3-4bcb-9d92-470098f11df6
INSTANT_ADMIN_TOKEN=your-admin-token
```

### 1. Push the schema & permissions

```bash
npx instant-cli@latest login
npx instant-cli@latest push
```

### 2. Seed the problems

```bash
npm run seed
```

This loads all 76 problems from `data/problems.json` into InstantDB. It's
idempotent (keyed on the unique `pid`), so you can re-run it any time.

### 3. Run

```bash
npm run dev
```

Open http://localhost:3000.

> The app falls back to the bundled `data/problems.json` if the database
> hasn't been seeded yet, so it's usable immediately — but progress tracking
> needs InstantDB.

## Deploy to Vercel

1. Push this repo to GitHub.
2. Import it in Vercel.
3. Add env vars in the Vercel project settings:
   - `NEXT_PUBLIC_INSTANT_APP_ID`
   - `INSTANT_ADMIN_TOKEN` (optional in Vercel — only needed if you seed from CI)

## Algorithm visualizations

Some problems show a **Visualize** panel: a step-through SVG animation of the
algorithm plus an auto-derived "tabulature" table, with play/step/scrub
controls. It's a trace-driven framework, so per-problem work is tiny:

- `lib/viz/types.ts` — the `Frame` / `Visualization` model.
- `components/viz/AlgoVisualizer.tsx` — generic player (controls, status
  panel, legend, static table) + stage renderer.
- `components/viz/SequenceView.tsx` — the 1D-array stage (boxes, pointers,
  sliding window, profit arrow). More stages planned: GridView, TreeView,
  LinkedListView, IntervalTimeline, GraphView.
- `lib/viz/<slug>.ts` — a **tracer**: runs the algorithm and emits frames.
- `lib/viz/registry.ts` — maps a LeetCode slug to its tracer.

To add a visualization: write a tracer that returns `{ title, columns,
frames }` and register it by slug. The static table is generated from each
frame's `row`, so you get the tabular aid for free. See
`best-time-to-buy-and-sell-stock.ts` for a worked example.

## Data

`blind75-data.csv` is the source data; `data/problems.json` is the parsed,
app-ready version used by the seed script and as an offline fallback.

## Project layout

```
app/                  Next.js routes (list + /problem/[id])
lib/db.ts             InstantDB client
lib/problems.ts       types + bundled problem data
instant.schema.ts     InstantDB schema
instant.perms.ts      InstantDB permissions
scripts/seed.mjs      seed problems into InstantDB
data/problems.json    parsed problems
```
