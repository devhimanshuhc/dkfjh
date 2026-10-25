from collections.abc import Iterable
from datetime import datetime, timedelta

from app.models.wind import ActualGeneration, ComparisonPoint, ForecastGeneration

FORECAST_RESOLUTION = timedelta(hours=1)


def build_comparison(
    actuals: Iterable[ActualGeneration],
    selected_forecasts: dict[datetime, ForecastGeneration],
    window_start: datetime,
    window_end: datetime,
) -> list[ComparisonPoint]:
    """Hourly points in [window_start, window_end): forecasts are hourly,
    so half-hour actuals without a matching forecast slot are left out."""
    actual_by_time = {actual.start_time: actual.generation_mw for actual in actuals}
    points = []
    target_time = window_start
    while target_time < window_end:
        points.append(
            _build_point(
                target_time,
                actual_by_time.get(target_time),
                selected_forecasts.get(target_time),
            )
        )
        target_time += FORECAST_RESOLUTION
    return points


def _build_point(
    target_time: datetime,
    actual_mw: int | None,
    forecast: ForecastGeneration | None,
) -> ComparisonPoint:
    forecast_mw = forecast.generation_mw if forecast else None
    error_mw = (
        forecast_mw - actual_mw
        if forecast_mw is not None and actual_mw is not None
        else None
    )
    return ComparisonPoint(
        start_time=target_time,
        actual_mw=actual_mw,
        forecast_mw=forecast_mw,
        forecast_published_at=forecast.publish_time if forecast else None,
        error_mw=error_mw,
    )
