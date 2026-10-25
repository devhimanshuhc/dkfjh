const CHART_LEFT = 48;
const CHART_RIGHT = 512;
const CHART_BASELINE = 326;
const PIXELS_PER_UNIT = 5.5;
const CYCLE = "9s";

const ACTUAL_SHAPE = [9, 11, 14, 13, 10, 7, 8, 12, 15, 14, 11, 9];
const FORECAST_OFFSET = [2, 2.5, 1.5, 3, 3.5, 2, 1, 2, 1.5, 3, 2.5, 2];
const FORECAST_SHAPE = ACTUAL_SHAPE.map(
	(value, index) => value + FORECAST_OFFSET[index],
);
const LARGEST_GAP_INDEX = 4;

const pointX = (index: number) =>
	CHART_LEFT + (index * (CHART_RIGHT - CHART_LEFT)) / (ACTUAL_SHAPE.length - 1);
const pointY = (value: number) => CHART_BASELINE - value * PIXELS_PER_UNIT;
const toLinePath = (values: number[]) =>
	values
		.map(
			(value, index) =>
				`${index === 0 ? "M" : "L"}${pointX(index)} ${pointY(value)}`,
		)
		.join(" ");

const TURBINES = [
	{ x: 140, hubY: 96, bladeLength: 46, spin: "4.2s" },
	{ x: 280, hubY: 70, bladeLength: 58, spin: "3.4s" },
	{ x: 420, hubY: 108, bladeLength: 40, spin: "5s" },
];

const blade = (x: number, hubY: number, length: number) =>
	`M${x} ${hubY} Q${x + 6} ${hubY - length / 2} ${x} ${hubY - length} Q${x - 6} ${hubY - length / 2} ${x} ${hubY} Z`;

const gapX = pointX(LARGEST_GAP_INDEX);
const gapTopY = pointY(FORECAST_SHAPE[LARGEST_GAP_INDEX]);
const gapBottomY = pointY(ACTUAL_SHAPE[LARGEST_GAP_INDEX]);

function Turbine({
	x,
	hubY,
	bladeLength,
	spin,
	animated,
}: (typeof TURBINES)[number] & { animated: boolean }) {
	return (
		<g>
			<path
				d={`M${x - 3} 188 L${x - 1.5} ${hubY} L${x + 1.5} ${hubY} L${x + 3} 188 Z`}
				className="fill-foreground/35"
			/>
			<g className="fill-foreground/70">
				{[0, 120, 240].map((angle) => (
					<path
						key={angle}
						d={blade(x, hubY, bladeLength)}
						transform={`rotate(${angle} ${x} ${hubY})`}
					/>
				))}
				{animated && (
					<animateTransform
						attributeName="transform"
						type="rotate"
						from={`0 ${x} ${hubY}`}
						to={`360 ${x} ${hubY}`}
						dur={spin}
						repeatCount="indefinite"
					/>
				)}
			</g>
			<circle cx={x} cy={hubY} r={4.5} className="fill-foreground/80" />
		</g>
	);
}

function HeroScene({ animated }: { animated: boolean }) {
	const revealId = animated ? "hero-reveal" : undefined;

	return (
		<svg
			viewBox="0 0 560 360"
			role="img"
			aria-label="Wind turbines turning, above a chart where the forecast line keeps running above the wind that actually came"
			className="h-auto w-full"
		>
			{animated && (
				<defs>
					<clipPath id="hero-reveal">
						<rect x={CHART_LEFT - 4} y={200} height={140} width={0}>
							<animate
								attributeName="width"
								values={`0;${CHART_RIGHT - CHART_LEFT + 8};${CHART_RIGHT - CHART_LEFT + 8};0`}
								keyTimes="0;0.5;0.92;1"
								dur={CYCLE}
								repeatCount="indefinite"
							/>
						</rect>
					</clipPath>
				</defs>
			)}

			<rect width={560} height={360} rx={20} className="fill-muted/50" />
			<path
				d="M0 196 Q140 150 280 178 T560 170 L560 360 L0 360 Z"
				className="fill-muted"
			/>
			{TURBINES.map((turbine) => (
				<Turbine key={turbine.x} {...turbine} animated={animated} />
			))}

			<rect
				x={24}
				y={196}
				width={512}
				height={148}
				rx={14}
				className="fill-background stroke-border"
			/>
			<g className="fill-muted-foreground text-[11px]">
				<line
					x1={40}
					y1={214}
					x2={60}
					y2={214}
					className="stroke-chart-3"
					strokeWidth={2.5}
				/>
				<text x={66} y={218}>
					What the wind actually did
				</text>
				<line
					x1={236}
					y1={214}
					x2={256}
					y2={214}
					className="stroke-chart-1"
					strokeWidth={2.5}
					strokeDasharray="5 4"
				/>
				<text x={262} y={218}>
					What the forecast said
				</text>
			</g>

			<g clipPath={revealId ? `url(#${revealId})` : undefined} fill="none">
				<path
					d={toLinePath(ACTUAL_SHAPE)}
					className="stroke-chart-3"
					strokeWidth={3}
					strokeLinejoin="round"
				/>
				<path
					d={toLinePath(FORECAST_SHAPE)}
					className="stroke-chart-1"
					strokeWidth={3}
					strokeDasharray="7 5"
					strokeLinejoin="round"
				/>
			</g>

			<g opacity={animated ? 0 : 1}>
				<line
					x1={gapX}
					y1={gapTopY}
					x2={gapX}
					y2={gapBottomY}
					className="stroke-destructive"
					strokeWidth={2}
				/>
				<circle cx={gapX} cy={gapTopY} r={3.5} className="fill-destructive" />
				<circle
					cx={gapX}
					cy={gapBottomY}
					r={3.5}
					className="fill-destructive"
				/>
				<text
					x={gapX + 10}
					y={(gapTopY + gapBottomY) / 2 + 4}
					className="fill-destructive text-[12px] font-medium"
				>
					Forecast too high
				</text>
				{animated && (
					<animate
						attributeName="opacity"
						values="0;0;1;1;0"
						keyTimes="0;0.5;0.58;0.9;1"
						dur={CYCLE}
						repeatCount="indefinite"
					/>
				)}
			</g>
		</svg>
	);
}

/** SMIL animations ignore prefers-reduced-motion, so a still copy is swapped in via CSS. */
export function HeroAnimationView() {
	return (
		<div className="ring-foreground/10 overflow-hidden rounded-2xl shadow-lg ring-1">
			<div className="motion-reduce:hidden">
				<HeroScene animated />
			</div>
			<div className="hidden motion-reduce:block">
				<HeroScene animated={false} />
			</div>
		</div>
	);
}
