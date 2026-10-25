import "@/components/wind/__tests__/test-setup";
import { render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import {
	queryState,
	sampleDay,
	sampleMetrics,
} from "@/components/wind/__tests__/wind-fixtures";
import { useWindComparison, useWindDailySummary } from "@/queries";
import { OverviewDashboard } from "../OverviewDashboard";

vi.mock("@/queries", () => ({
	useWindComparison: vi.fn(),
	useWindDailySummary: vi.fn(),
	useWindBestCaseMetrics: vi.fn(() => ({ data: null })),
}));

describe("OverviewDashboard", () => {
	beforeEach(() => {
		vi.mocked(useWindDailySummary).mockReturnValue(
			queryState({ data: { days: [sampleDay] } }),
		);
	});

	it("leads with the key takeaway and three headline numbers", () => {
		vi.mocked(useWindComparison).mockReturnValue(
			queryState({ data: { points: [], metrics: sampleMetrics } }),
		);

		render(<OverviewDashboard />);

		expect(screen.getByText(/promised too much wind/)).toBeTruthy();
		expect(screen.getByText("Average error")).toBeTruthy();
		expect(screen.getByText("Safety buffer")).toBeTruthy();
		expect(screen.getByText("Too high or too low?")).toBeTruthy();
		expect(screen.queryByText("Big-mistake score")).toBeNull();
	});

	it("uses the full window at the default lead time", () => {
		vi.mocked(useWindComparison).mockReturnValue(queryState({ isLoading: true }));

		render(<OverviewDashboard />);

		expect(useWindComparison).toHaveBeenCalledWith({
			startDate: "2026-01-02",
			endDate: "2026-02-01",
			horizonHours: 24,
		});
	});

	it("shows errors from the API", () => {
		vi.mocked(useWindComparison).mockReturnValue(
			queryState({ error: new Error("Elexon is down") }),
		);

		render(<OverviewDashboard />);

		expect(screen.getByText("Elexon is down")).toBeTruthy();
	});

	it("links to the detailed pages", () => {
		vi.mocked(useWindComparison).mockReturnValue(queryState({ isLoading: true }));

		render(<OverviewDashboard />);

		expect(screen.getByRole("link", { name: /Forecast vs Actual/ }).getAttribute("href")).toBe(
			"/explorer",
		);
		expect(screen.getByRole("link", { name: /How it works/ }).getAttribute("href")).toBe(
			"/how-it-works",
		);
	});
});
