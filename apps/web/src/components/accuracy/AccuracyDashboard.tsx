"use client";

import { PageHeaderView } from "@/components/wind/PageHeader.view";
import { WindFiltersView } from "@/components/wind/WindFilters.view";
import { useWindFilters } from "@/hooks";
import { AccuracySummarySection } from "./AccuracySummarySection";
import { ErrorDistributionSection } from "./ErrorDistributionSection";
import { HorizonAccuracySection } from "./HorizonAccuracySection";
import { HourOfDaySection } from "./HourOfDaySection";

export function AccuracyDashboard() {
	const { filters, updateFilters } = useWindFilters();

	return (
		<div className="space-y-6">
			<PageHeaderView
				title="Forecast Accuracy"
				description="How much the wind forecast can be trusted, and how much backup electricity to keep. Every number compares the forecast available at buying time with what actually happened."
			/>
			<WindFiltersView filters={filters} onChange={updateFilters} />
			<AccuracySummarySection filters={filters} />
			<ErrorDistributionSection filters={filters} />
			<div className="grid gap-6 lg:grid-cols-2">
				<HorizonAccuracySection filters={filters} />
				<HourOfDaySection filters={filters} />
			</div>
		</div>
	);
}
