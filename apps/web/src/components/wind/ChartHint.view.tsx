import {
	Popover,
	PopoverContent,
	PopoverDescription,
	PopoverHeader,
	PopoverTitle,
	PopoverTrigger,
} from "@repo/ui/components/popover";
import { Info } from "lucide-react";

type ChartHintViewProps = {
	text: string;
};

export function ChartHintView({ text }: ChartHintViewProps) {
	return (
		<Popover>
			<PopoverTrigger
				openOnHover
				render={
					<button
						type="button"
						aria-label="How to read this chart"
						className="text-muted-foreground hover:text-foreground inline-flex transition-colors"
					/>
				}
			>
				<Info className="size-4" />
			</PopoverTrigger>
			<PopoverContent className="w-80">
				<PopoverHeader>
					<PopoverTitle>How to read this chart</PopoverTitle>
					<PopoverDescription>{text}</PopoverDescription>
				</PopoverHeader>
			</PopoverContent>
		</Popover>
	);
}
