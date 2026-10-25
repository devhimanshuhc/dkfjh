import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@repo/ui/components/card";
import { ChartHintView } from "./ChartHint.view";

type SectionCardViewProps = {
	title: string;
	description?: string;
	howToRead?: string;
	insight?: string | null;
	children: React.ReactNode;
};

export function SectionCardView({
	title,
	description,
	howToRead,
	insight,
	children,
}: SectionCardViewProps) {
	return (
		<Card>
			<CardHeader>
				<CardTitle className="flex items-center gap-1.5">
					{title}
					{howToRead && <ChartHintView text={howToRead} />}
				</CardTitle>
				{description && <CardDescription>{description}</CardDescription>}
			</CardHeader>
			<CardContent className="flex flex-1 flex-col gap-4">
				{children}
				{insight && (
					<p className="border-primary/40 border-l-2 pl-3 text-sm">
						<span className="font-medium">What this tells us: </span>
						{insight}
					</p>
				)}
			</CardContent>
		</Card>
	);
}
