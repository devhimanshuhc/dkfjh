import { Button } from "@repo/ui/components/button";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { ROUTES } from "@/constants";
import { HeroAnimationView } from "./HeroAnimation.view";

export function HeroSectionView() {
	return (
		<section className="mx-auto grid max-w-6xl items-center gap-10 px-4 pt-12 pb-8 md:grid-cols-2 md:pt-20">
			<div className="space-y-6 text-center md:text-left">
				<p className="text-primary text-sm font-medium">
					For electricity buyers · Great Britain · January 2026
				</p>
				<h1 className="text-4xl font-semibold tracking-tight text-balance md:text-5xl">
					Know how far to trust the wind forecast before you buy electricity
				</h1>
				<p className="text-muted-foreground text-lg text-balance">
					We compared every wind power forecast with what the wind actually did,
					hour by hour, for a whole month. See how often the forecast was wrong,
					by how much, and how much backup electricity to keep.
				</p>
				<div className="flex flex-wrap justify-center gap-3 md:justify-start">
					<Button size="lg" render={<Link href={ROUTES.overview} />}>
						See the results
						<ArrowRight />
					</Button>
					<Button
						size="lg"
						variant="outline"
						render={<Link href={ROUTES.howItWorks} />}
					>
						How it works
					</Button>
				</div>
			</div>
			<HeroAnimationView />
		</section>
	);
}
