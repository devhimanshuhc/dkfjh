import asyncio
from dataclasses import dataclass

from app.models.wind import ActualGeneration, ForecastGeneration
from app.services import elexon
from app.services.wind_scope import (
    FIRST_DELIVERY_DATE,
    LAST_DELIVERY_DATE,
    earliest_forecast_publish_utc,
    uk_day_end_utc,
)
from config import logger


@dataclass(frozen=True)
class WindDataset:
    actuals: list[ActualGeneration]
    forecasts: list[ForecastGeneration]


_cached_dataset: WindDataset | None = None
_load_lock = asyncio.Lock()


async def get_wind_dataset() -> WindDataset:
    """January 2026 is historical, so the data is fetched once per process."""
    global _cached_dataset
    async with _load_lock:
        if _cached_dataset is None:
            _cached_dataset = await _load_wind_dataset()
    return _cached_dataset


async def _load_wind_dataset() -> WindDataset:
    actuals, forecasts = await asyncio.gather(
        elexon.fetch_wind_actuals(FIRST_DELIVERY_DATE, LAST_DELIVERY_DATE),
        elexon.fetch_wind_forecasts(
            earliest_forecast_publish_utc(), uk_day_end_utc(LAST_DELIVERY_DATE)
        ),
    )
    logger.info(
        "Loaded %d wind actuals and %d forecast rows", len(actuals), len(forecasts)
    )
    return WindDataset(actuals=actuals, forecasts=forecasts)
