import { Button } from "@repo/ui/components/button";
import { ThemeToggle } from "@repo/ui/components/theme-toggle";
import { Wind } from "lucide-react";
import Link from "next/link";
import { APP_NAME, ROUTES } from "@/constants";

export function LandingHeaderView() {
	return (
		<header className="mx-auto flex w-full max-w-6xl items-center justify-between px-4 py-4">
			<Link
				href={ROUTES.landing}
				className="flex items-center gap-2 font-medium"
			>
				<span className="bg-primary text-primary-foreground flex size-8 items-center justify-center rounded-lg">
					<Wind className="size-4" />
				</span>
				{APP_NAME}
			</Link>
			<div className="flex items-center gap-2">
				<ThemeToggle />
				<Button render={<Link href={ROUTES.overview} />}>
					Open the dashboard
				</Button>
			</div>
		</header>
	);
}
