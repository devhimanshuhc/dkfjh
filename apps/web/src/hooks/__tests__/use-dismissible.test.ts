import { act, renderHook } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { useDismissible } from "../use-dismissible";

describe("useDismissible", () => {
	beforeEach(() => window.localStorage.clear());

	it("is visible until dismissed, then remembers the choice", () => {
		const { result, unmount } = renderHook(() => useDismissible("banner"));
		expect(result.current.isDismissed).toBe(false);

		act(() => result.current.dismiss());

		expect(result.current.isDismissed).toBe(true);
		unmount();
		expect(renderHook(() => useDismissible("banner")).result.current.isDismissed).toBe(true);
	});

	it("still closes for this visit when storage is blocked", () => {
		const { result } = renderHook(() => useDismissible("blocked"));
		const setItem = vi
			.spyOn(Storage.prototype, "setItem")
			.mockImplementation(() => {
				throw new Error("blocked");
			});
		const getItem = vi
			.spyOn(Storage.prototype, "getItem")
			.mockImplementation(() => {
				throw new Error("blocked");
			});

		act(() => result.current.dismiss());

		expect(result.current.isDismissed).toBe(true);
		setItem.mockRestore();
		getItem.mockRestore();
	});
});
