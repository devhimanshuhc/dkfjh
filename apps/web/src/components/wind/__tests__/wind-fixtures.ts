import type { ComparisonPoint, DailySummary, ErrorMetrics } from "@/types";

export const sampleMetrics: ErrorMetrics = {
	sample_count: 744,
	mean_absolute_error_mw: 1932.2,
	root_mean_square_error_mw: 2399.4,
	bias_mw: 1736.2,
	error_p10_mw: -287.9,
	error_p50_mw: 1608.5,
	error_p90_mw: 3849.8,
	absolute_error_p90_mw: 3849.8,
	mean_actual_mw: 11285.5,
};

export const samplePoint: ComparisonPoint = {
	start_time: "2026-01-02T00:00:00Z",
	actual_mw: 15228,
	forecast_mw: 19162,
	forecast_published_at: "2025-12-31T22:30:00Z",
	error_mw: 3934,
};

export const sampleDay: DailySummary = {
	delivery_date: "2026-01-02",
	mean_actual_mw: 15208.6,
	mean_forecast_mw: 18393.3,
	mean_absolute_error_mw: 3184.6,
	bias_mw: 3184.6,
	worst_error_mw: 4390,
	worst_error_at: "2026-01-02T22:00:00Z",
	sample_count: 24,
};

export const defaultFilters = {
	startDate: "2026-01-02",
	endDate: "2026-02-01",
	horizonHours: 24,
};

export const queryState = (state: Record<string, unknown>) =>
	({ isLoading: false, error: null, data: undefined, ...state }) as never;
