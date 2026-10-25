import { ApiClient } from "@/lib/api-client";
import type {
	AccuracyBreakdownResponse,
	AccuracyByHorizonResponse,
	ComparisonResponse,
	DailySummaryResponse,
	WindFilters,
} from "@/types";

const toQueryParams = ({ startDate, endDate, horizonHours }: WindFilters) => ({
	start_date: startDate,
	end_date: endDate,
	horizon_hours: horizonHours,
});

export class WindService {
	static getComparison(filters: WindFilters) {
		return ApiClient.get<ComparisonResponse>(
			"/api/wind/comparison",
			toQueryParams(filters),
		);
	}

	static getDailySummary(filters: WindFilters) {
		return ApiClient.get<DailySummaryResponse>(
			"/api/wind/daily-summary",
			toQueryParams(filters),
		);
	}

	static getAccuracyBreakdown(filters: WindFilters) {
		return ApiClient.get<AccuracyBreakdownResponse>(
			"/api/wind/accuracy-breakdown",
			toQueryParams(filters),
		);
	}

	static getAccuracyByHorizon({
		startDate,
		endDate,
	}: Pick<WindFilters, "startDate" | "endDate">) {
		return ApiClient.get<AccuracyByHorizonResponse>(
			"/api/wind/accuracy-by-horizon",
			{ start_date: startDate, end_date: endDate },
		);
	}
}
