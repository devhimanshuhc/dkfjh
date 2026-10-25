# DKFJH — UK Wind Forecast Monitor

A web app that shows how far UK wind power forecasts could be trusted when buying electricity one day ahead, using Elexon data for January 2026.

- **Live app:** _add the deployed Vercel link here_
- **Demo video:** _add the unlisted YouTube link here_

---

## Built with AI: Claude Code

This project was built with **[Claude Code](https://claude.com/claude-code)**, Anthropic's AI coding assistant, working in the terminal under the author's direction.

---

## The problem

A UK energy company has to buy electricity on the **day-ahead market**, one day before its customers use it. Wind farms supply part of what customers need, so the company relies on a **wind forecast** to decide how much extra electricity to buy:

```
Electricity to buy  ≈  what customers need  −  wind expected
```

If the forecast promises too much wind, the company buys too little and must cover the gap at the last minute, usually at a higher price. The app answers two questions:

1. **What did the forecast say when the purchase was made?** It shows the forecast that was actually available at buying time next to what the wind really did.
2. **How far can the forecast be trusted?** It measures the forecast error, so buyers know how much backup electricity to keep.

## What we found (January 2026, forecasts made 24 hours ahead)

| Measure | Result |
|---|---|
| Average error | **1,932 MW** in a typical hour (17% of the wind actually produced) |
| Safety buffer | **3,850 MW** of backup would have covered 9 hours in 10 |
| Too high or too low? | Forecasts were usually **too high, by 1,736 MW on average**, so buying on the forecast alone left you short |
| Forecasting earlier | Average error grows from 1,685 MW (1 hour ahead) to 2,301 MW (48 hours ahead) |
| Time of day | Least accurate around 05:00 (2,381 MW); most accurate around 16:00 (1,543 MW) |

---

## The app

| Page | Route | What it shows |
|---|---|---|
| **Landing** | `/` | The problem, the headline numbers and links into the dashboard. Includes an animated hero. |
| **Overview** | `/overview` | The main finding and three headline numbers, plus January at a glance. |
| **Forecast vs Actual** | `/explorer` | Hour-by-hour chart of forecast vs actual, an hour-by-hour error chart, and a sortable day-by-day table (click a day to zoom in). |
| **Forecast Accuracy** | `/accuracy` | All five error measures, how often each size of error happens, how accuracy changes with how early the forecast was made, and by time of day. |
| **How it works** | `/how-it-works` | Where the data comes from, how the forecast for each hour is chosen, what every term means, and the assumptions and limitations. |

- **Shared filters:** on the Forecast vs Actual and Forecast Accuracy pages you can pick the dates (2 Jan – 1 Feb 2026) and **"Use forecasts made at least N hours before"**. The choice is saved in the URL, so a view can be shared.
- **Explanations:** every chart has an ⓘ explaining how to read it, and every measure has an ⓘ with a plain-English definition.
- **Colour coding:** numbers are **green** when they are within 10% of the best case (forecasts made 1 hour ahead) and **red** when they are worse.

---

## How it works

### Data (Elexon BMRS, public, no API key)

| Dataset | Endpoint | Resolution | Used for |
|---|---|---|---|
| Actual generation | [`FUELHH/stream`](https://bmrs.elexon.co.uk/api-documentation/endpoint/datasets/FUELHH/stream) with `fuelType=WIND` | 30 min | What wind farms actually produced |
| Forecasts | [`WINDFOR/stream`](https://bmrs.elexon.co.uk/api-documentation/endpoint/datasets/WINDFOR/stream) | 60 min, ~8 forecast runs a day, up to ~66 h ahead | What the forecast said, and when it was made |

The backend fetches both datasets **once** (about 1,500 actual rows and 20,000 forecast rows) and keeps them in memory. January 2026 is in the past, so the data does not change.

### Choosing the forecast for each hour

For every hour `T` and a chosen lead time `H`:

> Use the **most recent forecast published at or before `T − H`**: the one a buyer could actually have seen.

Forecast rows published after their own target time are dropped. If no forecast is old enough, the hour has no forecast and is shown as a gap.

### Comparing and measuring

- Forecasts are hourly and actuals half-hourly, so they are compared **on the hour**.
- **Error = forecast − actual.** A plus means the forecast was too high (less wind came, so the buyer would be short).
- **Measures:**
  - **average error** (MAE)
  - **safety buffer** (90th percentile of the absolute error)
  - **too high or too low** (mean error, or bias)
  - **big-mistake score** (RMSE)
  - **usual range of error** (10th–90th percentile)
- MAPE is deliberately not used, because wind output can be close to zero, which makes percentage errors meaningless.

### Scope and assumptions

- Purchase decisions are made in January 2026 for the next day, so the delivery hours run from **2 January to 1 February 2026**.
- Only national wind data from Elexon is used, as the brief requires.
- All calculations are in UTC. Times are shown in UK time.

### Limitations

- One month of data only.
- Recorded output can be lower than the wind available when wind farms are asked to turn down (curtailment). This may explain part of the over-forecast and has not been adjusted for.
- Forecasts made more than about 48 hours ahead have fewer hours to compare against.

---

## Architecture

```
Browser ──▶ Next.js (React) :3000 ──HTTP──▶ FastAPI :3001 ──(once, cached)──▶ Elexon BMRS API
             pages, charts                    pick forecast → align → metrics
```

- **Frontend:** Next.js 16 (React 19), TanStack Query, Recharts (through the shadcn chart wrapper), Tailwind CSS 4. Data flows Component → query hook → service → `ApiClient`. The frontend never calculates measures; every number comes from the API.
- **Backend:** FastAPI on Python 3.12, managed with `uv`. All logic lives in small, pure, unit-tested functions in `app/services/`, and routers only handle HTTP.
- **Monorepo:** pnpm workspaces and Turborepo run both apps with one command (`pnpm dev`, `pnpm test`, …).

### API

All under `/api/wind`. Each takes `start_date` and `end_date` (UK delivery days, 2026-01-02 to 2026-02-01). The comparison, daily summary and accuracy breakdown also take `horizon_hours` (0–66, default 24).

| Endpoint | Returns |
|---|---|
| `GET /comparison` | Hour-by-hour actual, forecast, forecast publish time and error, plus the error measures |
| `GET /daily-summary` | One row per day: average actual, average forecast, average error, biggest error |
| `GET /accuracy-breakdown` | How often each size of error happens, and the measures for each hour of the day |
| `GET /accuracy-by-horizon` | The measures for lead times from 1 h to 66 h |

Interactive API docs: `/docs` on the API (locally `http://localhost:3001/docs`).

---

## Files and directories

```
.
├── apps/
│   ├── server/                     FastAPI backend (Python 3.12, uv)
│   │   ├── app/
│   │   │   ├── main.py             App setup, CORS, router registration
│   │   │   ├── errors.py           Turns errors into {"message": ...} responses
│   │   │   ├── models/wind.py      Pydantic request/response models
│   │   │   ├── routers/wind.py     The /api/wind endpoints and input checks
│   │   │   └── services/
│   │   │       ├── elexon.py              Only module that calls Elexon (httpx)
│   │   │       ├── wind_dataset.py        Fetches January's data once and caches it
│   │   │       ├── wind_scope.py          Date window, lead-time limits, UK-time helpers
│   │   │       ├── forecast_selection.py  Picks the forecast available at decision time
│   │   │       ├── wind_comparison.py     Lines up forecast and actual per hour
│   │   │       ├── error_metrics.py       MAE, RMSE, bias, percentiles
│   │   │       ├── wind_breakdowns.py     Daily summary, error histogram, hour of day
│   │   │       └── wind_report.py         Combines the steps for each endpoint
│   │   ├── tests/                  pytest suite (no network calls)
│   │   ├── config.py               Settings from .env (pydantic-settings) and logger
│   │   ├── scripts/                dev (uvicorn) and prod (gunicorn) launchers
│   │   ├── Dockerfile              Production image (port 3001)
│   │   ├── pyproject.toml, uv.lock Python dependencies (+ Vercel entrypoint)
│   │   └── package.json            Lets Turborepo run dev/test/lint/typecheck
│   └── web/                        Next.js frontend (React)
│       ├── src/app/                Routes: (landing)/ and (main)/{overview,explorer,accuracy,how-it-works}
│       ├── src/components/
│       │   ├── landing/            Landing page sections and hero animation
│       │   ├── overview/           Overview page
│       │   ├── explorer/           Forecast vs Actual page
│       │   ├── accuracy/           Forecast Accuracy page
│       │   ├── how-it-works/       How it works page
│       │   ├── wind/               Shared cards, filters, info icons and charts/
│       │   ├── layout/             Welcome banner
│       │   └── sidebar/            App sidebar and navigation
│       ├── src/hooks/              URL filters, dismissible banner, breadcrumbs
│       ├── src/queries/            TanStack Query hooks
│       ├── src/services/           API calls through ApiClient
│       ├── src/utils/              Formatting, chart data, plain-English insights, colour rating
│       ├── src/constants/          Date window, routes, glossary of terms
│       ├── src/types/              API response types
│       ├── src/validations/        Zod schema for URL filters
│       └── Dockerfile              Production image (port 3000)
├── packages/
│   ├── ui/                         Shared shadcn-based component library and theme
│   ├── shared/                     Shared TypeScript utilities
│   ├── typescript-config/          Shared tsconfig presets
│   └── db/                         Prisma package left over from the starter template (not used)
├── docs/task.md                    The project brief
├── docker-compose.yml              Runs the server and web app together
├── turbo.json                      Turborepo task setup
├── .github/workflows/              CI: audit, secret scan, lint, typecheck, tests
├── CLAUDE.md, AGENTS.md, .agents/  Coding rules and skills for AI assistants
└── README.md
```

---

## Running the app locally

### Prerequisites

- Node.js 22+ and pnpm 11.5+
- Python 3.12+ and [uv](https://docs.astral.sh/uv/)
- Docker (optional)

### 1. Install

```bash
pnpm install
```

Python packages are installed by `uv` automatically on the first run.

### 2. Environment

```bash
cp apps/server/.env.example apps/server/.env
cp apps/web/.env.example apps/web/.env
```

The defaults work locally, and no API keys are needed.

| Variable | App | Default |
|---|---|---|
| `CORS_ORIGINS` | server | `["http://localhost:3000"]` |
| `ELEXON_BASE_URL` | server | `https://data.elexon.co.uk/bmrs/api/v1` |
| `NEXT_PUBLIC_API_URL` | web | `http://localhost:3001` |
| `NEXT_PUBLIC_APP_URL` | web | `http://localhost:3000` |

### 3. Start

**In the terminal (with hot reload):**

```bash
pnpm dev
```

**Or with Docker:**

```bash
docker compose up --build
```

Then open:
- **App:** http://localhost:3000
- **API docs:** http://localhost:3001/docs

The first page load takes a second or two while the API fetches January's data from Elexon. After that, responses come from memory.

### Useful commands

```bash
pnpm test        # pytest (server) + Vitest (web)
pnpm lint        # Biome (TypeScript) + ruff (Python)
pnpm typecheck   # tsc + mypy
pnpm ready       # lint fix + typecheck, run before committing
pnpm --filter web test:cov   # frontend coverage report
```

---

## Deploying to Vercel

The app is deployed as **two Vercel projects from this one repository**: one for the API and one for the website. Deploy the API first, because the website needs its URL.

### 1. API (FastAPI)

1. In Vercel: **Add New → Project → import this GitHub repo**.
2. **Root Directory:** `apps/server`.
3. **Framework Preset:** FastAPI. Vercel reads the dependencies from `pyproject.toml` / `uv.lock`, and the app entry point from `[tool.vercel] entrypoint = "app.main:app"`.
4. **Environment variable:** `CORS_ORIGINS` = `["http://localhost:3000"]` for now. You update it in step 3.
5. **Deploy**, then check `https://<api-project>.vercel.app/health` returns `{"status":"healthy"}`.

### 2. Website (Next.js)

1. **Add New → Project →** import the **same** repo again.
2. **Root Directory:** `apps/web`. **Framework Preset:** Next.js.
3. **Build Command** (override): `cd ../.. && pnpm turbo run build --filter=web`. This builds the shared package first.
4. **Environment variables:**
   - `NEXT_PUBLIC_API_URL` = `https://<api-project>.vercel.app`
   - `NEXT_PUBLIC_APP_URL` = `https://<web-project>.vercel.app`
   - `ENABLE_EXPERIMENTAL_COREPACK` = `1`, so Vercel uses the pnpm version pinned in `package.json`
5. **Deploy.**

### 3. Connect them

In the **API** project, set `CORS_ORIGINS` to `["https://<web-project>.vercel.app"]` and redeploy, so the browser is allowed to call the API.

---

## Development practices

- **Tests:** 29 backend tests (pytest) and 91 frontend tests (Vitest and Testing Library). The backend tests never hit the network; the Elexon client is tested with a mock transport.
- **Small pure functions:** forecast selection, alignment and the measures are plain functions that are easy to test and explain.
- **Every async view has states:** loading, error and empty states are handled explicitly.
- **Checks:** linting, type checking and tests run in CI and in pre-commit hooks (lefthook).
