import { describe, expect, it } from "vitest";
import { sampleMetrics } from "@/components/wind/__tests__/wind-fixtures";
import {
	buildAccuracySummaryItems,
	buildHeadlineItems,
} from "../accuracy-summary.utils";

const itemByLabel = (bias: number, label: string) =>
	buildAccuracySummaryItems({ ...sampleMetrics, bias_mw: bias }).find(
		(item) => item.label === label,
	);

describe("buildAccuracySummaryItems", () => {
	it("explains the average error as a share of wind produced", () => {
		const item = itemByLabel(0, "Average error");

		expect(item?.value).toBe("1,932 MW");
		expect(item?.explanation).toContain(
			"17% of the wind power actually produced",
		);
	});

	it("explains a positive bias as forecasts being too high", () => {
		const item = itemByLabel(500, "Too high or too low?");

		expect(item?.value).toBe("+500 MW");
		expect(item?.explanation).toContain("500 MW too high");
		expect(item?.explanation).toContain("short of electricity");
	});

	it("explains a negative bias as forecasts being too low", () => {
		expect(itemByLabel(-500, "Too high or too low?")?.explanation).toContain(
			"500 MW too low",
		);
	});

	it("says errors balanced out when there is no bias", () => {
		expect(itemByLabel(0, "Too high or too low?")?.explanation).toContain(
			"balanced out",
		);
	});

	it("shows the usual range of error", () => {
		expect(itemByLabel(0, "Usual range of error")?.value).toBe(
			"-288 MW to +3,850 MW",
		);
	});

	it("names every card in plain English", () => {
		expect(buildAccuracySummaryItems(sampleMetrics).map((item) => item.label)).toEqual([
			"Average error",
			"Safety buffer",
			"Too high or too low?",
			"Big-mistake score",
			"Usual range of error",
		]);
	});
});

describe("buildHeadlineItems", () => {
	it("gives the three headline numbers short captions", () => {
		expect(
			buildHeadlineItems(sampleMetrics).map(({ label, value, explanation }) => [
				label,
				value,
				explanation,
			]),
		).toEqual([
			["Average error", "1,932 MW", "Off by this in a typical hour (17% of wind produced)"],
			["Safety buffer", "3,850 MW", "Backup that covers 9 in 10 hours"],
			["Too high or too low?", "+1,736 MW", "Forecast usually too high"],
		]);
	});

	it("describes the direction briefly", () => {
		const captionFor = (bias: number) =>
			buildHeadlineItems({ ...sampleMetrics, bias_mw: bias })[2].explanation;

		expect(captionFor(-10)).toBe("Forecast usually too low");
		expect(captionFor(0)).toBe("No usual direction");
	});
});
