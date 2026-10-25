"use client";

import { QueryStateView } from "@/components/wind/QueryState.view";
import { SectionCardView } from "@/components/wind/SectionCard.view";
import { useWindDailySummary } from "@/queries";
import type { WindFilters } from "@/types";
import { DailyBreakdownTableView } from "./DailyBreakdownTable.view";

type DailyBreakdownSectionProps = {
	filters: WindFilters;
	onSelectDay: (deliveryDate: string) => void;
};

export function DailyBreakdownSection({
	filters,
	onSelectDay,
}: DailyBreakdownSectionProps) {
	const { data, isLoading, error } = useWindDailySummary(filters);

	return (
		<SectionCardView
			title="Day by day"
			description="One row per day. Click a column name to sort — for example by “Biggest error” to find the worst days — then press “See this day” to look at it hour by hour."
		>
			<QueryStateView
				isLoading={isLoading}
				error={error}
				isEmpty={!data?.days.length}
				skeletonClassName="h-72 w-full"
			>
				<DailyBreakdownTableView
					days={data?.days ?? []}
					onSelectDay={onSelectDay}
				/>
			</QueryStateView>
		</SectionCardView>
	);
}
