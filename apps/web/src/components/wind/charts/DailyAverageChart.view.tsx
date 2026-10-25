import {
	type ChartConfig,
	ChartContainer,
	ChartLegend,
	ChartLegendContent,
	ChartTooltip,
	ChartTooltipContent,
} from "@repo/ui/components/chart";
import { CartesianGrid, Line, LineChart, XAxis, YAxis } from "recharts";
import { type DailyChartRow, formatUkDay, formatUkLongDay } from "@/utils";
import { formatMegawattTick, megawattTooltipRow } from "./chart-formatters";

const chartConfig = {
	actual: {
		label: "Wind actually produced (daily average)",
		color: "var(--chart-3)",
	},
	forecast: {
		label: "What the forecast said (daily average)",
		color: "var(--chart-1)",
	},
} satisfies ChartConfig;

type DailyAverageChartViewProps = {
	rows: DailyChartRow[];
};

export function DailyAverageChartView({ rows }: DailyAverageChartViewProps) {
	return (
		<ChartContainer config={chartConfig} className="aspect-auto h-56 w-full">
			<LineChart data={rows} margin={{ left: 8, right: 8 }}>
				<CartesianGrid vertical={false} />
				<XAxis
					dataKey="date"
					tickFormatter={(date: string) => formatUkDay(`${date}T12:00:00Z`)}
					tickLine={false}
					axisLine={false}
					minTickGap={24}
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
							labelFormatter={(_, payload) =>
								formatUkLongDay(payload[0]?.payload.date)
							}
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
					isAnimationActive={false}
				/>
				<Line
					dataKey="forecast"
					stroke="var(--color-forecast)"
					strokeWidth={2}
					strokeDasharray="5 4"
					dot={false}
					isAnimationActive={false}
				/>
			</LineChart>
		</ChartContainer>
	);
}
