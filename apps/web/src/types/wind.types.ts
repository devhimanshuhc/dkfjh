export type ComparisonPoint = {
	start_time: string;
	actual_mw: number | null;
	forecast_mw: number | null;
	forecast_published_at: string | null;
	error_mw: number | null;
};

export type ErrorMetrics = {
	sample_count: number;
	mean_absolute_error_mw: number;
	root_mean_square_error_mw: number;
	bias_mw: number;
	error_p10_mw: number;
	error_p50_mw: number;
	error_p90_mw: number;
	absolute_error_p90_mw: number;
	mean_actual_mw: number;
};

export type ComparisonResponse = {
	start_date: string;
	end_date: string;
	horizon_hours: number;
	points: ComparisonPoint[];
	metrics: ErrorMetrics | null;
};

export type HorizonAccuracy = {
	horizon_hours: number;
	metrics: ErrorMetrics | null;
};

export type AccuracyByHorizonResponse = {
	start_date: string;
	end_date: string;
	horizons: HorizonAccuracy[];
};

export type WindFilters = {
	startDate: string;
	endDate: string;
	horizonHours: number;
};

export type DailySummary = {
	delivery_date: string;
	mean_actual_mw: number | null;
	mean_forecast_mw: number | null;
	mean_absolute_error_mw: number | null;
	bias_mw: number | null;
	worst_error_mw: number | null;
	worst_error_at: string | null;
	sample_count: number;
};

export type DailySummaryResponse = {
	start_date: string;
	end_date: string;
	horizon_hours: number;
	days: DailySummary[];
};

export type ErrorBin = {
	lower_mw: number;
	upper_mw: number;
	hour_count: number;
};

export type HourOfDayAccuracy = {
	hour_of_day: number;
	metrics: ErrorMetrics | null;
};

export type AccuracyBreakdownResponse = {
	start_date: string;
	end_date: string;
	horizon_hours: number;
	error_bin_width_mw: number;
	error_distribution: ErrorBin[];
	by_hour_of_day: HourOfDayAccuracy[];
};
