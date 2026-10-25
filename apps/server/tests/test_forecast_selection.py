from app.services.forecast_selection import select_latest_forecasts
from tests.wind_factories import at_hour, forecast


def test_picks_newest_forecast_published_before_the_horizon():
    forecasts = [
        forecast(published_hour=-30, target_hour=0, generation_mw=100),
        forecast(published_hour=-25, target_hour=0, generation_mw=200),
        forecast(published_hour=-10, target_hour=0, generation_mw=300),
    ]

    selected = select_latest_forecasts(forecasts, horizon_hours=24)

    assert selected[at_hour(0)].generation_mw == 200


def test_includes_forecast_published_exactly_at_the_horizon():
    forecasts = [forecast(published_hour=-24, target_hour=0, generation_mw=150)]

    selected = select_latest_forecasts(forecasts, horizon_hours=24)

    assert selected[at_hour(0)].generation_mw == 150


def test_leaves_target_without_forecast_when_none_is_old_enough():
    forecasts = [forecast(published_hour=-2, target_hour=0, generation_mw=100)]

    assert select_latest_forecasts(forecasts, horizon_hours=4) == {}


def test_ignores_rows_published_after_their_target_time():
    forecasts = [forecast(published_hour=5, target_hour=0, generation_mw=100)]

    assert select_latest_forecasts(forecasts, horizon_hours=0) == {}


def test_selects_independently_per_target_time():
    forecasts = [
        forecast(published_hour=-5, target_hour=0, generation_mw=100),
        forecast(published_hour=-5, target_hour=1, generation_mw=110),
        forecast(published_hour=-2, target_hour=1, generation_mw=120),
    ]

    selected = select_latest_forecasts(forecasts, horizon_hours=4)

    assert selected[at_hour(0)].generation_mw == 100
    assert selected[at_hour(1)].generation_mw == 110
