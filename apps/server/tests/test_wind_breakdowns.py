from datetime import date

from app.models.wind import ComparisonPoint
from app.services.wind_breakdowns import (
    build_error_distribution,
    metrics_by_hour_of_day,
    summarize_by_day,
)
from tests.wind_factories import at_hour


def point(hour: float, actual_mw: int | None, forecast_mw: int | None):
    error_mw = (
        forecast_mw - actual_mw
        if actual_mw is not None and forecast_mw is not None
        else None
    )
    return ComparisonPoint(
        start_time=at_hour(hour),
        actual_mw=actual_mw,
        forecast_mw=forecast_mw,
        forecast_published_at=None,
        error_mw=error_mw,
    )


def test_summarizes_each_uk_delivery_day_with_its_worst_hour():
    days = summarize_by_day(
        [point(0, 1000, 1200), point(1, 1000, 700), point(24, 2000, 2100)]
    )

    assert [day.delivery_date for day in days] == [date(2026, 1, 2), date(2026, 1, 3)]
    assert days[0].mean_absolute_error_mw == 250
    assert days[0].bias_mw == -50
    assert days[0].worst_error_mw == -300
    assert days[0].worst_error_at == at_hour(1)
    assert days[1].sample_count == 1


def test_day_without_any_forecast_has_no_error_figures():
    [day] = summarize_by_day([point(0, 1000, None)])

    assert day.mean_actual_mw == 1000
    assert day.mean_absolute_error_mw is None
    assert day.worst_error_mw is None
    assert day.sample_count == 0


def test_error_distribution_counts_errors_in_contiguous_bins():
    bins = build_error_distribution(
        [point(0, 1000, 1100), point(1, 1000, 1400), point(2, 1000, 2100)],
        bin_width_mw=500,
    )

    assert [(b.lower_mw, b.upper_mw, b.hour_count) for b in bins] == [
        (0, 500, 2),
        (500, 1000, 0),
        (1000, 1500, 1),
    ]


def test_error_distribution_puts_negative_errors_below_zero():
    [error_bin] = build_error_distribution([point(0, 1000, 900)], bin_width_mw=500)

    assert (error_bin.lower_mw, error_bin.upper_mw) == (-500, 0)


def test_error_distribution_is_empty_without_errors():
    assert build_error_distribution([point(0, 1000, None)]) == []


def test_metrics_by_hour_of_day_covers_all_24_hours():
    by_hour = metrics_by_hour_of_day(
        [point(0, 1000, 1100), point(24, 1000, 1300), point(1, 1000, 1000)]
    )

    assert len(by_hour) == 24
    assert by_hour[0].metrics is not None
    assert by_hour[0].metrics.mean_absolute_error_mw == 200
    assert by_hour[1].metrics is None
