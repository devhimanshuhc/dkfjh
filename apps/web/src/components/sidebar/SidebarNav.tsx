"use client";

import {
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem,
} from "@repo/ui/components/sidebar";
import { BookOpen, ChartLine, LayoutDashboard, Target } from "lucide-react";
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { ROUTES } from "@/constants";

const NAV_ITEMS = [
	{ label: "Overview", href: ROUTES.overview, icon: LayoutDashboard },
	{ label: "Forecast vs Actual", href: ROUTES.explorer, icon: ChartLine },
	{ label: "Forecast Accuracy", href: ROUTES.accuracy, icon: Target },
	{ label: "How it works", href: ROUTES.howItWorks, icon: BookOpen },
];

const PAGES_WITH_FILTERS: string[] = [ROUTES.explorer, ROUTES.accuracy];

export function SidebarNav() {
	const pathname = usePathname();
	const search = useSearchParams().toString();

	return (
		<SidebarMenu className="gap-1">
			{NAV_ITEMS.map((item) => {
				const keepsFilters = search && PAGES_WITH_FILTERS.includes(item.href);
				return (
					<SidebarMenuItem key={item.href}>
						<SidebarMenuButton
							isActive={pathname === item.href}
							tooltip={item.label}
							render={
								<Link
									href={keepsFilters ? `${item.href}?${search}` : item.href}
								>
									<item.icon className="size-4" />
									{item.label}
								</Link>
							}
						/>
					</SidebarMenuItem>
				);
			})}
		</SidebarMenu>
	);
}
