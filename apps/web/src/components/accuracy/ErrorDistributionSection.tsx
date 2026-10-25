"use client";

import { ErrorDistributionChartView } from "@/components/wind/charts/ErrorDistributionChart.view";
import { QueryStateView } from "@/components/wind/QueryState.view";
import { SectionCardView } from "@/components/wind/SectionCard.view";
import { useWindAccuracyBreakdown } from "@/queries";
import type { WindFilters } from "@/types";
import { toErrorBinRows } from "@/utils";

type ErrorDistributionSectionProps = {
	filters: WindFilters;
};

export function ErrorDistributionSection({
	filters,
}: ErrorDistributionSectionProps) {
	const { data, isLoading, error } = useWindAccuracyBreakdown(filters);
	const rows = toErrorBinRows(data?.error_distribution ?? []);

	return (
		<SectionCardView
			title="How often was the forecast off by a little, or a lot?"
			description="Each bar counts how many hours had an error of that size."
			howToRead="Bars to the right of 0 (red) = forecast too high. Bars to the left of 0 (blue) = forecast too low. If the forecasts were perfect, every hour would be in the bar at 0."
			insight="The more bars sit to the right of 0, the more often the forecast promised too much wind. The wider the bars spread out, the more backup electricity is needed."
		>
			<QueryStateView
				isLoading={isLoading}
				error={error}
				isEmpty={rows.length === 0}
				skeletonClassName="h-64 w-full"
			>
				<ErrorDistributionChartView rows={rows} />
			</QueryStateView>
		</SectionCardView>
	);
}
