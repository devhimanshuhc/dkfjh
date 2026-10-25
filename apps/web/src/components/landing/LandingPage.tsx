import { FeatureGridView } from "./FeatureGrid.view";
import { HeroSectionView } from "./HeroSection.view";
import { LandingFooterView } from "./LandingFooter.view";
import { LandingHeaderView } from "./LandingHeader.view";
import { LandingStats } from "./LandingStats";
import { ProblemStepsView } from "./ProblemSteps.view";

export function LandingPage() {
	return (
		<div className="bg-background min-h-svh">
			<LandingHeaderView />
			<main>
				<HeroSectionView />
				<ProblemStepsView />
				<LandingStats />
				<FeatureGridView />
			</main>
			<LandingFooterView />
		</div>
	);
}
