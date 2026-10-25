import "@/components/wind/__tests__/test-setup";
import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import {
	defaultFilters,
	queryState,
	sampleDay,
	sampleMetrics,
	samplePoint,
} from "@/components/wind/__tests__/wind-fixtures";
import { useWindComparison, useWindDailySummary } from "@/queries";
import { ComparisonSection } from "../ComparisonSection";
import { DailyBreakdownSection } from "../DailyBreakdownSection";

vi.mock("@/queries", () => ({
	useWindComparison: vi.fn(),
	useWindDailySummary: vi.fn(),
}));

describe("ComparisonSection", () => {
	it("describes the selected lead time and the bias", () => {
		vi.mocked(useWindComparison).mockReturnValue(
			queryState({ data: { points: [samplePoint], metrics: sampleMetrics } }),
		);

		render(<ComparisonSection filters={defaultFilters} />);

		expect(screen.getByText(/already existed 24 hours earlier/)).toBeTruthy();
		expect(screen.getByText(/1,736 MW too high/)).toBeTruthy();
		expect(screen.getByText("How far off was the forecast each hour?")).toBeTruthy();
	});

	it("shows the empty state when no forecast matches", () => {
		vi.mocked(useWindComparison).mockReturnValue(
			queryState({ data: { points: [], metrics: null } }),
		);

		render(<ComparisonSection filters={defaultFilters} />);

		expect(screen.getByText("No data to show")).toBeTruthy();
	});
});

describe("DailyBreakdownSection", () => {
	it("lists each day and opens a day when asked", () => {
		const onSelectDay = vi.fn();
		vi.mocked(useWindDailySummary).mockReturnValue(
			queryState({ data: { days: [sampleDay] } }),
		);

		render(
			<DailyBreakdownSection filters={defaultFilters} onSelectDay={onSelectDay} />,
		);

		expect(screen.getByText("Fri 2 Jan")).toBeTruthy();
		expect(screen.getByText("+4,390 MW at 22:00")).toBeTruthy();
		fireEvent.click(screen.getByRole("button", { name: "See this day" }));
		expect(onSelectDay).toHaveBeenCalledWith("2026-01-02");
	});

	it("shows a dash for days without forecasts", () => {
		vi.mocked(useWindDailySummary).mockReturnValue(
			queryState({
				data: {
					days: [
						{
							...sampleDay,
							mean_forecast_mw: null,
							mean_absolute_error_mw: null,
							worst_error_mw: null,
							worst_error_at: null,
						},
					],
				},
			}),
		);

		render(<DailyBreakdownSection filters={defaultFilters} onSelectDay={vi.fn()} />);

		expect(screen.getAllByText("–").length).toBe(3);
	});
});
