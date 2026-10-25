import { BookOpen, ChartLine, LayoutDashboard, Target } from "lucide-react";
import Link from "next/link";
import { ROUTES } from "@/constants";

const FEATURES = [
	{
		href: ROUTES.overview,
		icon: LayoutDashboard,
		title: "Overview",
		text: "The main answer in a few seconds: how accurate the forecasts were and how much backup to keep.",
	},
	{
		href: ROUTES.explorer,
		icon: ChartLine,
		title: "Forecast vs Actual",
		text: "See, hour by hour and day by day, what the forecast said and how much wind actually came.",
	},
	{
		href: ROUTES.accuracy,
		icon: Target,
		title: "Forecast Accuracy",
		text: "How often the forecast was off by a little or a lot, and which times of day are hardest.",
	},
	{
		href: ROUTES.howItWorks,
		icon: BookOpen,
		title: "How it works",
		text: "Where the data comes from and what every word and number means.",
	},
];

export function FeatureGridView() {
	return (
		<section className="mx-auto max-w-6xl space-y-6 px-4 py-12">
			<h2 className="text-center text-2xl font-semibold">
				What you can explore
			</h2>
			<div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
				{FEATURES.map((feature) => (
					<Link
						key={feature.href}
						href={feature.href}
						className="bg-card ring-foreground/10 hover:ring-primary/40 space-y-2 rounded-xl p-5 ring-1 transition-shadow"
					>
						<feature.icon className="text-primary size-5" />
						<h3 className="font-medium">{feature.title}</h3>
						<p className="text-muted-foreground text-sm">{feature.text}</p>
					</Link>
				))}
			</div>
		</section>
	);
}
