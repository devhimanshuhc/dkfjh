import { SidebarProvider } from "@repo/ui/components/sidebar";
import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { SidebarNav } from "../SidebarNav";

let currentSearch = "";

vi.mock("next/navigation", () => ({
	usePathname: () => "/accuracy",
	useSearchParams: () => new URLSearchParams(currentSearch),
}));

window.matchMedia = vi.fn().mockImplementation(() => ({
	matches: false,
	addEventListener: vi.fn(),
	removeEventListener: vi.fn(),
}));

const renderNav = () =>
	render(
		<SidebarProvider>
			<SidebarNav />
		</SidebarProvider>,
	);

const hrefOf = (name: string) =>
	screen.getByRole("link", { name }).getAttribute("href");

describe("SidebarNav", () => {
	it("lists the four pages", () => {
		currentSearch = "";
		renderNav();

		expect(hrefOf("Overview")).toBe("/overview");
		expect(hrefOf("Forecast vs Actual")).toBe("/explorer");
		expect(hrefOf("Forecast Accuracy")).toBe("/accuracy");
		expect(hrefOf("How it works")).toBe("/how-it-works");
	});

	it("carries the current filters to the pages that use them", () => {
		currentSearch = "start=2026-01-10&end=2026-01-12&horizon=4";
		renderNav();

		expect(hrefOf("Forecast vs Actual")).toBe(
			"/explorer?start=2026-01-10&end=2026-01-12&horizon=4",
		);
		expect(hrefOf("How it works")).toBe("/how-it-works");
	});
});
