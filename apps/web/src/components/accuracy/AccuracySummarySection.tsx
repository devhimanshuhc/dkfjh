"use client";

import { AccuracySummaryView } from "@/components/wind/AccuracySummary.view";
import { QueryStateView } from "@/components/wind/QueryState.view";
import { SectionCardView } from "@/components/wind/SectionCard.view";
import { useWindBestCaseMetrics, useWindComparison } from "@/queries";
import type { WindFilters } from "@/types";
import { buildAccuracySummaryItems, rateAgainstBestCase } from "@/utils";

type AccuracySummarySectionProps = {
	filters: WindFilters;
};

export function AccuracySummarySection({
	filters,
}: AccuracySummarySectionProps) {
	const { data, isLoading, error } = useWindComparison(filters);
	const { data: bestCase } = useWindBestCaseMetrics(
		filters.startDate,
		filters.endDate,
	);

	return (
		<SectionCardView
			title="How far off were the forecasts?"
			description={`Based on forecasts made ${filters.horizonHours} hours before each hour, for the dates you picked. Hover over ⓘ for a simple explanation.`}
		>
			<QueryStateView
				isLoading={isLoading}
				error={error}
				isEmpty={!data?.metrics}
				skeletonClassName="h-48 w-full"
			>
				{data?.metrics && (
					<AccuracySummaryView
						items={rateAgainstBestCase(
							buildAccuracySummaryItems(data.metrics),
							data.metrics,
							bestCase,
						)}
						sampleCount={data.metrics.sample_count}
					/>
				)}
			</QueryStateView>
		</SectionCardView>
	);
}
