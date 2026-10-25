import "@/components/wind/__tests__/test-setup";
import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import {
	defaultFilters,
	queryState,
	sampleMetrics,
} from "@/components/wind/__tests__/wind-fixtures";
import {
	useWindAccuracyBreakdown,
	useWindAccuracyByHorizon,
	useWindComparison,
} from "@/queries";
import { AccuracySummarySection } from "../AccuracySummarySection";
import { ErrorDistributionSection } from "../ErrorDistributionSection";
import { HorizonAccuracySection } from "../HorizonAccuracySection";
import { HourOfDaySection } from "../HourOfDaySection";

vi.mock("@/queries", () => ({
	useWindComparison: vi.fn(),
	useWindAccuracyBreakdown: vi.fn(),
	useWindAccuracyByHorizon: vi.fn(),
	useWindBestCaseMetrics: vi.fn(() => ({ data: undefined })),
}));

const breakdown = {
	error_distribution: [{ lower_mw: 0, upper_mw: 500, hour_count: 4 }],
	by_hour_of_day: [
		{ hour_of_day: 5, metrics: { ...sampleMetrics, mean_absolute_error_mw: 2400 } },
		{ hour_of_day: 16, metrics: { ...sampleMetrics, mean_absolute_error_mw: 1500 } },
	],
};

describe("AccuracySummarySection", () => {
	it("shows all five metrics with the sample size", () => {
		vi.mocked(useWindComparison).mockReturnValue(
			queryState({ data: { points: [], metrics: sampleMetrics } }),
		);

		render(<AccuracySummarySection filters={defaultFilters} />);

		expect(screen.getByText("Big-mistake score")).toBeTruthy();
		expect(screen.getByText(/Based on 744 hours/)).toBeTruthy();
	});
});

describe("ErrorDistributionSection", () => {
	it("charts the distribution", () => {
		vi.mocked(useWindAccuracyBreakdown).mockReturnValue(queryState({ data: breakdown }));

		const { container } = render(<ErrorDistributionSection filters={defaultFilters} />);

		expect(container.querySelector("[data-slot='chart']")).toBeTruthy();
	});

	it("shows the empty state without errors", () => {
		vi.mocked(useWindAccuracyBreakdown).mockReturnValue(
			queryState({ data: { error_distribution: [], by_hour_of_day: [] } }),
		);

		render(<ErrorDistributionSection filters={defaultFilters} />);

		expect(screen.getByText("No data to show")).toBeTruthy();
	});
});

describe("HourOfDaySection", () => {
	it("names the hardest and easiest hours", () => {
		vi.mocked(useWindAccuracyBreakdown).mockReturnValue(queryState({ data: breakdown }));

		render(<HourOfDaySection filters={defaultFilters} />);

		expect(screen.getByText(/least accurate around 05:00/)).toBeTruthy();
	});
});

describe("HorizonAccuracySection", () => {
	it("reads out how accuracy changes with lead time", () => {
		vi.mocked(useWindAccuracyByHorizon).mockReturnValue(
			queryState({
				data: {
					horizons: [
						{ horizon_hours: 1, metrics: { ...sampleMetrics, mean_absolute_error_mw: 1700 } },
						{ horizon_hours: 48, metrics: { ...sampleMetrics, mean_absolute_error_mw: 2300 } },
					],
				},
			}),
		);

		render(<HorizonAccuracySection filters={defaultFilters} />);

		expect(useWindAccuracyByHorizon).toHaveBeenCalledWith("2026-01-02", "2026-02-01");
		expect(screen.getByText(/1 hour before were off by 1,700 MW .* 48 hours before were off by 2,300 MW/)).toBeTruthy();
	});
});
