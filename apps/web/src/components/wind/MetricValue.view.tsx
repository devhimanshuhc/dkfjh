import { CardTitle } from "@repo/ui/components/card";
import { cn } from "@repo/ui/lib/utils";
import type { AccuracySummaryItem } from "@/utils";

const TONE_CLASS = {
	good: "text-emerald-600 dark:text-emerald-400",
	bad: "text-destructive",
} as const;

type MetricValueViewProps = {
	item: AccuracySummaryItem;
	className: string;
};

export function MetricValueView({ item, className }: MetricValueViewProps) {
	return (
		<>
			<CardTitle
				className={cn(
					"tabular-nums",
					className,
					item.tone && TONE_CLASS[item.tone],
				)}
			>
				{item.value}
			</CardTitle>
			{item.bestCaseValue && (
				<p className="text-muted-foreground text-xs">
					Best case: {item.bestCaseValue}
				</p>
			)}
		</>
	);
}
