"use client";

import { ChartHintView } from "@/components/wind/ChartHint.view";
import { ComparisonChartView } from "@/components/wind/charts/ComparisonChart.view";
import { ErrorOverTimeChartView } from "@/components/wind/charts/ErrorOverTimeChart.view";
import { QueryStateView } from "@/components/wind/QueryState.view";
import { SectionCardView } from "@/components/wind/SectionCard.view";
import { useWindComparison } from "@/queries";
import type { WindFilters } from "@/types";
import {
	describeBias,
	toComparisonChartRows,
	toErrorOverTimeRows,
} from "@/utils";

type ComparisonSectionProps = {
	filters: WindFilters;
};

export function ComparisonSection({ filters }: ComparisonSectionProps) {
	const { data, isLoading, error } = useWindComparison(filters);
	const points = data?.points ?? [];

	return (
		<SectionCardView
			title="Forecast vs what actually happened"
			description={`Each point is one hour. For every hour we use the forecast that already existed ${filters.horizonHours} hours earlier.`}
			howToRead="Solid line = wind actually produced. Dashed line = what the forecast said. The gap between them is the error. Hover over the chart to see when that forecast was made and how far off it was. Times are UK time; amounts are in MW."
			insight={data?.metrics ? describeBias(data.metrics.bias_mw) : null}
		>
			<QueryStateView
				isLoading={isLoading}
				error={error}
				isEmpty={!data?.metrics}
				skeletonClassName="h-[30rem] w-full"
			>
				<ComparisonChartView rows={toComparisonChartRows(points)} />
				<h3 className="flex items-center gap-1.5 text-sm font-medium">
					How far off was the forecast each hour?
					<ChartHintView text="Each bar is one hour. Red bar going up = forecast too high (less wind came than promised, so a buyer would be short). Blue bar going down = forecast too low. Taller bar = bigger error. Amounts in MW." />
				</h3>
				<ErrorOverTimeChartView rows={toErrorOverTimeRows(points)} />
			</QueryStateView>
		</SectionCardView>
	);
}
