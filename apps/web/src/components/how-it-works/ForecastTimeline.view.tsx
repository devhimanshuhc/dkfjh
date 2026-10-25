import { cn } from "@repo/ui/lib/utils";

const TIMELINE_EVENTS = [
	{ time: "31 Dec 18:30", label: "A forecast is made", state: "older" },
	{
		time: "31 Dec 22:30",
		label:
			"A newer forecast is made — it says 19,162 MW. This is the one we use.",
		state: "chosen",
	},
	{
		time: "1 Jan 00:00",
		label: "Buying deadline in this example (24 hours before the hour)",
		state: "cutoff",
	},
	{
		time: "1 Jan 02:30",
		label:
			"Another forecast is made — too late, the buyer could not have seen it",
		state: "late",
	},
	{
		time: "2 Jan 00:00",
		label: "The hour itself: 15,228 MW of wind power actually came",
		state: "target",
	},
] as const;

const DOT_STYLES = {
	older: "bg-muted-foreground/40",
	chosen: "bg-primary ring-primary/30 ring-4",
	cutoff: "bg-foreground",
	late: "bg-destructive/50",
	target: "bg-chart-3",
} as const;

export function ForecastTimelineView() {
	return (
		<div className="space-y-3">
			<ol className="relative space-y-4 border-l pl-6">
				{TIMELINE_EVENTS.map((event) => (
					<li key={event.time} className="relative">
						<span
							className={cn(
								"absolute top-1.5 -left-[1.9rem] size-2.5 rounded-full",
								DOT_STYLES[event.state],
							)}
						/>
						<p className="text-muted-foreground text-xs tabular-nums">
							{event.time}
						</p>
						<p
							className={cn(
								"text-sm",
								event.state === "chosen" && "font-medium",
								event.state === "late" && "text-muted-foreground line-through",
							)}
						>
							{event.label}
						</p>
					</li>
				))}
			</ol>
			<p className="text-muted-foreground text-sm">
				A real example from the data, using “24 hours before”. The newest
				forecast made before the deadline is the one used; forecasts made after
				it are ignored, because a buyer could not have seen them yet. Here the
				forecast said 19,162 MW but only 15,228 MW came, so the error was{" "}
				<strong className="text-foreground">+3,934 MW</strong>: the forecast was
				too high.
			</p>
		</div>
	);
}
