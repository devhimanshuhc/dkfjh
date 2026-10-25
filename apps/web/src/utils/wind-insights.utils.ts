import type { ErrorMetrics, HorizonAccuracy, HourOfDayAccuracy } from "@/types";
import { formatHourOfDay, formatMegawatts } from "./wind-format.utils";

export type KeyTakeaway = {
	headline: string;
	detail: string;
};

export function buildKeyTakeaway(
	metrics: ErrorMetrics,
	horizonHours: number,
): KeyTakeaway {
	const detail = `Based on forecasts made ${horizonHours} hours ahead, for every hour from 2 Jan to 1 Feb 2026.`;

	if (metrics.bias_mw > 0) {
		return {
			headline:
				"Forecasts usually promised too much wind — buying on the forecast alone left you short.",
			detail,
		};
	}
	if (metrics.bias_mw < 0) {
		return {
			headline:
				"Forecasts usually promised too little wind — buying on the forecast alone meant buying too much.",
			detail,
		};
	}
	return {
		headline: "Forecasts were not usually too high or too low.",
		detail,
	};
}

export function describeLeadTimeTrend(
	horizons: HorizonAccuracy[],
): string | null {
	const measured = horizons.filter((horizon) => horizon.metrics !== null);
	const shortest = measured.at(0);
	const longest = measured.at(-1);
	if (!shortest?.metrics || !longest?.metrics || shortest === longest) {
		return null;
	}
	return `Forecasts made ${shortest.horizon_hours} hour${shortest.horizon_hours === 1 ? "" : "s"} before were off by ${formatMegawatts(shortest.metrics.mean_absolute_error_mw)} on average; forecasts made ${longest.horizon_hours} hours before were off by ${formatMegawatts(longest.metrics.mean_absolute_error_mw)}. The earlier the forecast, the bigger the error.`;
}

export function describeHourOfDayPattern(
	hours: HourOfDayAccuracy[],
): string | null {
	const measured = hours.flatMap(({ hour_of_day, metrics }) =>
		metrics
			? [{ hour: hour_of_day, error: metrics.mean_absolute_error_mw }]
			: [],
	);
	if (measured.length < 2) return null;

	const worst = measured.reduce((current, entry) =>
		entry.error > current.error ? entry : current,
	);
	const best = measured.reduce((current, entry) =>
		entry.error < current.error ? entry : current,
	);
	return `Forecasts were least accurate around ${formatHourOfDay(worst.hour)} (off by ${formatMegawatts(worst.error)} on average) and most accurate around ${formatHourOfDay(best.hour)} (off by ${formatMegawatts(best.error)}).`;
}
