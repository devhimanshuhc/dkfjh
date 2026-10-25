import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { SectionCardView } from "../SectionCard.view";

describe("chart reading hints", () => {
	it("keeps the explanation behind an info icon next to the chart title", async () => {
		render(
			<SectionCardView title="Forecast vs what actually happened" howToRead="Solid line = wind produced.">
				<p>chart</p>
			</SectionCardView>,
		);

		expect(screen.queryByText("Solid line = wind produced.")).toBeNull();

		fireEvent.click(screen.getByRole("button", { name: "How to read this chart" }));

		expect(await screen.findByText("Solid line = wind produced.")).toBeTruthy();
		expect(screen.getByText("How to read this chart")).toBeTruthy();
	});

	it("shows no icon when a section has nothing to explain", () => {
		render(
			<SectionCardView title="Day by day">
				<p>table</p>
			</SectionCardView>,
		);

		expect(screen.queryByRole("button", { name: "How to read this chart" })).toBeNull();
	});
});
