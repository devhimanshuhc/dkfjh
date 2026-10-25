from datetime import date
from typing import Annotated

from fastapi import APIRouter, HTTPException, Query

from app.models.wind import (
    AccuracyBreakdownResponse,
    AccuracyByHorizonResponse,
    ComparisonResponse,
    DailySummaryResponse,
)
from app.services import wind_report
from app.services.wind_scope import (
    DEFAULT_HORIZON_HOURS,
    FIRST_DELIVERY_DATE,
    LAST_DELIVERY_DATE,
    MAX_HORIZON_HOURS,
)

router = APIRouter(prefix="/api/wind", tags=["wind"])

StartDate = Annotated[date, Query(description="First delivery day (UK)")]
EndDate = Annotated[date, Query(description="Last delivery day (UK), inclusive")]
HorizonHours = Annotated[
    int,
    Query(
        ge=0,
        le=MAX_HORIZON_HOURS,
        description="Use the latest forecast published at least this many hours "
        "before each target time",
    ),
]


@router.get("/comparison", response_model=ComparisonResponse)
async def get_comparison(
    start_date: StartDate = FIRST_DELIVERY_DATE,
    end_date: EndDate = LAST_DELIVERY_DATE,
    horizon_hours: HorizonHours = DEFAULT_HORIZON_HOURS,
) -> ComparisonResponse:
    _ensure_valid_delivery_range(start_date, end_date)
    return await wind_report.get_comparison_report(start_date, end_date, horizon_hours)


@router.get("/accuracy-by-horizon", response_model=AccuracyByHorizonResponse)
async def get_accuracy_by_horizon(
    start_date: StartDate = FIRST_DELIVERY_DATE,
    end_date: EndDate = LAST_DELIVERY_DATE,
) -> AccuracyByHorizonResponse:
    _ensure_valid_delivery_range(start_date, end_date)
    return await wind_report.get_accuracy_by_horizon_report(start_date, end_date)


@router.get("/daily-summary", response_model=DailySummaryResponse)
async def get_daily_summary(
    start_date: StartDate = FIRST_DELIVERY_DATE,
    end_date: EndDate = LAST_DELIVERY_DATE,
    horizon_hours: HorizonHours = DEFAULT_HORIZON_HOURS,
) -> DailySummaryResponse:
    _ensure_valid_delivery_range(start_date, end_date)
    return await wind_report.get_daily_summary_report(
        start_date, end_date, horizon_hours
    )


@router.get("/accuracy-breakdown", response_model=AccuracyBreakdownResponse)
async def get_accuracy_breakdown(
    start_date: StartDate = FIRST_DELIVERY_DATE,
    end_date: EndDate = LAST_DELIVERY_DATE,
    horizon_hours: HorizonHours = DEFAULT_HORIZON_HOURS,
) -> AccuracyBreakdownResponse:
    _ensure_valid_delivery_range(start_date, end_date)
    return await wind_report.get_accuracy_breakdown_report(
        start_date, end_date, horizon_hours
    )


def _ensure_valid_delivery_range(start_date: date, end_date: date) -> None:
    if start_date > end_date:
        raise HTTPException(400, "start_date must be on or before end_date")
    if start_date < FIRST_DELIVERY_DATE or end_date > LAST_DELIVERY_DATE:
        raise HTTPException(
            400,
            f"Dates must be between {FIRST_DELIVERY_DATE} and {LAST_DELIVERY_DATE}",
        )
