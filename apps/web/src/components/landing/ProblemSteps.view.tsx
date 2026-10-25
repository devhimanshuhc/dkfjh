import { CalendarClock, CloudSun, TriangleAlert } from "lucide-react";

const STEPS = [
	{
		icon: CalendarClock,
		title: "Electricity is bought a day early",
		text: "An energy company has to buy tomorrow's electricity today, hour by hour.",
	},
	{
		icon: CloudSun,
		title: "Wind covers part of it",
		text: "Wind farms supply some of what customers need, so the company buys less when a lot of wind is forecast.",
	},
	{
		icon: TriangleAlert,
		title: "But the forecast can be wrong",
		text: "If less wind comes than forecast, the company is short and must buy the rest at the last minute — usually at a higher price.",
	},
];

export function ProblemStepsView() {
	return (
		<section className="mx-auto max-w-6xl space-y-6 px-4 py-12">
			<h2 className="text-center text-2xl font-semibold">The problem</h2>
			<ol className="grid gap-4 md:grid-cols-3">
				{STEPS.map((step, index) => (
					<li
						key={step.title}
						className="bg-card ring-foreground/10 space-y-2 rounded-xl p-5 ring-1"
					>
						<div className="flex items-center gap-2">
							<step.icon className="text-primary size-5" />
							<span className="text-muted-foreground text-xs">
								Step {index + 1}
							</span>
						</div>
						<h3 className="font-medium">{step.title}</h3>
						<p className="text-muted-foreground text-sm">{step.text}</p>
					</li>
				))}
			</ol>
		</section>
	);
}
