import "./test-setup";
import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { ComparisonChartView } from "../charts/ComparisonChart.view";
import { DailyAverageChartView } from "../charts/DailyAverageChart.view";
import { ErrorDistributionChartView } from "../charts/ErrorDistributionChart.view";
import { ErrorOverTimeChartView } from "../charts/ErrorOverTimeChart.view";
import { HorizonAccuracyChartView } from "../charts/HorizonAccuracyChart.view";
import { HourOfDayChartView } from "../charts/HourOfDayChart.view";
import { megawattTooltipRow } from "../charts/chart-formatters";

const charts = {
	comparison: (
		<ComparisonChartView
			rows={[{ time: 0, actual: 1, forecast: null, error: null, publishedAt: null }]}
		/>
	),
	errorOverTime: (
		<ErrorOverTimeChartView rows={[{ time: 0, overForecast: 5, underForecast: null }]} />
	),
	daily: <DailyAverageChartView rows={[{ date: "2026-01-02", actual: 1, forecast: 2 }]} />,
	distribution: (
		<ErrorDistributionChartView
			rows={[{ label: "0 to 0.5 GW", lowerMw: 0, overForecastHours: 3, underForecastHours: 0 }]}
		/>
	),
	hourOfDay: <HourOfDayChartView rows={[{ hour: "05:00", typicalMiss: 2000 }]} />,
	horizon: (
		<HorizonAccuracyChartView
			rows={[{ horizonHours: 24, typicalMiss: 1900, planningMargin: 3800 }]}
			selectedHorizonHours={24}
		/>
	),
};

describe("wind charts", () => {
	it.each(Object.entries(charts))("renders the %s chart", (_, chart) => {
		const { container } = render(chart);

		expect(container.querySelector("[data-slot='chart']")).toBeTruthy();
	});

	it("labels tooltip rows from the chart config", () => {
		const row = megawattTooltipRow({ actual: { label: "Actual" } })(1500, "actual");
		const { getByText } = render(<>{row}</>);

		expect(getByText("Actual")).toBeTruthy();
		expect(getByText("1,500 MW")).toBeTruthy();
	});
});
