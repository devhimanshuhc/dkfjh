import {
	type ChartConfig,
	ChartContainer,
	ChartLegend,
	ChartLegendContent,
	ChartTooltip,
	ChartTooltipContent,
} from "@repo/ui/components/chart";
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";
import type { ErrorBinRow } from "@/utils";
import { formatMegawattTick, tooltipRow } from "./chart-formatters";

const chartConfig = {
	overForecastHours: {
		label: "Forecast too high (less wind came)",
		color: "var(--destructive)",
	},
	underForecastHours: {
		label: "Forecast too low (more wind came)",
		color: "var(--chart-2)",
	},
} satisfies ChartConfig;

const formatHours = (hours: number) => `${hours} hours`;

type ErrorDistributionChartViewProps = {
	rows: ErrorBinRow[];
};

export function ErrorDistributionChartView({
	rows,
}: ErrorDistributionChartViewProps) {
	return (
		<figure className="space-y-1">
			<ChartContainer config={chartConfig} className="aspect-auto h-64 w-full">
				<BarChart data={rows} margin={{ left: 8, right: 8 }}>
					<CartesianGrid vertical={false} />
					<XAxis
						dataKey="lowerMw"
						tickFormatter={formatMegawattTick}
						tickLine={false}
						axisLine={false}
					/>
					<YAxis
						allowDecimals={false}
						tickLine={false}
						axisLine={false}
						width={56}
					/>
					<ChartTooltip
						content={
							<ChartTooltipContent
								labelFormatter={(_, payload) =>
									`Off by ${payload[0]?.payload.label}`
								}
								formatter={tooltipRow(chartConfig, formatHours)}
							/>
						}
					/>
					<ChartLegend verticalAlign="top" content={<ChartLegendContent />} />
					<Bar
						dataKey="underForecastHours"
						stackId="hours"
						fill="var(--color-underForecastHours)"
						isAnimationActive={false}
					/>
					<Bar
						dataKey="overForecastHours"
						stackId="hours"
						fill="var(--color-overForecastHours)"
						isAnimationActive={false}
					/>
				</BarChart>
			</ChartContainer>
			<figcaption className="text-muted-foreground text-center text-xs">
				Error in MW (forecast minus what actually happened). Each bar covers a
				500 MW step, labelled by where it starts. Bar height = number of hours.
			</figcaption>
		</figure>
	);
}
