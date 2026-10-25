import { Card, CardDescription, CardHeader } from "@repo/ui/components/card";
import { BEST_CASE_LEGEND } from "@/constants";
import type { AccuracySummaryItem } from "@/utils";
import { InfoTooltipView } from "./InfoTooltip.view";
import { MetricValueView } from "./MetricValue.view";

type AccuracySummaryViewProps = {
	items: AccuracySummaryItem[];
	sampleCount: number;
};

export function AccuracySummaryView({
	items,
	sampleCount,
}: AccuracySummaryViewProps) {
	return (
		<div className="space-y-2">
			<div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
				{items.map((item) => (
					<Card key={item.label} size="sm">
						<CardHeader>
							<CardDescription className="flex items-center gap-1">
								{item.label}
								<InfoTooltipView term={item.glossaryTerm} />
							</CardDescription>
							<MetricValueView item={item} className="text-xl" />
							<p className="text-muted-foreground text-xs">
								{item.explanation}
							</p>
						</CardHeader>
					</Card>
				))}
			</div>
			<p className="text-muted-foreground text-xs">
				Based on {sampleCount.toLocaleString("en-GB")} hours where we had both a
				forecast and the real figure. Error = forecast minus what actually
				happened.
				{items.some((item) => item.tone) && ` ${BEST_CASE_LEGEND}`}
			</p>
		</div>
	);
}
