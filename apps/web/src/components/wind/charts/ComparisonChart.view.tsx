import {
	type ChartConfig,
	ChartContainer,
	ChartLegend,
	ChartLegendContent,
	ChartTooltip,
	ChartTooltipContent,
} from "@repo/ui/components/chart";
import { CartesianGrid, Line, LineChart, XAxis, YAxis } from "recharts";
import {
	type ComparisonChartRow,
	formatSignedMegawatts,
	formatUkDateTime,
	formatUkDay,
} from "@/utils";
import { formatMegawattTick, megawattTooltipRow } from "./chart-formatters";

const chartConfig = {
	actual: { label: "Wind actually produced", color: "var(--chart-3)" },
	forecast: { label: "What the forecast said", color: "var(--chart-1)" },
} satisfies ChartConfig;

function describeRow(row: ComparisonChartRow | undefined) {
	if (!row) return null;
	return (
		<div className="space-y-0.5">
			<div className="font-medium">{formatUkDateTime(row.time)}</div>
			{row.publishedAt && (
				<div className="text-muted-foreground font-normal">
					Forecast made {formatUkDateTime(row.publishedAt)}
				</div>
			)}
			{row.error !== null && (
				<div className="text-muted-foreground font-normal">
					Off by {formatSignedMegawatts(row.error)}
					{row.error > 0 ? " (too high)" : row.error < 0 ? " (too low)" : ""}
				</div>
			)}
		</div>
	);
}

type ComparisonChartViewProps = {
	rows: ComparisonChartRow[];
};

export function ComparisonChartView({ rows }: ComparisonChartViewProps) {
	return (
		<ChartContainer config={chartConfig} className="aspect-auto h-80 w-full">
			<LineChart data={rows} margin={{ left: 8, right: 8 }}>
				<CartesianGrid vertical={false} />
				<XAxis
					dataKey="time"
					type="number"
					scale="time"
					domain={["dataMin", "dataMax"]}
					tickFormatter={formatUkDay}
					tickLine={false}
					axisLine={false}
					minTickGap={32}
				/>
				<YAxis
					tickFormatter={formatMegawattTick}
					tickLine={false}
					axisLine={false}
					width={64}
				/>
				<ChartTooltip
					content={
						<ChartTooltipContent
							labelFormatter={(_, payload) => describeRow(payload[0]?.payload)}
							formatter={megawattTooltipRow(chartConfig)}
						/>
					}
				/>
				<ChartLegend content={<ChartLegendContent />} />
				<Line
					dataKey="actual"
					stroke="var(--color-actual)"
					strokeWidth={2}
					dot={false}
					connectNulls={false}
					isAnimationActive={false}
				/>
				<Line
					dataKey="forecast"
					stroke="var(--color-forecast)"
					strokeWidth={2}
					strokeDasharray="5 4"
					dot={false}
					connectNulls={false}
					isAnimationActive={false}
				/>
			</LineChart>
		</ChartContainer>
	);
}
