"use client";

import { DailyAverageChartView } from "@/components/wind/charts/DailyAverageChart.view";
import { PageHeaderView } from "@/components/wind/PageHeader.view";
import { QueryStateView } from "@/components/wind/QueryState.view";
import { SectionCardView } from "@/components/wind/SectionCard.view";
import { DEFAULT_WIND_FILTERS } from "@/constants";
import {
	useWindBestCaseMetrics,
	useWindComparison,
	useWindDailySummary,
} from "@/queries";
import {
	buildHeadlineItems,
	buildKeyTakeaway,
	rateAgainstBestCase,
	toDailyChartRows,
} from "@/utils";
import { HeadlineMetricsView } from "./HeadlineMetrics.view";
import { KeyTakeawayView } from "./KeyTakeaway.view";
import { PageGuideView } from "./PageGuide.view";

export function OverviewDashboard() {
	const comparison = useWindComparison(DEFAULT_WIND_FILTERS);
	const dailySummary = useWindDailySummary(DEFAULT_WIND_FILTERS);
	const { data: bestCase } = useWindBestCaseMetrics(
		DEFAULT_WIND_FILTERS.startDate,
		DEFAULT_WIND_FILTERS.endDate,
	);
	const metrics = comparison.data?.metrics;

	return (
		<div className="space-y-6">
			<PageHeaderView title="Can you trust the wind forecast?" />
			<QueryStateView
				isLoading={comparison.isLoading}
				error={comparison.error}
				isEmpty={!metrics}
				skeletonClassName="h-64 w-full"
			>
				{metrics && (
					<div className="space-y-4">
						<KeyTakeawayView
							takeaway={buildKeyTakeaway(
								metrics,
								DEFAULT_WIND_FILTERS.horizonHours,
							)}
						/>
						<HeadlineMetricsView
							items={rateAgainstBestCase(
								buildHeadlineItems(metrics),
								metrics,
								bestCase,
							)}
						/>
					</div>
				)}
			</QueryStateView>
			<SectionCardView
				title="January at a glance"
				description="Daily average, MW. Dashed above solid = forecast too high."
			>
				<QueryStateView
					isLoading={dailySummary.isLoading}
					error={dailySummary.error}
					isEmpty={!dailySummary.data?.days.length}
					skeletonClassName="h-56 w-full"
				>
					<DailyAverageChartView
						rows={toDailyChartRows(dailySummary.data?.days ?? [])}
					/>
				</QueryStateView>
			</SectionCardView>
			<section className="space-y-3">
				<h2 className="text-lg font-semibold">Dig deeper</h2>
				<PageGuideView />
			</section>
		</div>
	);
}
