import { describe, expect, it } from "vitest";
import {
	sampleDay,
	sampleMetrics,
	samplePoint,
} from "@/components/wind/__tests__/wind-fixtures";
import {
	toComparisonChartRows,
	toDailyChartRows,
	toErrorBinRows,
	toErrorOverTimeRows,
	toHorizonChartRows,
	toHourOfDayRows,
} from "../wind-chart.utils";

describe("chart rows", () => {
	it("maps comparison points to epoch time with forecast details", () => {
		expect(toComparisonChartRows([samplePoint])).toEqual([
			{
				time: Date.UTC(2026, 0, 2),
				actual: 15228,
				forecast: 19162,
				error: 3934,
				publishedAt: "2025-12-31T22:30:00Z",
			},
		]);
	});

	it("splits errors into over- and under-forecast series", () => {
		const rows = toErrorOverTimeRows([
			samplePoint,
			{ ...samplePoint, error_mw: -200 },
			{ ...samplePoint, error_mw: null },
		]);

		expect(rows.map(({ overForecast, underForecast }) => [overForecast, underForecast])).toEqual([
			[3934, null],
			[null, -200],
			[null, null],
		]);
	});

	it("maps daily summaries to daily averages", () => {
		expect(toDailyChartRows([sampleDay])).toEqual([
			{ date: "2026-01-02", actual: 15208.6, forecast: 18393.3 },
		]);
	});

	it("colours error bins by whether the forecast was too high or low", () => {
		const rows = toErrorBinRows([
			{ lower_mw: -500, upper_mw: 0, hour_count: 3 },
			{ lower_mw: 0, upper_mw: 500, hour_count: 7 },
		]);

		expect(rows).toEqual([
			{ label: "-500 to 0 MW", lowerMw: -500, overForecastHours: 0, underForecastHours: 3 },
			{ label: "0 to 500 MW", lowerMw: 0, overForecastHours: 7, underForecastHours: 0 },
		]);
	});

	it("drops hours and horizons without metrics", () => {
		expect(
			toHourOfDayRows([
				{ hour_of_day: 5, metrics: sampleMetrics },
				{ hour_of_day: 6, metrics: null },
			]),
		).toEqual([{ hour: "05:00", typicalMiss: 1932.2 }]);
		expect(
			toHorizonChartRows([
				{ horizon_hours: 1, metrics: sampleMetrics },
				{ horizon_hours: 66, metrics: null },
			]),
		).toEqual([{ horizonHours: 1, typicalMiss: 1932.2, planningMargin: 3849.8 }]);
	});
});
