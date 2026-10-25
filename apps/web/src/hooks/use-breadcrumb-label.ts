"use client";

import { useEffect } from "react";
import { useBreadcrumbContext } from "@/contexts/breadcrumb-context";

/** Registers a readable breadcrumb label for a dynamic path segment.
 * Use: useBreadcrumbLabel(id, label) to show the label instead of the raw segment.
 */
export function useBreadcrumbLabel(
	id: string | undefined,
	label: string | undefined | null,
): void {
	const { registerLabel } = useBreadcrumbContext();

	useEffect(() => {
		if (id && label) {
			registerLabel(id, label);
		}
	}, [id, label, registerLabel]);
}
