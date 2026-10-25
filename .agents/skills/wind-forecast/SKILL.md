---
name: wind-forecast
description: Domain rules for the UK wind forecast monitoring product — Elexon BMRS datasets (FUELHH actuals, WINDFOR forecasts), the January 2026 scope, forecast-horizon selection, actual/forecast alignment, and error metrics. Use before writing any code that fetches, joins, aggregates, charts, or explains wind generation actuals, forecasts, or forecast error.
---

# Wind Forecast Domain

The product brief is `docs/task.md`. This skill turns it into rules the code must follow.

## Who it is for and what it must do

A UK energy utility's day-ahead trading team buys power the day before delivery. They need to cover demand that wind will not meet, so they depend on wind forecasts. The app must let them:

1. **See the latest wind forecast that was available when the purchase decision was made**, next to what was actually generated.
2. **Quantify how accurate those forecasts are**, so decisions can account for the error.

Scope is fixed by the brief: **national wind only, Elexon data only, purchase decisions made in January 2026.** Do not add other fuel types, other data sources, or other periods.

---

## Data sources (verified against the official OpenAPI spec and live API)

Base URL: `https://data.elexon.co.uk/bmrs/api/v1` (from `https://data.elexon.co.uk/swagger/v1/swagger.json`). Public, no API key. Docs pages from the brief: `bmrs.elexon.co.uk/api-documentation/endpoint/datasets/FUELHH/stream` and `.../WINDFOR/stream`.

| Dataset | Endpoint | Resolution | Use |
|---|---|---|---|
| Actuals | `GET /datasets/FUELHH/stream` | 30 min | Actual wind generation (MW, half-hour average) |
| Forecasts | `GET /datasets/WINDFOR/stream` | 60 min | Forecast wind generation (MW) |

**FUELHH parameters:** `publishDateTimeFrom`, `publishDateTimeTo` (date-time), **or** `settlementDateFrom`, `settlementDateTo` (`yyyy-MM-dd`) — the two kinds cannot be combined. Plus `settlementPeriod` (list) and `fuelType` (list). Fetch actuals by **settlement date** with `fuelType=WIND`.

**WINDFOR parameters:** only `publishDateTimeFrom`, `publishDateTimeTo`. **Without them it returns only the latest forecast**, so always pass a publish range.

Response fields:

- FUELHH: `publishTime`, `startTime`, `settlementDate`, `settlementPeriod`, `fuelType`, `generation` (integer MW).
- WINDFOR: `publishTime` (when the forecast was made), `startTime` (target time), `generation` (integer MW).

Measured for the January 2026 scope (single request each, no paging needed):

- Actuals `settlementDateFrom=2026-01-02&settlementDateTo=2026-02-01&fuelType=WIND` → **1,488 rows** (31 days × 48, complete).
- Forecasts published 2025-12-29 → 2026-02-01 → **~19,900 rows from 272 runs**.
- WINDFOR runs **8 times a day** on a fixed schedule (UTC ≈ 02:30, 04:30, 07:30, 09:30, 11:30, 15:30, 18:30, 22:30; occasional extra runs).
- Each run covers up to **~66 hours ahead**. It also includes rows up to ~25 h **before** its publish time; those are not forecasts — drop rows where `startTime < publishTime`.
- FUELHH has one row per settlement period (48 per day; 46 or 50 on clock-change days).

---

## Core rules

### Time

- Store, join and compute in **UTC**. Convert to `Europe/London` only for display.
- Never build datetimes from naive strings; parse Elexon timestamps as timezone-aware UTC.

### Period

- Decisions are made in January 2026, and each decision is for the **next day**. So the delivery (target) window is **2026-01-02 00:00 to 2026-02-01 24:00 UK time**.
- Fetch forecasts published from 2025-12-29 (covers the ~66 h maximum horizon before 2026-01-02) to the end of the window. Fetch actuals for the whole delivery window.

### Forecast selection — "latest forecast available at decision time"

For each target time `T` and a horizon `H`:

> Use the **latest forecast run with `publishTime <= T − H`**.

- `H` is a user-selectable input (hours, 0 to ~66 — the longest horizon in the data). The default should represent the day-ahead decision, i.e. a forecast made the day before delivery. Keep the selection logic in one backend function so the definition can change in one place.
- If no run satisfies the rule for `T`, the point has no forecast. Show it as missing; never fill it from a later run.

### Aligning actuals and forecasts

- Forecasts are hourly and actuals are half-hourly. Compare at **forecast resolution**: join on `startTime` at the top of each hour.
- Do not interpolate forecasts to 30 minutes.
- Keep missing points visible in charts (gaps), and report how many points the metrics are based on.

---

## Error metrics

Define error as `forecast − actual` (positive = over-forecast, which means too little was bought).

| Metric | Why it matters |
|---|---|
| **MAE** (MW) | Typical size of the miss — the headline number |
| **RMSE** (MW) | Penalises large misses, which are the costly ones |
| **Bias / mean error** (MW) | Systematic over- or under-forecasting |
| **Error percentiles** (e.g. P10/P50/P90) | A range to plan around ("90% of the time the miss is under X MW") |
| **Error by horizon** | How accuracy degrades the further ahead the forecast is |

- Do **not** use MAPE: wind output can be near zero, which makes percentage error explode. If a relative number is needed, normalise MAE by mean actual generation and label it clearly.
- Compute metrics in the backend from the same aligned series the chart shows, so numbers and chart always agree.

---

## Presenting it

- Primary view: actual vs selected forecast over time for the chosen date range, with horizon as a control.
- Secondary view: the error metrics above, plus a chart of error vs horizon.
- Label units (MW) and timezone on every chart. Explain each metric in one plain sentence for a non-technical trader.
