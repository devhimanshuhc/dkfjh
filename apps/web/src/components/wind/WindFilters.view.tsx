import { Field, FieldLabel } from "@repo/ui/components/field";
import { Input } from "@repo/ui/components/input";
import {
	NativeSelect,
	NativeSelectOption,
} from "@repo/ui/components/native-select";
import {
	FIRST_DELIVERY_DATE,
	HORIZON_OPTIONS_HOURS,
	LAST_DELIVERY_DATE,
} from "@/constants";
import type { WindFilters } from "@/types";
import { InfoTooltipView } from "./InfoTooltip.view";

type WindFiltersViewProps = {
	filters: WindFilters;
	onChange: (changes: Partial<WindFilters>) => void;
};

export function WindFiltersView({ filters, onChange }: WindFiltersViewProps) {
	return (
		<div className="flex flex-wrap items-end gap-4">
			<Field className="w-auto">
				<FieldLabel htmlFor="start-date">From</FieldLabel>
				<Input
					id="start-date"
					type="date"
					min={FIRST_DELIVERY_DATE}
					max={LAST_DELIVERY_DATE}
					value={filters.startDate}
					onChange={(event) => onChange({ startDate: event.target.value })}
				/>
			</Field>
			<Field className="w-auto">
				<FieldLabel htmlFor="end-date">To</FieldLabel>
				<Input
					id="end-date"
					type="date"
					min={filters.startDate}
					max={LAST_DELIVERY_DATE}
					value={filters.endDate}
					onChange={(event) => onChange({ endDate: event.target.value })}
				/>
			</Field>
			<Field className="w-auto">
				<div className="flex items-center gap-1">
					<FieldLabel htmlFor="horizon">Use forecasts made at least</FieldLabel>
					<InfoTooltipView term="horizon" />
				</div>
				<NativeSelect
					id="horizon"
					value={filters.horizonHours}
					onChange={(event) =>
						onChange({ horizonHours: Number(event.target.value) })
					}
				>
					{HORIZON_OPTIONS_HOURS.map((hours) => (
						<NativeSelectOption key={hours} value={hours}>
							{hours} {hours === 1 ? "hour" : "hours"} before
						</NativeSelectOption>
					))}
				</NativeSelect>
			</Field>
		</div>
	);
}
