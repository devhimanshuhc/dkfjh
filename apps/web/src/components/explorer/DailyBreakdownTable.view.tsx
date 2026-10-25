import { Button } from "@repo/ui/components/button";
import {
	CustomTable,
	type CustomTableColumnDef,
} from "@repo/ui/general/CustomTable";
import type { DailySummary } from "@/types";
import {
	formatMegawatts,
	formatSignedMegawatts,
	formatUkLongDay,
	formatUkTime,
} from "@/utils";

const formatOptional = (
	value: number | null,
	format: (value: number) => string,
) => (value === null ? "–" : format(value));

const buildColumns = (
	onSelectDay: (deliveryDate: string) => void,
): CustomTableColumnDef<DailySummary>[] => [
	{
		accessorKey: "delivery_date",
		header: "Day",
		cell: ({ row }) => formatUkLongDay(row.original.delivery_date),
	},
	{
		accessorKey: "mean_actual_mw",
		header: "Wind produced (avg)",
		cell: ({ row }) =>
			formatOptional(row.original.mean_actual_mw, formatMegawatts),
	},
	{
		accessorKey: "mean_forecast_mw",
		header: "Forecast (avg)",
		cell: ({ row }) =>
			formatOptional(row.original.mean_forecast_mw, formatMegawatts),
	},
	{
		accessorKey: "mean_absolute_error_mw",
		header: "Average error",
		cell: ({ row }) =>
			formatOptional(row.original.mean_absolute_error_mw, formatMegawatts),
	},
	{
		accessorKey: "worst_error_mw",
		header: "Biggest error",
		cell: ({ row }) =>
			row.original.worst_error_mw === null || !row.original.worst_error_at
				? "–"
				: `${formatSignedMegawatts(row.original.worst_error_mw)} at ${formatUkTime(row.original.worst_error_at)}`,
	},
	{
		id: "view",
		header: "",
		cell: ({ row }) => (
			<Button
				variant="ghost"
				size="sm"
				onClick={() => onSelectDay(row.original.delivery_date)}
			>
				See this day
			</Button>
		),
	},
];

type DailyBreakdownTableViewProps = {
	days: DailySummary[];
	onSelectDay: (deliveryDate: string) => void;
};

export function DailyBreakdownTableView({
	days,
	onSelectDay,
}: DailyBreakdownTableViewProps) {
	return (
		<CustomTable
			data={days}
			columns={buildColumns(onSelectDay)}
			enableSorting
			enablePagination
			pageSize={10}
		/>
	);
}
