import { Lightbulb } from "lucide-react";
import type { KeyTakeaway } from "@/utils";

type KeyTakeawayViewProps = {
	takeaway: KeyTakeaway;
};

export function KeyTakeawayView({ takeaway }: KeyTakeawayViewProps) {
	return (
		<section className="bg-primary/5 ring-primary/15 flex gap-3 rounded-xl p-4 ring-1">
			<Lightbulb className="text-primary mt-0.5 size-5 shrink-0" />
			<div className="space-y-1">
				<p className="text-xs font-medium tracking-wide uppercase">
					The main finding
				</p>
				<p className="text-lg font-medium">{takeaway.headline}</p>
				<p className="text-muted-foreground text-sm">{takeaway.detail}</p>
			</div>
		</section>
	);
}
