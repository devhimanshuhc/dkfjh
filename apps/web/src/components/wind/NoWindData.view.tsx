import {
	Empty,
	EmptyDescription,
	EmptyHeader,
	EmptyTitle,
} from "@repo/ui/components/empty";

export function NoWindDataView() {
	return (
		<Empty>
			<EmptyHeader>
				<EmptyTitle>No data to show</EmptyTitle>
				<EmptyDescription>
					No forecast was made early enough for these dates. Try a smaller
					number in “Use forecasts made at least”, or pick different dates.
				</EmptyDescription>
			</EmptyHeader>
		</Empty>
	);
}
