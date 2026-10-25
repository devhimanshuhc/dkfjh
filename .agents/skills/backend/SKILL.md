---
name: backend
description: Backend conventions for apps/server — FastAPI (Python 3.12, uv) project structure, routers, services, Pydantic models, settings, logging, and tests. Use when writing any FastAPI backend code, creating routers, services, models, or tests in apps/server.
---

# Backend Conventions (FastAPI)

## Project Structure

```
apps/server/
├── app/
│   ├── main.py        # FastAPI app, middleware, router registration
│   ├── routers/       # One APIRouter per feature (HTTP layer only)
│   ├── services/      # Business logic, no FastAPI imports
│   └── models/        # Pydantic request/response schemas
├── config.py          # pydantic-settings `Settings` + shared `logger`
├── scripts/           # dev_server.py (uvicorn --reload), prod_server.py (gunicorn)
├── tests/             # pytest + fastapi TestClient
├── pyproject.toml     # dependencies, ruff config
└── uv.lock
```

Each feature gets a file in each layer, named after the feature:

```
app/routers/users.py
app/services/users.py
app/models/users.py
```

---

## Routers

- One `APIRouter` per feature, registered in `app/main.py` via `app.include_router(...)`.
- Routers handle HTTP concerns only: parse input, call a service, return a model. No business logic.
- Always declare `response_model` so the OpenAPI docs at `/docs` stay accurate.
- Raise `HTTPException` for client errors; let unexpected errors propagate.

```python
router = APIRouter(prefix="/users", tags=["users"])


@router.get("/{user_id}", response_model=UserResponse)
async def get_user_by_id(user_id: str) -> UserResponse:
    user = await users_service.get_user_by_id(user_id)

    if user is None:
        raise HTTPException(status_code=404, detail="User not found")

    return user
```

---

## Models

- Use Pydantic v2 models for every request body and response. Never return raw dicts from feature routes.
- Name them by intent: `CreateUserRequest`, `UpdateUserRequest`, `UserResponse`.
- Put validation in the model (`Field(min_length=...)`, validators), not in routers.

---

## Elexon Data (this product)

Read the `wind-forecast` skill before touching this. Backend responsibilities:

- **One client module** — `app/services/elexon.py` is the only place that calls the Elexon API. Use `httpx.AsyncClient` (add `httpx` as a runtime dependency; it is currently dev-only).
- **Base URL from settings** — `ELEXON_BASE_URL` on `Settings`, so tests can point it elsewhere.
- **Cache upstream data.** The January 2026 dataset is historical and does not change. Fetch it once and reuse it (in memory or a local file); never call Elexon per user request.
- **Domain logic in services, not routers.** Forecast selection by horizon, actual/forecast alignment and metrics each get their own small, pure function in `app/services/` so they are unit-testable without HTTP.
- **API under `/api`.** Register feature routers with `prefix="/api/..."`. The frontend calls them through `ApiClient`, so response shapes must have matching Pydantic models.
- **Tests never hit the network.** Test the pure functions with hand-built series, and mock the Elexon client in router tests.

---

## Settings & Logging

- All configuration lives in `config.py` as fields on `Settings` (pydantic-settings, loaded from `.env`). Never read `os.environ` directly.
- Add every new setting to `apps/server/.env.example`.
- Import the shared `logger` from `config` — never use `print` in application code.

---

## Running

| Command | What it does |
|---|---|
| `pnpm dev` (root) | Runs web on `:3000` and the API on `:3001` with reload |
| `pnpm --filter server test` | `pytest` with coverage |
| `pnpm --filter server lint` | `ruff check` |
| `pnpm --filter server typecheck` | `mypy` on `app` and `config.py` |
| `docker compose up --build` (root) | Builds and runs both apps in containers |

The API must listen on port `3001` — the web app's `NEXT_PUBLIC_API_URL` points there.

---

## Dependencies

Use `uv`, never `pip`:

```bash
cd apps/server
uv add <package>                  # runtime dependency
uv add --optional dev <package>   # dev-only (tests, lint, types)
```

Commit the updated `uv.lock`.

---

## Testing

- Tests live in `tests/`, named `test_<feature>.py`.
- Use the `client` fixture from `tests/conftest.py` (a `TestClient` around `app`).
- Test through HTTP for routers; call service functions directly for business logic.

---

## Auth

The product has no user accounts — the brief does not ask for them. Do not add auth to the API. The web app still contains a Better Auth client from the template; see the frontend skill.
