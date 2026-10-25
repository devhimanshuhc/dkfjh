import pytest

from app.services.wind_dataset import WindDataset
from tests.wind_factories import actual, forecast


@pytest.fixture(autouse=True)
def fake_dataset(monkeypatch):
    dataset = WindDataset(
        actuals=[actual(hour, 1000) for hour in range(48)],
        forecasts=[forecast(-30, hour, 1200) for hour in range(48)],
    )

    async def get_fake_dataset() -> WindDataset:
        return dataset

    monkeypatch.setattr("app.services.wind_report.get_wind_dataset", get_fake_dataset)


def test_comparison_returns_points_and_metrics_for_the_range(client):
    response = client.get(
        "/api/wind/comparison",
        params={"start_date": "2026-01-02", "end_date": "2026-01-02"},
    )

    body = response.json()
    assert response.status_code == 200
    assert len(body["points"]) == 24
    assert body["metrics"]["bias_mw"] == 200
    assert body["horizon_hours"] == 24


def test_comparison_rejects_dates_outside_the_scope(client):
    response = client.get("/api/wind/comparison", params={"start_date": "2025-12-31"})

    assert response.status_code == 400
    assert "between" in response.json()["message"]


def test_comparison_rejects_reversed_range(client):
    response = client.get(
        "/api/wind/comparison",
        params={"start_date": "2026-01-10", "end_date": "2026-01-05"},
    )

    assert response.status_code == 400


def test_comparison_rejects_horizon_beyond_available_data(client):
    response = client.get("/api/wind/comparison", params={"horizon_hours": 99})

    assert response.status_code == 422
    assert response.json()["message"].startswith("horizon_hours")


def test_accuracy_by_horizon_reports_each_horizon(client):
    response = client.get(
        "/api/wind/accuracy-by-horizon",
        params={"start_date": "2026-01-02", "end_date": "2026-01-02"},
    )

    horizons = response.json()["horizons"]
    assert response.status_code == 200
    assert horizons[0]["horizon_hours"] == 1
    assert horizons[0]["metrics"]["mean_absolute_error_mw"] == 200


def test_daily_summary_returns_one_row_per_day(client):
    response = client.get(
        "/api/wind/daily-summary",
        params={"start_date": "2026-01-02", "end_date": "2026-01-03"},
    )

    days = response.json()["days"]
    assert response.status_code == 200
    assert [day["delivery_date"] for day in days] == ["2026-01-02", "2026-01-03"]
    assert days[0]["bias_mw"] == 200


def test_accuracy_breakdown_returns_distribution_and_hours(client):
    response = client.get(
        "/api/wind/accuracy-breakdown",
        params={"start_date": "2026-01-02", "end_date": "2026-01-02"},
    )

    body = response.json()
    assert response.status_code == 200
    assert body["error_distribution"] == [
        {"lower_mw": 0, "upper_mw": 500, "hour_count": 24}
    ]
    assert len(body["by_hour_of_day"]) == 24


def test_breakdown_endpoints_validate_the_range(client):
    for path in ("/api/wind/daily-summary", "/api/wind/accuracy-breakdown"):
        response = client.get(path, params={"end_date": "2026-03-01"})

        assert response.status_code == 400
