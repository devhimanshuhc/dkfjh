import {
	Tooltip,
	TooltipContent,
	TooltipTrigger,
} from "@repo/ui/components/tooltip";
import { Info } from "lucide-react";
import { GLOSSARY, type GlossaryTerm } from "@/constants";

type InfoTooltipViewProps = {
	term: GlossaryTerm;
};

export function InfoTooltipView({ term }: InfoTooltipViewProps) {
	const { term: label, definition } = GLOSSARY[term];

	return (
		<Tooltip>
			<TooltipTrigger
				render={
					<button
						type="button"
						aria-label={`What is ${label}?`}
						className="text-muted-foreground hover:text-foreground inline-flex align-middle transition-colors"
					/>
				}
			>
				<Info className="size-3.5" />
			</TooltipTrigger>
			<TooltipContent className="max-w-72">{definition}</TooltipContent>
		</Tooltip>
	);
}
