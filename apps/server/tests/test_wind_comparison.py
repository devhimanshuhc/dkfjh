from app.services.wind_comparison import build_comparison
from tests.wind_factories import actual, at_hour, forecast


def test_builds_hourly_points_with_error_as_forecast_minus_actual():
    points = build_comparison(
        actuals=[actual(0, 1000), actual(1, 1200)],
        selected_forecasts={
            at_hour(0): forecast(-24, 0, 1100),
            at_hour(1): forecast(-24, 1, 1150),
        },
        window_start=at_hour(0),
        window_end=at_hour(2),
    )

    assert [point.error_mw for point in points] == [100, -50]
    assert points[0].forecast_published_at == at_hour(-24)


def test_skips_half_hour_actuals_because_forecasts_are_hourly():
    points = build_comparison(
        actuals=[actual(0, 1000), actual(0.5, 9999)],
        selected_forecasts={},
        window_start=at_hour(0),
        window_end=at_hour(1),
    )

    assert len(points) == 1
    assert points[0].actual_mw == 1000


def test_keeps_missing_values_as_gaps_instead_of_dropping_points():
    points = build_comparison(
        actuals=[actual(1, 1000)],
        selected_forecasts={at_hour(0): forecast(-24, 0, 900)},
        window_start=at_hour(0),
        window_end=at_hour(2),
    )

    assert points[0].actual_mw is None
    assert points[0].error_mw is None
    assert points[1].forecast_mw is None
    assert points[1].error_mw is None
