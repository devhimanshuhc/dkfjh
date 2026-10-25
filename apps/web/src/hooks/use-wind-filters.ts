"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCallback, useMemo } from "react";
import type { WindFilters } from "@/types";
import { windFiltersSchema } from "@/validations";

const SEARCH_PARAM_BY_FILTER: Record<keyof WindFilters, string> = {
	startDate: "start",
	endDate: "end",
	horizonHours: "horizon",
};

export function useWindFilters() {
	const searchParams = useSearchParams();
	const router = useRouter();
	const pathname = usePathname();

	const filters = useMemo(
		() =>
			windFiltersSchema.parse({
				startDate: searchParams.get(SEARCH_PARAM_BY_FILTER.startDate),
				endDate: searchParams.get(SEARCH_PARAM_BY_FILTER.endDate),
				horizonHours:
					searchParams.get(SEARCH_PARAM_BY_FILTER.horizonHours) ?? undefined,
			}),
		[searchParams],
	);

	const updateFilters = useCallback(
		(changes: Partial<WindFilters>) => {
			const next = windFiltersSchema.parse({ ...filters, ...changes });
			const params = new URLSearchParams({
				[SEARCH_PARAM_BY_FILTER.startDate]: next.startDate,
				[SEARCH_PARAM_BY_FILTER.endDate]: next.endDate,
				[SEARCH_PARAM_BY_FILTER.horizonHours]: String(next.horizonHours),
			});
			router.replace(`${pathname}?${params}`, { scroll: false });
		},
		[filters, pathname, router],
	);

	return { filters, updateFilters };
}
