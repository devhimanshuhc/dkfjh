"use client";

import { Button } from "@repo/ui/components/button";
import { PageContainer } from "@repo/ui/general/PageContainer";
import { X } from "lucide-react";
import Link from "next/link";
import { ROUTES } from "@/constants";
import { useDismissible } from "@/hooks";

const WELCOME_BANNER_KEY = "wind-monitor:welcome-dismissed";

export function WelcomeBanner() {
	const { isDismissed, dismiss } = useDismissible(WELCOME_BANNER_KEY);

	if (isDismissed) return null;

	return (
		<PageContainer className="max-w-6xl pb-0">
			<div className="bg-muted/60 flex items-start gap-3 rounded-xl p-4 text-sm">
				<div className="flex-1 space-y-1">
					<p className="font-medium">New here?</p>
					<p className="text-muted-foreground">
						This tool checks how accurate wind power forecasts were when an
						energy company bought electricity one day ahead, in January 2026.
						Start with the{" "}
						<Link href={ROUTES.overview} className="text-foreground underline">
							Overview
						</Link>{" "}
						for the main answer, or read{" "}
						<Link
							href={ROUTES.howItWorks}
							className="text-foreground underline"
						>
							How it works
						</Link>{" "}
						for a simple explanation of every number.
					</p>
				</div>
				<Button
					variant="ghost"
					size="icon-sm"
					aria-label="Dismiss welcome message"
					onClick={dismiss}
				>
					<X />
				</Button>
			</div>
		</PageContainer>
	);
}
