import { PageContainer } from "@repo/ui/general/PageContainer";
import type { Metadata } from "next";
import { HowItWorksView } from "@/components/how-it-works";
import { PageHeaderView } from "@/components/wind/PageHeader.view";
import { APP_NAME } from "@/constants";

export const metadata: Metadata = { title: `How it works | ${APP_NAME}` };

export default function HowItWorksPage() {
	return (
		<PageContainer className="max-w-6xl space-y-6">
			<PageHeaderView
				title="How it works"
				description="A simple explanation of where the data comes from, how it is used, and what each number on this site means."
			/>
			<HowItWorksView />
		</PageContainer>
	);
}
