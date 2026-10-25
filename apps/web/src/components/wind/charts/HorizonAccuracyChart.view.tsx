import {
	type ChartConfig,
	ChartContainer,
	ChartLegend,
	ChartLegendContent,
	ChartTooltip,
	ChartTooltipContent,
} from "@repo/ui/components/chart";
import {
	CartesianGrid,
	Line,
	LineChart,
	ReferenceLine,
	XAxis,
	YAxis,
} from "recharts";
import type { HorizonChartRow } from "@/utils";
import { formatMegawattTick, megawattTooltipRow } from "./chart-formatters";

const chartConfig = {
	typicalMiss: { label: "Average error", color: "var(--chart-3)" },
	planningMargin: {
		label: "Safety buffer (covers 9 in 10 hours)",
		color: "var(--chart-1)",
	},
} satisfies ChartConfig;

type HorizonAccuracyChartViewProps = {
	rows: HorizonChartRow[];
	selectedHorizonHours: number;
};

export function HorizonAccuracyChartView({
	rows,
	selectedHorizonHours,
}: HorizonAccuracyChartViewProps) {
	return (
		<ChartContainer config={chartConfig} className="aspect-auto h-64 w-full">
			<LineChart data={rows} margin={{ left: 8, right: 8 }}>
				<CartesianGrid vertical={false} />
				<XAxis
					dataKey="horizonHours"
					type="number"
					domain={["dataMin", "dataMax"]}
					tickFormatter={(hours: number) => `${hours} h`}
					tickLine={false}
					axisLine={false}
				/>
				<YAxis
					tickFormatter={formatMegawattTick}
					tickLine={false}
					axisLine={false}
					width={64}
				/>
				<ReferenceLine
					x={selectedHorizonHours}
					stroke="var(--muted-foreground)"
					strokeDasharray="3 3"
				/>
				<ChartTooltip
					content={
						<ChartTooltipContent
							labelFormatter={(_, payload) =>
								`Forecast made ${payload[0]?.payload.horizonHours} hours before`
							}
							formatter={megawattTooltipRow(chartConfig)}
						/>
					}
				/>
				<ChartLegend content={<ChartLegendContent />} />
				<Line
					dataKey="typicalMiss"
					stroke="var(--color-typicalMiss)"
					strokeWidth={2}
					isAnimationActive={false}
				/>
				<Line
					dataKey="planningMargin"
					stroke="var(--color-planningMargin)"
					strokeWidth={2}
					isAnimationActive={false}
				/>
			</LineChart>
		</ChartContainer>
	);
}
