"use client";

import { PageHeaderView } from "@/components/wind/PageHeader.view";
import { WindFiltersView } from "@/components/wind/WindFilters.view";
import { useWindFilters } from "@/hooks";
import { ComparisonSection } from "./ComparisonSection";
import { DailyBreakdownSection } from "./DailyBreakdownSection";

export function ExplorerDashboard() {
	const { filters, updateFilters } = useWindFilters();

	return (
		<div className="space-y-6">
			<PageHeaderView
				title="Forecast vs Actual"
				description="Compare, hour by hour, what the wind forecast said with how much wind power actually came. Choose the dates, and how early the forecast was made."
			/>
			<WindFiltersView filters={filters} onChange={updateFilters} />
			<ComparisonSection filters={filters} />
			<DailyBreakdownSection
				filters={filters}
				onSelectDay={(deliveryDate) =>
					updateFilters({ startDate: deliveryDate, endDate: deliveryDate })
				}
			/>
		</div>
	);
}
