export const FIRST_DELIVERY_DATE = "2026-01-02";
export const LAST_DELIVERY_DATE = "2026-02-01";
export const DEFAULT_HORIZON_HOURS = 24;
export const MAX_HORIZON_HOURS = 66;
export const HORIZON_OPTIONS_HOURS = [1, 2, 4, 8, 12, 18, 24, 36, 48] as const;
export const UK_TIMEZONE = "Europe/London";

export const DEFAULT_WIND_FILTERS = {
	startDate: FIRST_DELIVERY_DATE,
	endDate: LAST_DELIVERY_DATE,
	horizonHours: DEFAULT_HORIZON_HOURS,
};

export const ROUTES = {
	landing: "/",
	overview: "/overview",
	explorer: "/explorer",
	accuracy: "/accuracy",
	howItWorks: "/how-it-works",
} as const;

export const BEST_CASE_HORIZON_HOURS = 1;
export const BEST_CASE_TOLERANCE = 0.1;
export const BEST_CASE_LEGEND = `Green = within ${BEST_CASE_TOLERANCE * 100}% of the best case (forecasts made ${BEST_CASE_HORIZON_HOURS} hour ahead). Red = more than ${BEST_CASE_TOLERANCE * 100}% worse.`;
