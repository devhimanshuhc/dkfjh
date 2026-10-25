from datetime import date, datetime

import httpx

from app.models.wind import ActualGeneration, ForecastGeneration
from config import config

REQUEST_TIMEOUT_SECONDS = 60


class ElexonUnavailableError(Exception):
    pass


async def _get_dataset_stream(dataset: str, params: dict[str, str]) -> list[dict]:
    url = f"{config.ELEXON_BASE_URL}/datasets/{dataset}/stream"
    try:
        async with httpx.AsyncClient(timeout=REQUEST_TIMEOUT_SECONDS) as client:
            response = await client.get(url, params=params)
            response.raise_for_status()
    except httpx.HTTPError as error:
        raise ElexonUnavailableError(f"Elexon {dataset} request failed") from error
    return response.json()


async def fetch_wind_actuals(
    first_settlement_date: date, last_settlement_date: date
) -> list[ActualGeneration]:
    rows = await _get_dataset_stream(
        "FUELHH",
        {
            "settlementDateFrom": first_settlement_date.isoformat(),
            "settlementDateTo": last_settlement_date.isoformat(),
            "fuelType": "WIND",
        },
    )
    return [
        ActualGeneration(start_time=row["startTime"], generation_mw=row["generation"])
        for row in rows
    ]


async def fetch_wind_forecasts(
    published_from: datetime, published_to: datetime
) -> list[ForecastGeneration]:
    # Without a publish range WINDFOR returns only the latest run.
    rows = await _get_dataset_stream(
        "WINDFOR",
        {
            "publishDateTimeFrom": published_from.isoformat(),
            "publishDateTimeTo": published_to.isoformat(),
        },
    )
    return [
        ForecastGeneration(
            publish_time=row["publishTime"],
            start_time=row["startTime"],
            generation_mw=row["generation"],
        )
        for row in rows
    ]
