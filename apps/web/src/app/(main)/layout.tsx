import { SidebarProvider } from "@repo/ui/components/sidebar";
import { WelcomeBanner } from "@/components/layout/WelcomeBanner";
import { AppSidebar } from "@/components/sidebar/AppSidebar";
import SidebarInset from "@/components/sidebar/SidebarInset";

export default function AppLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<SidebarProvider>
			<AppSidebar />
			<SidebarInset>
				<WelcomeBanner />
				{children}
			</SidebarInset>
		</SidebarProvider>
	);
}
