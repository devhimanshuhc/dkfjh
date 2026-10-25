import { PageContainer } from "@repo/ui/general/PageContainer";
import type { Metadata } from "next";
import { Suspense } from "react";
import { ExplorerDashboard } from "@/components/explorer";
import { APP_NAME } from "@/constants";

export const metadata: Metadata = { title: `Forecast vs Actual | ${APP_NAME}` };

export default function ExplorerPage() {
	return (
		<PageContainer className="max-w-6xl">
			<Suspense>
				<ExplorerDashboard />
			</Suspense>
		</PageContainer>
	);
}
