import { fireEvent, render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it } from "vitest";
import { WelcomeBanner } from "../WelcomeBanner";

describe("WelcomeBanner", () => {
	beforeEach(() => window.localStorage.clear());

	it("introduces the tool and points to the starting pages", () => {
		render(<WelcomeBanner />);

		expect(screen.getByText("New here?")).toBeTruthy();
		expect(screen.getByRole("link", { name: "Overview" }).getAttribute("href")).toBe("/overview");
		expect(screen.getByRole("link", { name: "How it works" }).getAttribute("href")).toBe(
			"/how-it-works",
		);
	});

	it("stays hidden once dismissed", () => {
		const { unmount } = render(<WelcomeBanner />);

		fireEvent.click(screen.getByRole("button", { name: "Dismiss welcome message" }));

		expect(screen.queryByText("New here?")).toBeNull();
		unmount();
		render(<WelcomeBanner />);
		expect(screen.queryByText("New here?")).toBeNull();
	});
});
