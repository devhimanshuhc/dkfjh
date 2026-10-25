from datetime import date, datetime, time, timedelta
from zoneinfo import ZoneInfo

UK_TIMEZONE = ZoneInfo("Europe/London")

# Purchase decisions are made in January 2026 for the following day,
# so delivery runs from 2 January to 1 February inclusive.
FIRST_DELIVERY_DATE = date(2026, 1, 2)
LAST_DELIVERY_DATE = date(2026, 2, 1)

MAX_HORIZON_HOURS = 66
DEFAULT_HORIZON_HOURS = 24
HORIZONS_FOR_ACCURACY_HOURS = (1, 2, 4, 8, 12, 18, 24, 30, 36, 42, 48, 54, 60, 66)


def uk_day_start_utc(delivery_date: date) -> datetime:
    return datetime.combine(delivery_date, time.min, UK_TIMEZONE).astimezone(
        ZoneInfo("UTC")
    )


def uk_day_end_utc(delivery_date: date) -> datetime:
    return uk_day_start_utc(delivery_date + timedelta(days=1))


def earliest_forecast_publish_utc() -> datetime:
    return uk_day_start_utc(FIRST_DELIVERY_DATE) - timedelta(hours=MAX_HORIZON_HOURS)
