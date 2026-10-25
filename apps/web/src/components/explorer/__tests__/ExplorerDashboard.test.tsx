import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { defaultFilters } from "@/components/wind/__tests__/wind-fixtures";
import { ExplorerDashboard } from "../ExplorerDashboard";

const updateFilters = vi.fn();

vi.mock("@/hooks", () => ({
	useWindFilters: () => ({ filters: defaultFilters, updateFilters }),
}));
vi.mock("../ComparisonSection", () => ({
	ComparisonSection: () => <div>comparison</div>,
}));
vi.mock("../DailyBreakdownSection", () => ({
	DailyBreakdownSection: ({
		onSelectDay,
	}: {
		onSelectDay: (date: string) => void;
	}) => (
		<button type="button" onClick={() => onSelectDay("2026-01-15")}>
			open day
		</button>
	),
}));

describe("ExplorerDashboard", () => {
	it("updates filters from the controls", () => {
		render(<ExplorerDashboard />);

		fireEvent.change(screen.getByLabelText("Use forecasts made at least"), {
			target: { value: "8" },
		});
		fireEvent.change(screen.getByLabelText("From"), {
			target: { value: "2026-01-10" },
		});
		fireEvent.change(screen.getByLabelText("To"), {
			target: { value: "2026-01-20" },
		});

		expect(updateFilters).toHaveBeenCalledWith({ horizonHours: 8 });
		expect(updateFilters).toHaveBeenCalledWith({ startDate: "2026-01-10" });
		expect(updateFilters).toHaveBeenCalledWith({ endDate: "2026-01-20" });
	});

	it("zooms to a single day picked from the daily table", () => {
		render(<ExplorerDashboard />);

		fireEvent.click(screen.getByRole("button", { name: "open day" }));

		expect(updateFilters).toHaveBeenCalledWith({
			startDate: "2026-01-15",
			endDate: "2026-01-15",
		});
	});
});
