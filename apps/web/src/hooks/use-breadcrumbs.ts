"use client";

import { usePathname } from "next/navigation";
import { useBreadcrumbContext } from "@/contexts/breadcrumb-context";

export type BreadcrumbSegment = {
	label: string;
	href: string;
	isLast: boolean;
	isLoading: boolean;
};

function isDynamicId(segment: string): boolean {
	if (
		/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(
			segment,
		)
	)
		return true;
	if (/^\d+$/.test(segment)) return true;
	if (/^[a-zA-Z0-9_-]{12,}$/.test(segment) && !/^[a-z-]+$/.test(segment))
		return true;
	return false;
}

function formatSegment(segment: string): string {
	return segment
		.replace(/([a-z])([A-Z])/g, "$1 $2")
		.replace(/[-_]/g, " ")
		.replace(/\b\w/g, (c) => c.toUpperCase())
		.trim();
}

export function useBreadcrumbs(appName: string): BreadcrumbSegment[] {
	const pathname = usePathname();
	const { registry } = useBreadcrumbContext();

	const rawSegments = pathname.split("/").filter(Boolean);

	const segments: BreadcrumbSegment[] = [
		{
			label: appName,
			href: "/",
			isLast: rawSegments.length === 0,
			isLoading: false,
		},
	];

	let accumulatedPath = "";

	rawSegments.forEach((segment, index) => {
		accumulatedPath += `/${segment}`;
		const key = segment.toLowerCase();
		const resolvedLabel = registry.get(key);
		const dynamic = isDynamicId(segment);

		segments.push({
			label: resolvedLabel ?? formatSegment(segment),
			href: accumulatedPath,
			isLast: index === rawSegments.length - 1,
			isLoading: dynamic && !resolvedLabel,
		});
	});

	return segments;
}
