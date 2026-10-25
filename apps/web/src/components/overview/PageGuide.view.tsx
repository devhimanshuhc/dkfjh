import {
	Card,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@repo/ui/components/card";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { ROUTES } from "@/constants";

const GUIDE_LINKS = [
	{
		href: ROUTES.explorer,
		title: "Forecast vs Actual",
		description: "Forecast vs reality, hour by hour.",
	},
	{
		href: ROUTES.accuracy,
		title: "Forecast Accuracy",
		description: "How big the errors are, and when.",
	},
	{
		href: ROUTES.howItWorks,
		title: "How it works",
		description: "The data, the method, the terms.",
	},
];

export function PageGuideView() {
	return (
		<div className="grid gap-3 md:grid-cols-3">
			{GUIDE_LINKS.map((link) => (
				<Link key={link.href} href={link.href} className="group">
					<Card className="group-hover:ring-primary/40 h-full transition-shadow">
						<CardHeader>
							<CardTitle className="flex items-center justify-between">
								{link.title}
								<ArrowRight className="text-muted-foreground size-4 transition-transform group-hover:translate-x-0.5" />
							</CardTitle>
							<CardDescription>{link.description}</CardDescription>
						</CardHeader>
					</Card>
				</Link>
			))}
		</div>
	);
}
