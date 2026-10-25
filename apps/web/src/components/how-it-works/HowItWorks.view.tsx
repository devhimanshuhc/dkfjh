import { SectionCardView } from "@/components/wind/SectionCard.view";
import { GLOSSARY } from "@/constants";
import { ForecastTimelineView } from "./ForecastTimeline.view";

const ELEXON_ACTUALS_URL =
	"https://bmrs.elexon.co.uk/api-documentation/endpoint/datasets/FUELHH/stream";
const ELEXON_FORECASTS_URL =
	"https://bmrs.elexon.co.uk/api-documentation/endpoint/datasets/WINDFOR/stream";

const DATA_SOURCES = [
	{
		name: "What wind farms actually produced (FUELHH)",
		href: ELEXON_ACTUALS_URL,
		detail:
			"How much electricity all of Great Britain's wind farms produced, measured every 30 minutes.",
	},
	{
		name: "Wind forecasts (WINDFOR)",
		href: ELEXON_FORECASTS_URL,
		detail:
			"Forecasts of how much wind power there will be in each hour. A new forecast comes out about 8 times a day and looks up to almost 3 days ahead.",
	},
];

const ASSUMPTIONS = [
	"We look at electricity bought during January 2026. Each purchase is for the next day, so the hours we check run from 2 January to 1 February 2026.",
	"Forecasts are given for each hour, but real wind power is measured every half hour. So we compare them once an hour, on the hour.",
	"All times are shown in UK time.",
	"Only Great Britain–wide wind power data from Elexon is used, as the brief asked.",
];

const LIMITATIONS = [
	"This covers one month only — other times of year may look different.",
	"Sometimes wind farms are asked to turn down because the grid cannot take all their power. Their recorded output is then lower than the wind that was available, which may be part of why forecasts look too high. We have not adjusted for this.",
	"For forecasts made more than about 2 days ahead there are fewer hours to compare, because not every forecast looks that far ahead.",
];

export function HowItWorksView() {
	return (
		<div className="space-y-6">
			<SectionCardView
				title="The problem"
				description="An energy company has to buy electricity one day before its customers use it. Part of what customers need comes from wind farms, so the company has to guess how much wind there will be tomorrow — using a wind forecast. Whatever wind will not cover, it buys from other power stations."
			>
				<p className="text-sm">
					Electricity to buy ≈ what customers need − wind expected. If the
					forecast promises too much wind, the company buys too little and has
					to buy the rest at the last minute, usually at a higher price.
				</p>
			</SectionCardView>

			<SectionCardView
				title="Where the data comes from"
				description="Two public datasets from Elexon, which publishes Great Britain's official electricity market data. Nothing else is used."
			>
				<ul className="space-y-3">
					{DATA_SOURCES.map((source) => (
						<li key={source.name} className="text-sm">
							<a
								href={source.href}
								target="_blank"
								rel="noreferrer"
								className="font-medium underline underline-offset-4"
							>
								{source.name}
							</a>
							<p className="text-muted-foreground">{source.detail}</p>
						</li>
					))}
				</ul>
			</SectionCardView>

			<SectionCardView
				title="Which forecast do we use for each hour?"
				description="For any hour, many forecasts were made — some days before, some just before. We use the most recent forecast that already existed at the time you choose (for example 24 hours before), because that is what a buyer could actually have seen."
			>
				<ForecastTimelineView />
			</SectionCardView>

			<SectionCardView
				title="What the words mean"
				description="Every number compares that forecast with what actually happened, one hour at a time."
			>
				<dl className="grid gap-4 sm:grid-cols-2">
					{Object.values(GLOSSARY).map(({ term, definition }) => (
						<div key={term} className="space-y-1">
							<dt className="text-sm font-medium">{term}</dt>
							<dd className="text-muted-foreground text-sm">{definition}</dd>
						</div>
					))}
				</dl>
			</SectionCardView>

			<div className="grid gap-6 lg:grid-cols-2">
				<SectionCardView title="What we assumed">
					<ul className="list-disc space-y-2 pl-5 text-sm">
						{ASSUMPTIONS.map((assumption) => (
							<li key={assumption}>{assumption}</li>
						))}
					</ul>
				</SectionCardView>
				<SectionCardView title="What to keep in mind">
					<ul className="list-disc space-y-2 pl-5 text-sm">
						{LIMITATIONS.map((limitation) => (
							<li key={limitation}>{limitation}</li>
						))}
					</ul>
				</SectionCardView>
			</div>
		</div>
	);
}
