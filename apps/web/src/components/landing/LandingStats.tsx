"use client";

import { HeadlineMetricsView } from "@/components/overview/HeadlineMetrics.view";
import { QueryStateView } from "@/components/wind/QueryState.view";
import { DEFAULT_WIND_FILTERS } from "@/constants";
import { useWindBestCaseMetrics, useWindComparison } from "@/queries";
import { buildHeadlineItems, rateAgainstBestCase } from "@/utils";

export function LandingStats() {
	const { data, isLoading, error } = useWindComparison(DEFAULT_WIND_FILTERS);
	const { data: bestCase } = useWindBestCaseMetrics(
		DEFAULT_WIND_FILTERS.startDate,
		DEFAULT_WIND_FILTERS.endDate,
	);

	return (
		<section className="mx-auto max-w-6xl space-y-6 px-4 py-12">
			<div className="space-y-2 text-center">
				<h2 className="text-2xl font-semibold">What we found</h2>
				<p className="text-muted-foreground mx-auto max-w-2xl text-sm">
					Using forecasts made {DEFAULT_WIND_FILTERS.horizonHours} hours before
					each hour — what a buyer could actually see — for every hour from 2
					January to 1 February 2026.
				</p>
			</div>
			<QueryStateView
				isLoading={isLoading}
				error={error}
				isEmpty={!data?.metrics}
				skeletonClassName="h-40 w-full"
			>
				{data?.metrics && (
					<HeadlineMetricsView
						items={rateAgainstBestCase(
							buildHeadlineItems(data.metrics),
							data.metrics,
							bestCase,
						)}
					/>
				)}
			</QueryStateView>
		</section>
	);
}
