import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { GLOSSARY } from "@/constants";
import { HowItWorksView } from "../HowItWorks.view";

describe("HowItWorksView", () => {
	it("links to both Elexon datasets from the brief", () => {
		render(<HowItWorksView />);

		expect(
			screen.getByRole("link", { name: "What wind farms actually produced (FUELHH)" }).getAttribute("href"),
		).toContain("/datasets/FUELHH/stream");
		expect(
			screen.getByRole("link", { name: "Wind forecasts (WINDFOR)" }).getAttribute("href"),
		).toContain("/datasets/WINDFOR/stream");
	});

	it("defines every metric used on the site", () => {
		render(<HowItWorksView />);

		for (const { term } of Object.values(GLOSSARY)) {
			expect(screen.getByText(term)).toBeTruthy();
		}
	});

	it("walks through a real forecast selection example", () => {
		render(<HowItWorksView />);

		expect(screen.getByText(/it says 19,162 MW/)).toBeTruthy();
		expect(screen.getByText(/too late, the buyer could not have seen it/)).toBeTruthy();
	});
});
