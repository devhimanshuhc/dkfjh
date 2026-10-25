from datetime import date

from app.models.wind import (
    AccuracyBreakdownResponse,
    AccuracyByHorizonResponse,
    ComparisonPoint,
    ComparisonResponse,
    DailySummaryResponse,
    HorizonAccuracy,
)
from app.services.error_metrics import compute_error_metrics
from app.services.forecast_selection import select_latest_forecasts
from app.services.wind_breakdowns import (
    ERROR_BIN_WIDTH_MW,
    build_error_distribution,
    metrics_by_hour_of_day,
    summarize_by_day,
)
from app.services.wind_comparison import build_comparison
from app.services.wind_dataset import WindDataset, get_wind_dataset
from app.services.wind_scope import (
    HORIZONS_FOR_ACCURACY_HOURS,
    uk_day_end_utc,
    uk_day_start_utc,
)


async def get_comparison_report(
    start_date: date, end_date: date, horizon_hours: int
) -> ComparisonResponse:
    dataset = await get_wind_dataset()
    points = _comparison_points(dataset, start_date, end_date, horizon_hours)
    return ComparisonResponse(
        start_date=start_date,
        end_date=end_date,
        horizon_hours=horizon_hours,
        points=points,
        metrics=compute_error_metrics(points),
    )


async def get_accuracy_by_horizon_report(
    start_date: date, end_date: date
) -> AccuracyByHorizonResponse:
    dataset = await get_wind_dataset()
    horizons = [
        HorizonAccuracy(
            horizon_hours=horizon_hours,
            metrics=compute_error_metrics(
                _comparison_points(dataset, start_date, end_date, horizon_hours)
            ),
        )
        for horizon_hours in HORIZONS_FOR_ACCURACY_HOURS
    ]
    return AccuracyByHorizonResponse(
        start_date=start_date, end_date=end_date, horizons=horizons
    )


async def get_daily_summary_report(
    start_date: date, end_date: date, horizon_hours: int
) -> DailySummaryResponse:
    dataset = await get_wind_dataset()
    points = _comparison_points(dataset, start_date, end_date, horizon_hours)
    return DailySummaryResponse(
        start_date=start_date,
        end_date=end_date,
        horizon_hours=horizon_hours,
        days=summarize_by_day(points),
    )


async def get_accuracy_breakdown_report(
    start_date: date, end_date: date, horizon_hours: int
) -> AccuracyBreakdownResponse:
    dataset = await get_wind_dataset()
    points = _comparison_points(dataset, start_date, end_date, horizon_hours)
    return AccuracyBreakdownResponse(
        start_date=start_date,
        end_date=end_date,
        horizon_hours=horizon_hours,
        error_bin_width_mw=ERROR_BIN_WIDTH_MW,
        error_distribution=build_error_distribution(points),
        by_hour_of_day=metrics_by_hour_of_day(points),
    )


def _comparison_points(
    dataset: WindDataset, start_date: date, end_date: date, horizon_hours: int
) -> list[ComparisonPoint]:
    return build_comparison(
        dataset.actuals,
        select_latest_forecasts(dataset.forecasts, horizon_hours),
        uk_day_start_utc(start_date),
        uk_day_end_utc(end_date),
    )
