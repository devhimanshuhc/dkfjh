import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { defaultFilters } from "@/components/wind/__tests__/wind-fixtures";
import { AccuracyDashboard } from "../AccuracyDashboard";

vi.mock("@/hooks", () => ({
	useWindFilters: () => ({ filters: defaultFilters, updateFilters: vi.fn() }),
}));
vi.mock("../AccuracySummarySection", () => ({
	AccuracySummarySection: () => <div>summary</div>,
}));
vi.mock("../ErrorDistributionSection", () => ({
	ErrorDistributionSection: () => <div>distribution</div>,
}));
vi.mock("../HorizonAccuracySection", () => ({
	HorizonAccuracySection: () => <div>horizon</div>,
}));
vi.mock("../HourOfDaySection", () => ({
	HourOfDaySection: () => <div>hour of day</div>,
}));

describe("AccuracyDashboard", () => {
	it("renders the filters and all four accuracy sections", () => {
		render(<AccuracyDashboard />);

		expect(screen.getByLabelText("Use forecasts made at least")).toBeTruthy();
		for (const name of ["summary", "distribution", "horizon", "hour of day"]) {
			expect(screen.getByText(name)).toBeTruthy();
		}
	});
});
