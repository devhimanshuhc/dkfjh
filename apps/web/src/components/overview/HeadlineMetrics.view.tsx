import { Card, CardDescription, CardHeader } from "@repo/ui/components/card";
import { InfoTooltipView } from "@/components/wind/InfoTooltip.view";
import { MetricValueView } from "@/components/wind/MetricValue.view";
import { BEST_CASE_LEGEND } from "@/constants";
import type { AccuracySummaryItem } from "@/utils";

type HeadlineMetricsViewProps = {
	items: AccuracySummaryItem[];
};

export function HeadlineMetricsView({ items }: HeadlineMetricsViewProps) {
	return (
		<div className="space-y-2">
			<div className="grid gap-3 md:grid-cols-3">
				{items.map((item) => (
					<Card key={item.label}>
						<CardHeader>
							<CardDescription className="flex items-center gap-1">
								{item.label}
								<InfoTooltipView term={item.glossaryTerm} />
							</CardDescription>
							<MetricValueView item={item} className="text-3xl" />
							<p className="text-muted-foreground text-sm">
								{item.explanation}
							</p>
						</CardHeader>
					</Card>
				))}
			</div>
			{items.some((item) => item.tone) && (
				<p className="text-muted-foreground text-xs">{BEST_CASE_LEGEND}</p>
			)}
		</div>
	);
}
