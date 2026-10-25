import { BEST_CASE_TOLERANCE, type GlossaryTerm } from "@/constants";
import type { ErrorMetrics } from "@/types";
import {
	type AccuracySummaryItem,
	buildAccuracySummaryItems,
} from "./accuracy-summary.utils";

const COMPARABLE_MEASURES: Partial<
	Record<GlossaryTerm, (metrics: ErrorMetrics) => number>
> = {
	mae: (metrics) => metrics.mean_absolute_error_mw,
	planningMargin: (metrics) => metrics.absolute_error_p90_mw,
	bias: (metrics) => Math.abs(metrics.bias_mw),
	rmse: (metrics) => metrics.root_mean_square_error_mw,
	errorRange: (metrics) => metrics.error_p90_mw - metrics.error_p10_mw,
};

/** Colours each metric by how close it is to the most accurate forecasts available. */
export function rateAgainstBestCase(
	items: AccuracySummaryItem[],
	metrics: ErrorMetrics,
	bestCase: ErrorMetrics | null | undefined,
): AccuracySummaryItem[] {
	if (!bestCase) return items;

	const bestCaseValues = new Map(
		buildAccuracySummaryItems(bestCase).map((bestItem) => [
			bestItem.glossaryTerm,
			bestItem.value,
		]),
	);
	return items.map((item) => {
		const measure = COMPARABLE_MEASURES[item.glossaryTerm];
		if (!measure) return item;

		const isCloseToBestCase =
			measure(metrics) <= measure(bestCase) * (1 + BEST_CASE_TOLERANCE);
		return {
			...item,
			tone: isCloseToBestCase ? "good" : "bad",
			bestCaseValue: bestCaseValues.get(item.glossaryTerm),
		};
	});
}
