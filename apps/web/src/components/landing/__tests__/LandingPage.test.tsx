import { render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { queryState, sampleMetrics } from "@/components/wind/__tests__/wind-fixtures";
import { useWindBestCaseMetrics, useWindComparison } from "@/queries";
import { LandingPage } from "../LandingPage";

vi.mock("@/queries", () => ({
	useWindComparison: vi.fn(),
	useWindBestCaseMetrics: vi.fn(),
}));

describe("LandingPage", () => {
	beforeEach(() => {
		vi.mocked(useWindBestCaseMetrics).mockReturnValue(
			queryState({
				data: { ...sampleMetrics, mean_absolute_error_mw: 1900, bias_mw: 900 },
			}),
		);
		vi.mocked(useWindComparison).mockReturnValue(
			queryState({ data: { points: [], metrics: sampleMetrics } }),
		);
	});

	it("explains the tool and sends visitors to the dashboard", () => {
		render(<LandingPage />);

		expect(
			screen.getByRole("heading", {
				name: "Know how far to trust the wind forecast before you buy electricity",
			}),
		).toBeTruthy();
		expect(
			screen.getByRole("link", { name: "Open the dashboard" }).getAttribute("href"),
		).toBe("/overview");
		expect(
			screen.getByRole("link", { name: /See the results/ }).getAttribute("href"),
		).toBe("/overview");
	});

	it("shows the live headline numbers for the default view", () => {
		render(<LandingPage />);

		expect(useWindComparison).toHaveBeenCalledWith({
			startDate: "2026-01-02",
			endDate: "2026-02-01",
			horizonHours: 24,
		});
		expect(screen.getByText("1,932 MW")).toBeTruthy();
		expect(screen.getByText("Safety buffer")).toBeTruthy();
	});

	it("colours numbers green near the best case and red when much worse", () => {
		render(<LandingPage />);

		expect(screen.getByText("1,932 MW").className).toContain("text-emerald-600");
		expect(screen.getByText("+1,736 MW").className).toContain("text-destructive");
		expect(screen.getByText("Best case: 1,900 MW")).toBeTruthy();
		expect(screen.getByText(/Green = within 10% of the best case/)).toBeTruthy();
	});

	it("shows the error message when the data cannot load", () => {
		vi.mocked(useWindComparison).mockReturnValue(
			queryState({ error: new Error("Elexon is down") }),
		);

		render(<LandingPage />);

		expect(screen.getByText("Elexon is down")).toBeTruthy();
	});

	it("links to all four pages", () => {
		render(<LandingPage />);

		for (const href of ["/overview", "/explorer", "/accuracy", "/how-it-works"]) {
			expect(
				screen.getAllByRole("link").some((link) => link.getAttribute("href") === href),
			).toBe(true);
		}
	});
});

describe("HeroAnimationView", () => {
	it("shows an animated scene with a still copy for reduced motion", async () => {
		const { HeroAnimationView } = await import("../HeroAnimation.view");
		const { container } = render(<HeroAnimationView />);

		const scenes = container.querySelectorAll("svg[role='img']");
		expect(scenes).toHaveLength(2);
		expect(scenes[0].querySelectorAll("animateTransform")).toHaveLength(3);
		expect(scenes[1].querySelector("animate, animateTransform")).toBeNull();
		expect(screen.getAllByText("Forecast too high")).toHaveLength(2);
	});
});
