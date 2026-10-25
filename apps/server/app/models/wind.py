from datetime import date, datetime

from pydantic import BaseModel


class ActualGeneration(BaseModel):
    start_time: datetime
    generation_mw: int


class ForecastGeneration(BaseModel):
    publish_time: datetime
    start_time: datetime
    generation_mw: int


class ComparisonPoint(BaseModel):
    start_time: datetime
    actual_mw: int | None
    forecast_mw: int | None
    forecast_published_at: datetime | None
    error_mw: int | None


class ErrorMetrics(BaseModel):
    sample_count: int
    mean_absolute_error_mw: float
    root_mean_square_error_mw: float
    bias_mw: float
    error_p10_mw: float
    error_p50_mw: float
    error_p90_mw: float
    absolute_error_p90_mw: float
    mean_actual_mw: float


class ComparisonResponse(BaseModel):
    start_date: date
    end_date: date
    horizon_hours: int
    points: list[ComparisonPoint]
    metrics: ErrorMetrics | None


class HorizonAccuracy(BaseModel):
    horizon_hours: int
    metrics: ErrorMetrics | None


class AccuracyByHorizonResponse(BaseModel):
    start_date: date
    end_date: date
    horizons: list[HorizonAccuracy]


class DailySummary(BaseModel):
    delivery_date: date
    mean_actual_mw: float | None
    mean_forecast_mw: float | None
    mean_absolute_error_mw: float | None
    bias_mw: float | None
    worst_error_mw: int | None
    worst_error_at: datetime | None
    sample_count: int


class DailySummaryResponse(BaseModel):
    start_date: date
    end_date: date
    horizon_hours: int
    days: list[DailySummary]


class ErrorBin(BaseModel):
    lower_mw: int
    upper_mw: int
    hour_count: int


class HourOfDayAccuracy(BaseModel):
    hour_of_day: int
    metrics: ErrorMetrics | None


class AccuracyBreakdownResponse(BaseModel):
    start_date: date
    end_date: date
    horizon_hours: int
    error_bin_width_mw: int
    error_distribution: list[ErrorBin]
    by_hour_of_day: list[HourOfDayAccuracy]
