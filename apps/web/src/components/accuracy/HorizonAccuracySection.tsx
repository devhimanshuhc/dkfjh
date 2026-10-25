"use client";

import { HorizonAccuracyChartView } from "@/components/wind/charts/HorizonAccuracyChart.view";
import { QueryStateView } from "@/components/wind/QueryState.view";
import { SectionCardView } from "@/components/wind/SectionCard.view";
import { useWindAccuracyByHorizon } from "@/queries";
import type { WindFilters } from "@/types";
import { describeLeadTimeTrend, toHorizonChartRows } from "@/utils";

type HorizonAccuracySectionProps = {
	filters: WindFilters;
};

export function HorizonAccuracySection({
	filters,
}: HorizonAccuracySectionProps) {
	const { data, isLoading, error } = useWindAccuracyByHorizon(
		filters.startDate,
		filters.endDate,
	);
	const horizons = data?.horizons ?? [];
	const rows = toHorizonChartRows(horizons);

	return (
		<SectionCardView
			title="Are forecasts made earlier less accurate?"
			description="How the error changes depending on how long before the hour the forecast was made."
			howToRead="Left = forecasts made shortly before the hour; right = forecasts made up to almost 3 days before. Higher line = bigger error (MW). The dashed line marks the setting you picked above."
			insight={describeLeadTimeTrend(horizons)}
		>
			<QueryStateView
				isLoading={isLoading}
				error={error}
				isEmpty={rows.length === 0}
				skeletonClassName="h-64 w-full"
			>
				<HorizonAccuracyChartView
					rows={rows}
					selectedHorizonHours={filters.horizonHours}
				/>
			</QueryStateView>
		</SectionCardView>
	);
}
