import pytest

from app.models.wind import ComparisonPoint
from app.services.error_metrics import compute_error_metrics
from tests.wind_factories import at_hour


def point(actual_mw: int | None, forecast_mw: int | None) -> ComparisonPoint:
    error_mw = (
        forecast_mw - actual_mw
        if actual_mw is not None and forecast_mw is not None
        else None
    )
    return ComparisonPoint(
        start_time=at_hour(0),
        actual_mw=actual_mw,
        forecast_mw=forecast_mw,
        forecast_published_at=None,
        error_mw=error_mw,
    )


def test_computes_core_metrics_from_paired_points():
    metrics = compute_error_metrics(
        [point(1000, 1100), point(1000, 900), point(1000, 1300)]
    )

    assert metrics is not None
    assert metrics.sample_count == 3
    assert metrics.mean_absolute_error_mw == pytest.approx(500 / 3)
    assert metrics.bias_mw == pytest.approx(100)
    assert metrics.root_mean_square_error_mw == pytest.approx((110_000 / 3) ** 0.5)
    assert metrics.error_p50_mw == pytest.approx(100)
    assert metrics.mean_actual_mw == pytest.approx(1000)


def test_ignores_points_missing_actual_or_forecast():
    metrics = compute_error_metrics(
        [point(1000, 1100), point(None, 500), point(800, None), point(1000, 1100)]
    )

    assert metrics is not None
    assert metrics.sample_count == 2


def test_returns_none_when_too_few_paired_points():
    assert compute_error_metrics([point(1000, 1100), point(None, 1)]) is None
