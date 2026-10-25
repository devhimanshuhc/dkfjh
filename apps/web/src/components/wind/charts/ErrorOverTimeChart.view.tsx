import {
	type ChartConfig,
	ChartContainer,
	ChartLegend,
	ChartLegendContent,
	ChartTooltip,
	ChartTooltipContent,
} from "@repo/ui/components/chart";
import {
	Bar,
	BarChart,
	CartesianGrid,
	ReferenceLine,
	XAxis,
	YAxis,
} from "recharts";
import { type ErrorOverTimeRow, formatUkDateTime, formatUkDay } from "@/utils";
import { formatMegawattTick, megawattTooltipRow } from "./chart-formatters";

const chartConfig = {
	overForecast: {
		label: "Forecast too high (less wind came)",
		color: "var(--destructive)",
	},
	underForecast: {
		label: "Forecast too low (more wind came)",
		color: "var(--chart-2)",
	},
} satisfies ChartConfig;

type ErrorOverTimeChartViewProps = {
	rows: ErrorOverTimeRow[];
};

export function ErrorOverTimeChartView({ rows }: ErrorOverTimeChartViewProps) {
	return (
		<ChartContainer config={chartConfig} className="aspect-auto h-48 w-full">
			<BarChart data={rows} margin={{ left: 8, right: 8 }} barCategoryGap={0}>
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
				<ReferenceLine y={0} stroke="var(--border)" />
				<ChartTooltip
					content={
						<ChartTooltipContent
							labelFormatter={(_, payload) =>
								formatUkDateTime(payload[0]?.payload.time)
							}
							formatter={megawattTooltipRow(chartConfig)}
						/>
					}
				/>
				<ChartLegend content={<ChartLegendContent />} />
				<Bar
					dataKey="overForecast"
					stackId="error"
					fill="var(--color-overForecast)"
					isAnimationActive={false}
				/>
				<Bar
					dataKey="underForecast"
					stackId="error"
					fill="var(--color-underForecast)"
					isAnimationActive={false}
				/>
			</BarChart>
		</ChartContainer>
	);
}
