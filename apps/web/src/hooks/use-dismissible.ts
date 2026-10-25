"use client";

import { useCallback, useSyncExternalStore } from "react";

const DISMISSED = "dismissed";
const listeners = new Set<() => void>();
const dismissedThisVisit = new Set<string>();

function subscribe(onChange: () => void) {
	listeners.add(onChange);
	window.addEventListener("storage", onChange);
	return () => {
		listeners.delete(onChange);
		window.removeEventListener("storage", onChange);
	};
}

function readIsDismissed(storageKey: string): boolean {
	if (dismissedThisVisit.has(storageKey)) return true;
	try {
		return window.localStorage.getItem(storageKey) === DISMISSED;
	} catch {
		return false;
	}
}

/** Hidden during server render so the banner never flashes for returning visitors. */
export function useDismissible(storageKey: string) {
	const isDismissed = useSyncExternalStore(
		subscribe,
		() => readIsDismissed(storageKey),
		() => true,
	);

	const dismiss = useCallback(() => {
		dismissedThisVisit.add(storageKey);
		try {
			window.localStorage.setItem(storageKey, DISMISSED);
		} catch {
			// Storage can be blocked (private mode); it then stays closed for this visit only.
		}
		for (const notify of listeners) notify();
	}, [storageKey]);

	return { isDismissed, dismiss };
}
