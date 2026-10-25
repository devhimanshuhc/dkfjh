import {
	type ChartConfig,
	ChartContainer,
	ChartTooltip,
	ChartTooltipContent,
} from "@repo/ui/components/chart";
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";
import type { HourOfDayRow } from "@/utils";
import { formatMegawattTick, megawattTooltipRow } from "./chart-formatters";

const chartConfig = {
	typicalMiss: { label: "Average error", color: "var(--chart-3)" },
} satisfies ChartConfig;

type HourOfDayChartViewProps = {
	rows: HourOfDayRow[];
};

export function HourOfDayChartView({ rows }: HourOfDayChartViewProps) {
	return (
		<ChartContainer
			config={chartConfig}
			className="aspect-auto min-h-56 w-full flex-1"
		>
			<BarChart data={rows} margin={{ left: 8, right: 8 }}>
				<CartesianGrid vertical={false} />
				<XAxis dataKey="hour" tickLine={false} axisLine={false} interval={2} />
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
								`${payload[0]?.payload.hour} UK time`
							}
							formatter={megawattTooltipRow(chartConfig)}
						/>
					}
				/>
				<Bar
					dataKey="typicalMiss"
					fill="var(--color-typicalMiss)"
					radius={[3, 3, 0, 0]}
					isAnimationActive={false}
				/>
			</BarChart>
		</ChartContainer>
	);
}
