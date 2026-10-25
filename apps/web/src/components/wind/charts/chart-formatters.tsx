import type { ChartConfig } from "@repo/ui/components/chart";
import { formatMegawatts } from "@/utils";

const tickFormatter = new Intl.NumberFormat("en-GB");

export const formatMegawattTick = (megawatts: number) =>
	tickFormatter.format(megawatts);

export function tooltipRow(
	config: ChartConfig,
	formatValue: (value: number) => string,
) {
	return (value: unknown, name: unknown) => (
		<span className="flex w-full justify-between gap-4">
			<span className="text-muted-foreground">
				{config[String(name)]?.label}
			</span>
			<span className="font-mono">{formatValue(Number(value))}</span>
		</span>
	);
}

export const megawattTooltipRow = (config: ChartConfig) =>
	tooltipRow(config, formatMegawatts);
