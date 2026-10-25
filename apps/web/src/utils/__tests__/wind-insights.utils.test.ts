import { describe, expect, it } from "vitest";
import { sampleMetrics } from "@/components/wind/__tests__/wind-fixtures";
import {
	buildKeyTakeaway,
	describeHourOfDayPattern,
	describeLeadTimeTrend,
} from "../wind-insights.utils";

describe("buildKeyTakeaway", () => {
	it("says buyers were short when forecasts promised too much wind", () => {
		const takeaway = buildKeyTakeaway(sampleMetrics, 24);

		expect(takeaway.headline).toBe(
			"Forecasts usually promised too much wind — buying on the forecast alone left you short.",
		);
		expect(takeaway.detail).toBe(
			"Based on forecasts made 24 hours ahead, for every hour from 2 Jan to 1 Feb 2026.",
		);
	});

	it("says buyers bought too much when forecasts promised too little wind", () => {
		expect(buildKeyTakeaway({ ...sampleMetrics, bias_mw: -900 }, 4).headline).toContain(
			"promised too little wind",
		);
	});

	it("says there was no usual direction when there is no bias", () => {
		expect(buildKeyTakeaway({ ...sampleMetrics, bias_mw: 0 }, 4).headline).toBe(
			"Forecasts were not usually too high or too low.",
		);
	});
});

describe("describeLeadTimeTrend", () => {
	it("compares the earliest and latest measured forecasts", () => {
		const sentence = describeLeadTimeTrend([
			{ horizon_hours: 1, metrics: { ...sampleMetrics, mean_absolute_error_mw: 1685 } },
			{ horizon_hours: 48, metrics: { ...sampleMetrics, mean_absolute_error_mw: 2301 } },
			{ horizon_hours: 66, metrics: null },
		]);

		expect(sentence).toBe(
			"Forecasts made 1 hour before were off by 1,685 MW on average; forecasts made 48 hours before were off by 2,301 MW. The earlier the forecast, the bigger the error.",
		);
	});

	it("returns nothing with fewer than two measured lead times", () => {
		expect(describeLeadTimeTrend([{ horizon_hours: 1, metrics: sampleMetrics }])).toBeNull();
	});
});

describe("describeHourOfDayPattern", () => {
	it("names the least and most accurate times of day", () => {
		const sentence = describeHourOfDayPattern([
			{ hour_of_day: 5, metrics: { ...sampleMetrics, mean_absolute_error_mw: 2381 } },
			{ hour_of_day: 16, metrics: { ...sampleMetrics, mean_absolute_error_mw: 1543 } },
			{ hour_of_day: 17, metrics: null },
		]);

		expect(sentence).toBe(
			"Forecasts were least accurate around 05:00 (off by 2,381 MW on average) and most accurate around 16:00 (off by 1,543 MW).",
		);
	});

	it("returns nothing without enough hours", () => {
		expect(describeHourOfDayPattern([])).toBeNull();
	});
});
