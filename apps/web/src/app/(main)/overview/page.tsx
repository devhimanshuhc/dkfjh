import { PageContainer } from "@repo/ui/general/PageContainer";
import type { Metadata } from "next";
import { OverviewDashboard } from "@/components/overview";
import { APP_NAME } from "@/constants";

export const metadata: Metadata = { title: `Overview | ${APP_NAME}` };

export default function OverviewPage() {
	return (
		<PageContainer className="max-w-6xl">
			<OverviewDashboard />
		</PageContainer>
	);
}
