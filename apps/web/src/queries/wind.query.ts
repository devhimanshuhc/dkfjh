import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { BEST_CASE_HORIZON_HOURS } from "@/constants";
import { WindService } from "@/services";
import type { WindFilters } from "@/types";

export const WIND_KEYS = {
	comparison: (filters: WindFilters) =>
		["wind", "comparison", filters] as const,
	dailySummary: (filters: WindFilters) =>
		["wind", "daily-summary", filters] as const,
	accuracyBreakdown: (filters: WindFilters) =>
		["wind", "accuracy-breakdown", filters] as const,
	accuracyByHorizon: (startDate: string, endDate: string) =>
		["wind", "accuracy-by-horizon", startDate, endDate] as const,
};

export function useWindComparison(filters: WindFilters) {
	return useQuery({
		queryKey: WIND_KEYS.comparison(filters),
		queryFn: () => WindService.getComparison(filters),
		placeholderData: keepPreviousData,
	});
}

export function useWindDailySummary(filters: WindFilters) {
	return useQuery({
		queryKey: WIND_KEYS.dailySummary(filters),
		queryFn: () => WindService.getDailySummary(filters),
		placeholderData: keepPreviousData,
	});
}

export function useWindAccuracyBreakdown(filters: WindFilters) {
	return useQuery({
		queryKey: WIND_KEYS.accuracyBreakdown(filters),
		queryFn: () => WindService.getAccuracyBreakdown(filters),
		placeholderData: keepPreviousData,
	});
}

export function useWindBestCaseMetrics(startDate: string, endDate: string) {
	return useQuery({
		queryKey: WIND_KEYS.accuracyByHorizon(startDate, endDate),
		queryFn: () => WindService.getAccuracyByHorizon({ startDate, endDate }),
		select: (data) =>
			data.horizons.find(
				(horizon) => horizon.horizon_hours === BEST_CASE_HORIZON_HOURS,
			)?.metrics ?? null,
	});
}

export function useWindAccuracyByHorizon(startDate: string, endDate: string) {
	return useQuery({
		queryKey: WIND_KEYS.accuracyByHorizon(startDate, endDate),
		queryFn: () => WindService.getAccuracyByHorizon({ startDate, endDate }),
		placeholderData: keepPreviousData,
	});
}
