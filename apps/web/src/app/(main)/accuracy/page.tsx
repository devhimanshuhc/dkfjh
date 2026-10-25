import { PageContainer } from "@repo/ui/general/PageContainer";
import type { Metadata } from "next";
import { Suspense } from "react";
import { AccuracyDashboard } from "@/components/accuracy";
import { APP_NAME } from "@/constants";

export const metadata: Metadata = { title: `Forecast Accuracy | ${APP_NAME}` };

export default function AccuracyPage() {
	return (
		<PageContainer className="max-w-6xl">
			<Suspense>
				<AccuracyDashboard />
			</Suspense>
		</PageContainer>
	);
}
