import { act, renderHook } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { useWindFilters } from "../use-wind-filters";

const replace = vi.fn();
let currentSearch = "";

vi.mock("next/navigation", () => ({
	usePathname: () => "/",
	useRouter: () => ({ replace }),
	useSearchParams: () => new URLSearchParams(currentSearch),
}));

describe("useWindFilters", () => {
	beforeEach(() => {
		replace.mockReset();
		currentSearch = "";
	});

	it("defaults to the full January window and a 24 h horizon", () => {
		const { result } = renderHook(() => useWindFilters());

		expect(result.current.filters).toEqual({
			startDate: "2026-01-02",
			endDate: "2026-02-01",
			horizonHours: 24,
		});
	});

	it("reads valid filters from the URL", () => {
		currentSearch = "start=2026-01-10&end=2026-01-12&horizon=4";

		const { result } = renderHook(() => useWindFilters());

		expect(result.current.filters).toEqual({
			startDate: "2026-01-10",
			endDate: "2026-01-12",
			horizonHours: 4,
		});
	});

	it("falls back to defaults for out-of-scope or malformed values", () => {
		currentSearch = "start=2025-12-01&end=nonsense&horizon=500";

		const { result } = renderHook(() => useWindFilters());

		expect(result.current.filters).toEqual({
			startDate: "2026-01-02",
			endDate: "2026-02-01",
			horizonHours: 24,
		});
	});

	it("moves the end date forward when the start date passes it", () => {
		currentSearch = "start=2026-01-20&end=2026-01-10";

		const { result } = renderHook(() => useWindFilters());

		expect(result.current.filters.endDate).toBe("2026-01-20");
	});

	it("writes changes to the URL without scrolling", () => {
		const { result } = renderHook(() => useWindFilters());

		act(() => result.current.updateFilters({ horizonHours: 8 }));

		expect(replace).toHaveBeenCalledWith(
			"/?start=2026-01-02&end=2026-02-01&horizon=8",
			{ scroll: false },
		);
	});
});
