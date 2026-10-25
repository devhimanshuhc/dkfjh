import math
import statistics

from app.models.wind import ComparisonPoint, ErrorMetrics

MIN_SAMPLES_FOR_PERCENTILES = 2


def compute_error_metrics(points: list[ComparisonPoint]) -> ErrorMetrics | None:
    paired = [
        point
        for point in points
        if point.error_mw is not None and point.actual_mw is not None
    ]
    if len(paired) < MIN_SAMPLES_FOR_PERCENTILES:
        return None

    errors = [point.error_mw for point in paired if point.error_mw is not None]
    absolute_errors = [abs(error) for error in errors]
    error_percentiles = _percentiles(errors)
    return ErrorMetrics(
        sample_count=len(errors),
        mean_absolute_error_mw=statistics.fmean(absolute_errors),
        root_mean_square_error_mw=math.sqrt(
            statistics.fmean(error**2 for error in errors)
        ),
        bias_mw=statistics.fmean(errors),
        error_p10_mw=error_percentiles[10],
        error_p50_mw=error_percentiles[50],
        error_p90_mw=error_percentiles[90],
        absolute_error_p90_mw=_percentiles(absolute_errors)[90],
        mean_actual_mw=statistics.fmean(
            point.actual_mw for point in paired if point.actual_mw is not None
        ),
    )


def _percentiles(values: list[int]) -> dict[int, float]:
    cut_points = statistics.quantiles(values, n=100, method="inclusive")
    return {percent: cut_points[percent - 1] for percent in (10, 50, 90)}
