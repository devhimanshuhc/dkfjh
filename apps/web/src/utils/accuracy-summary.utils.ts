import { GLOSSARY, type GlossaryTerm } from "@/constants";
import type { ErrorMetrics } from "@/types";
import {
	formatMegawatts,
	formatPercentOf,
	formatSignedMegawatts,
} from "./wind-format.utils";

export type MetricTone = "good" | "bad";

export type AccuracySummaryItem = {
	glossaryTerm: GlossaryTerm;
	label: string;
	value: string;
	explanation: string;
	tone?: MetricTone;
	bestCaseValue?: string;
};

const item = (
	glossaryTerm: GlossaryTerm,
	value: string,
	explanation: string,
): AccuracySummaryItem => ({
	glossaryTerm,
	label: GLOSSARY[glossaryTerm].term,
	value,
	explanation,
});

export function buildAccuracySummaryItems(
	metrics: ErrorMetrics,
): AccuracySummaryItem[] {
	return [
		item(
			"mae",
			formatMegawatts(metrics.mean_absolute_error_mw),
			`In an average hour, the forecast was off by this much. That is ${formatPercentOf(metrics.mean_absolute_error_mw, metrics.mean_actual_mw)} of the wind power actually produced.`,
		),
		item(
			"planningMargin",
			formatMegawatts(metrics.absolute_error_p90_mw),
			"In 9 out of 10 hours the error was smaller than this. Keeping this much backup would have covered you most of the time.",
		),
		item(
			"bias",
			formatSignedMegawatts(metrics.bias_mw),
			describeBias(metrics.bias_mw),
		),
		item(
			"rmse",
			formatMegawatts(metrics.root_mean_square_error_mw),
			"Like the average error, but big mistakes count extra. The more it is above the average error, the more often very big mistakes happened.",
		),
		item(
			"errorRange",
			`${formatSignedMegawatts(metrics.error_p10_mw)} to ${formatSignedMegawatts(metrics.error_p90_mw)}`,
			"In 8 out of 10 hours, the error was inside this range. Minus = forecast too low, plus = forecast too high.",
		),
	];
}

export function buildHeadlineItems(
	metrics: ErrorMetrics,
): AccuracySummaryItem[] {
	return [
		item(
			"mae",
			formatMegawatts(metrics.mean_absolute_error_mw),
			`Off by this in a typical hour (${formatPercentOf(metrics.mean_absolute_error_mw, metrics.mean_actual_mw)} of wind produced)`,
		),
		item(
			"planningMargin",
			formatMegawatts(metrics.absolute_error_p90_mw),
			"Backup that covers 9 in 10 hours",
		),
		item(
			"bias",
			formatSignedMegawatts(metrics.bias_mw),
			describeBiasBriefly(metrics.bias_mw),
		),
	];
}

function describeBiasBriefly(biasMegawatts: number): string {
	if (biasMegawatts > 0) return "Forecast usually too high";
	if (biasMegawatts < 0) return "Forecast usually too low";
	return "No usual direction";
}

export function describeBias(biasMegawatts: number): string {
	if (biasMegawatts > 0) {
		return `On average the forecast was ${formatMegawatts(biasMegawatts)} too high: less wind came than promised, so buyers relying on it would usually have been short of electricity.`;
	}
	if (biasMegawatts < 0) {
		return `On average the forecast was ${formatMegawatts(-biasMegawatts)} too low: more wind came than promised, so buyers relying on it would usually have bought more than needed.`;
	}
	return "The forecast was not usually too high or too low — its errors balanced out.";
}
