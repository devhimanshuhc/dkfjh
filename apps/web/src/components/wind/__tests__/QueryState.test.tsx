import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { QueryStateView } from "../QueryState.view";

const renderState = (state: Partial<Parameters<typeof QueryStateView>[0]>) =>
	render(
		<QueryStateView
			isLoading={false}
			error={null}
			isEmpty={false}
			skeletonClassName="h-4"
			{...state}
		>
			<p>content</p>
		</QueryStateView>,
	);

describe("QueryStateView", () => {
	it("shows a skeleton while loading", () => {
		const { container } = renderState({ isLoading: true });

		expect(container.querySelector("[data-slot='skeleton']")).toBeTruthy();
		expect(screen.queryByText("content")).toBeNull();
	});

	it("shows the error message", () => {
		renderState({ error: new Error("Elexon is down") });

		expect(screen.getByText("Elexon is down")).toBeTruthy();
	});

	it("shows the empty state", () => {
		renderState({ isEmpty: true });

		expect(screen.getByText("No data to show")).toBeTruthy();
	});

	it("shows the content when ready", () => {
		renderState({});

		expect(screen.getByText("content")).toBeTruthy();
	});
});
