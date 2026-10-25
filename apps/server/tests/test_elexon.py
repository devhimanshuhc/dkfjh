from datetime import UTC, date, datetime

import httpx
import pytest

from app.services import elexon

pytestmark = pytest.mark.anyio


@pytest.fixture
def captured_requests(monkeypatch):
    requests: list[httpx.Request] = []
    rows_by_dataset = {
        "FUELHH": [
            {"startTime": "2026-01-02T00:00:00Z", "generation": 1000},
        ],
        "WINDFOR": [
            {
                "publishTime": "2026-01-01T00:00:00Z",
                "startTime": "2026-01-02T00:00:00Z",
                "generation": 1100,
            },
        ],
    }

    def respond(request: httpx.Request) -> httpx.Response:
        requests.append(request)
        dataset = request.url.path.split("/")[-2]
        return httpx.Response(200, json=rows_by_dataset[dataset])

    real_client = httpx.AsyncClient
    monkeypatch.setattr(
        httpx,
        "AsyncClient",
        lambda **kwargs: real_client(transport=httpx.MockTransport(respond), **kwargs),
    )
    return requests


async def test_fetches_wind_actuals_by_settlement_date(captured_requests):
    actuals = await elexon.fetch_wind_actuals(date(2026, 1, 2), date(2026, 2, 1))

    params = captured_requests[0].url.params
    assert params["fuelType"] == "WIND"
    assert params["settlementDateFrom"] == "2026-01-02"
    assert actuals[0].generation_mw == 1000
    assert actuals[0].start_time == datetime(2026, 1, 2, tzinfo=UTC)


async def test_fetches_forecasts_with_publish_range(captured_requests):
    forecasts = await elexon.fetch_wind_forecasts(
        datetime(2025, 12, 30, tzinfo=UTC), datetime(2026, 2, 2, tzinfo=UTC)
    )

    assert "publishDateTimeFrom" in captured_requests[0].url.params
    assert forecasts[0].publish_time == datetime(2026, 1, 1, tzinfo=UTC)


async def test_raises_unavailable_when_elexon_fails(monkeypatch):
    real_client = httpx.AsyncClient
    failing = httpx.MockTransport(lambda _: httpx.Response(503))
    monkeypatch.setattr(
        httpx, "AsyncClient", lambda **kwargs: real_client(transport=failing, **kwargs)
    )

    with pytest.raises(elexon.ElexonUnavailableError):
        await elexon.fetch_wind_actuals(date(2026, 1, 2), date(2026, 1, 3))
