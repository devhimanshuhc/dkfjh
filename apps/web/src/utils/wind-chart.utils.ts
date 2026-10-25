import type {
	ComparisonPoint,
	DailySummary,
	ErrorBin,
	HorizonAccuracy,
	HourOfDayAccuracy,
} from "@/types";
import { formatHourOfDay, formatMegawatts } from "./wind-format.utils";

export type ComparisonChartRow = {
	time: number;
	actual: number | null;
	forecast: number | null;
	error: number | null;
	publishedAt: string | null;
};

export function toComparisonChartRows(
	points: ComparisonPoint[],
): ComparisonChartRow[] {
	return points.map((point) => ({
		time: new Date(point.start_time).getTime(),
		actual: point.actual_mw,
		forecast: point.forecast_mw,
		error: point.error_mw,
		publishedAt: point.forecast_published_at,
	}));
}

export type ErrorOverTimeRow = {
	time: number;
	overForecast: number | null;
	underForecast: number | null;
};

export function toErrorOverTimeRows(
	points: ComparisonPoint[],
): ErrorOverTimeRow[] {
	return points.map(({ start_time, error_mw }) => ({
		time: new Date(start_time).getTime(),
		overForecast: error_mw !== null && error_mw > 0 ? error_mw : null,
		underForecast: error_mw !== null && error_mw < 0 ? error_mw : null,
	}));
}

export type DailyChartRow = {
	date: string;
	actual: number | null;
	forecast: number | null;
};

export function toDailyChartRows(days: DailySummary[]): DailyChartRow[] {
	return days.map((day) => ({
		date: day.delivery_date,
		actual: day.mean_actual_mw,
		forecast: day.mean_forecast_mw,
	}));
}

export type ErrorBinRow = {
	label: string;
	lowerMw: number;
	overForecastHours: number;
	underForecastHours: number;
};

export function toErrorBinRows(bins: ErrorBin[]): ErrorBinRow[] {
	return bins.map((bin) => ({
		label: `${formatMegawatts(bin.lower_mw).replace(" MW", "")} to ${formatMegawatts(bin.upper_mw)}`,
		lowerMw: bin.lower_mw,
		overForecastHours: bin.lower_mw >= 0 ? bin.hour_count : 0,
		underForecastHours: bin.lower_mw < 0 ? bin.hour_count : 0,
	}));
}

export type HourOfDayRow = {
	hour: string;
	typicalMiss: number;
};

export function toHourOfDayRows(hours: HourOfDayAccuracy[]): HourOfDayRow[] {
	return hours.flatMap(({ hour_of_day, metrics }) =>
		metrics
			? [
					{
						hour: formatHourOfDay(hour_of_day),
						typicalMiss: metrics.mean_absolute_error_mw,
					},
				]
			: [],
	);
}

export type HorizonChartRow = {
	horizonHours: number;
	typicalMiss: number;
	planningMargin: number;
};

export function toHorizonChartRows(
	horizons: HorizonAccuracy[],
): HorizonChartRow[] {
	return horizons.flatMap(({ horizon_hours, metrics }) =>
		metrics
			? [
					{
						horizonHours: horizon_hours,
						typicalMiss: metrics.mean_absolute_error_mw,
						planningMargin: metrics.absolute_error_p90_mw,
					},
				]
			: [],
	);
}
