export type GlossaryTerm =
	| "megawatt"
	| "horizon"
	| "error"
	| "mae"
	| "planningMargin"
	| "bias"
	| "rmse"
	| "errorRange";

export const GLOSSARY: Record<
	GlossaryTerm,
	{ term: string; definition: string }
> = {
	megawatt: {
		term: "MW (megawatts)",
		definition:
			"How much electricity is being produced at a moment. A bigger number means more wind power. All figures on this site are national totals for Great Britain.",
	},
	horizon: {
		term: "How early the forecast was made",
		definition:
			"Forecasts are updated several times a day. '24 hours' means: for each hour, we use the most recent forecast that was already available 24 hours before that hour — the one a buyer could actually have seen when buying the day before.",
	},
	error: {
		term: "Error",
		definition:
			"How far the forecast was from what actually happened: forecast minus actual. A positive number means the forecast was too high (less wind came than promised, so you would be short of electricity). A negative number means it was too low.",
	},
	mae: {
		term: "Average error",
		definition:
			"How far off the forecast was in an average hour, whether too high or too low.",
	},
	planningMargin: {
		term: "Safety buffer",
		definition:
			"In 9 out of 10 hours, the error was smaller than this. Keeping this much backup electricity would have covered you in most hours.",
	},
	bias: {
		term: "Too high or too low?",
		definition:
			"Whether forecasts usually leaned one way. A plus number means they were usually too high; a minus number means usually too low.",
	},
	rmse: {
		term: "Big-mistake score",
		definition:
			"Like the average error, but big mistakes count extra. If this is much higher than the average error, there were some very large mistakes.",
	},
	errorRange: {
		term: "Usual range of error",
		definition:
			"In 8 out of 10 hours, the error was somewhere inside this range. The other hours were more extreme.",
	},
};
