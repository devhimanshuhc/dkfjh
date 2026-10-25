import math
import statistics
from collections import defaultdict
from datetime import date

from app.models.wind import (
    ComparisonPoint,
    DailySummary,
    ErrorBin,
    HourOfDayAccuracy,
)
from app.services.error_metrics import compute_error_metrics
from app.services.wind_scope import UK_TIMEZONE

ERROR_BIN_WIDTH_MW = 500
HOURS_IN_DAY = 24


def summarize_by_day(points: list[ComparisonPoint]) -> list[DailySummary]:
    points_by_day: dict[date, list[ComparisonPoint]] = defaultdict(list)
    for point in points:
        points_by_day[point.start_time.astimezone(UK_TIMEZONE).date()].append(point)
    return [
        _summarize_day(delivery_date, day_points)
        for delivery_date, day_points in sorted(points_by_day.items())
    ]


def _summarize_day(delivery_date: date, points: list[ComparisonPoint]) -> DailySummary:
    paired = [point for point in points if point.error_mw is not None]
    worst = max(paired, key=lambda point: abs(point.error_mw or 0), default=None)
    errors = [point.error_mw for point in paired if point.error_mw is not None]
    return DailySummary(
        delivery_date=delivery_date,
        mean_actual_mw=_mean_or_none(point.actual_mw for point in points),
        mean_forecast_mw=_mean_or_none(point.forecast_mw for point in points),
        mean_absolute_error_mw=_mean_or_none(abs(error) for error in errors),
        bias_mw=_mean_or_none(errors),
        worst_error_mw=worst.error_mw if worst else None,
        worst_error_at=worst.start_time if worst else None,
        sample_count=len(errors),
    )


def build_error_distribution(
    points: list[ComparisonPoint], bin_width_mw: int = ERROR_BIN_WIDTH_MW
) -> list[ErrorBin]:
    errors = [point.error_mw for point in points if point.error_mw is not None]
    if not errors:
        return []
    counts: dict[int, int] = defaultdict(int)
    for error in errors:
        counts[math.floor(error / bin_width_mw)] += 1
    first_bin, last_bin = min(counts), max(counts)
    return [
        ErrorBin(
            lower_mw=bin_index * bin_width_mw,
            upper_mw=(bin_index + 1) * bin_width_mw,
            hour_count=counts[bin_index],
        )
        for bin_index in range(first_bin, last_bin + 1)
    ]


def metrics_by_hour_of_day(points: list[ComparisonPoint]) -> list[HourOfDayAccuracy]:
    points_by_hour: dict[int, list[ComparisonPoint]] = defaultdict(list)
    for point in points:
        points_by_hour[point.start_time.astimezone(UK_TIMEZONE).hour].append(point)
    return [
        HourOfDayAccuracy(
            hour_of_day=hour, metrics=compute_error_metrics(points_by_hour[hour])
        )
        for hour in range(HOURS_IN_DAY)
    ]


def _mean_or_none(values) -> float | None:
    present = [value for value in values if value is not None]
    return statistics.fmean(present) if present else None
