import { describe, expect, it } from "vitest";
import { sampleMetrics } from "@/components/wind/__tests__/wind-fixtures";
import { buildAccuracySummaryItems } from "../accuracy-summary.utils";
import { rateAgainstBestCase } from "../metric-rating.utils";

const toneByTerm = (bestCase: typeof sampleMetrics | null) =>
	Object.fromEntries(
		rateAgainstBestCase(
			buildAccuracySummaryItems(sampleMetrics),
			sampleMetrics,
			bestCase,
		).map((item) => [item.glossaryTerm, item.tone]),
	);

describe("rateAgainstBestCase", () => {
	it("marks every metric good when it matches the best case", () => {
		expect(Object.values(toneByTerm(sampleMetrics))).toEqual(
			Array(5).fill("good"),
		);
	});

	it("allows up to 10% worse than the best case before turning red", () => {
		const tones = toneByTerm({
			...sampleMetrics,
			mean_absolute_error_mw: sampleMetrics.mean_absolute_error_mw / 1.1,
			absolute_error_p90_mw: sampleMetrics.absolute_error_p90_mw / 1.2,
		});

		expect(tones.mae).toBe("good");
		expect(tones.planningMargin).toBe("bad");
	});

	it("judges the lean by its size, whichever direction it goes", () => {
		expect(toneByTerm({ ...sampleMetrics, bias_mw: -1736 }).bias).toBe("good");
		expect(toneByTerm({ ...sampleMetrics, bias_mw: 500 }).bias).toBe("bad");
	});

	it("judges the usual range by how wide it is", () => {
		expect(
			toneByTerm({ ...sampleMetrics, error_p10_mw: 0, error_p90_mw: 2000 })
				.errorRange,
		).toBe("bad");
	});

	it("shows the best-case value next to each metric", () => {
		const [averageError] = rateAgainstBestCase(
			buildAccuracySummaryItems(sampleMetrics),
			sampleMetrics,
			{ ...sampleMetrics, mean_absolute_error_mw: 1685 },
		);

		expect(averageError.bestCaseValue).toBe("1,685 MW");
	});

	it("leaves metrics uncoloured until the best case has loaded", () => {
		expect(Object.values(toneByTerm(null))).toEqual(Array(5).fill(undefined));
	});
});
