from datetime import UTC, datetime, timedelta

from app.models.wind import ActualGeneration, ForecastGeneration

JAN_2_MIDNIGHT = datetime(2026, 1, 2, tzinfo=UTC)


def at_hour(hours_after_jan_2: float) -> datetime:
    return JAN_2_MIDNIGHT + timedelta(hours=hours_after_jan_2)


def forecast(
    published_hour: float, target_hour: float, generation_mw: int
) -> ForecastGeneration:
    return ForecastGeneration(
        publish_time=at_hour(published_hour),
        start_time=at_hour(target_hour),
        generation_mw=generation_mw,
    )


def actual(target_hour: float, generation_mw: int) -> ActualGeneration:
    return ActualGeneration(
        start_time=at_hour(target_hour), generation_mw=generation_mw
    )
