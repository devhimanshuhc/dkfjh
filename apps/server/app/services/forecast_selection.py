from collections.abc import Iterable
from datetime import datetime, timedelta

from app.models.wind import ForecastGeneration


def select_latest_forecasts(
    forecasts: Iterable[ForecastGeneration], horizon_hours: float
) -> dict[datetime, ForecastGeneration]:
    """For each target time, the newest forecast published at least
    `horizon_hours` before it — what a trader could have seen at decision time."""
    horizon = timedelta(hours=horizon_hours)
    latest_by_target: dict[datetime, ForecastGeneration] = {}
    for forecast in forecasts:
        if forecast.publish_time > forecast.start_time - horizon:
            continue
        current = latest_by_target.get(forecast.start_time)
        if current is None or forecast.publish_time > current.publish_time:
            latest_by_target[forecast.start_time] = forecast
    return latest_by_target
