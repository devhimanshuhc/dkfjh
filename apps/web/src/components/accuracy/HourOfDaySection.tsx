"use client";

import { HourOfDayChartView } from "@/components/wind/charts/HourOfDayChart.view";
import { QueryStateView } from "@/components/wind/QueryState.view";
import { SectionCardView } from "@/components/wind/SectionCard.view";
import { useWindAccuracyBreakdown } from "@/queries";
import type { WindFilters } from "@/types";
import { describeHourOfDayPattern, toHourOfDayRows } from "@/utils";

type HourOfDaySectionProps = {
	filters: WindFilters;
};

export function HourOfDaySection({ filters }: HourOfDaySectionProps) {
	const { data, isLoading, error } = useWindAccuracyBreakdown(filters);
	const hours = data?.by_hour_of_day ?? [];
	const rows = toHourOfDayRows(hours);

	return (
		<SectionCardView
			title="Which times of day are hardest to forecast?"
			description="The average error for each hour of the day (UK time), across the dates you picked."
			howToRead="Each bar is one hour of the day. Taller bar = forecasts for that time were usually further off (MW)."
			insight={describeHourOfDayPattern(hours)}
		>
			<QueryStateView
				isLoading={isLoading}
				error={error}
				isEmpty={rows.length === 0}
				skeletonClassName="h-56 w-full"
			>
				<HourOfDayChartView rows={rows} />
			</QueryStateView>
		</SectionCardView>
	);
}
