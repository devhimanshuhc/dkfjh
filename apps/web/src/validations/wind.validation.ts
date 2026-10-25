import { z } from "zod";
import {
	DEFAULT_HORIZON_HOURS,
	FIRST_DELIVERY_DATE,
	LAST_DELIVERY_DATE,
	MAX_HORIZON_HOURS,
} from "@/constants";

const deliveryDate = (fallback: string) =>
	z
		.string()
		.regex(/^\d{4}-\d{2}-\d{2}$/)
		.refine((date) => date >= FIRST_DELIVERY_DATE && date <= LAST_DELIVERY_DATE)
		.catch(fallback);

export const windFiltersSchema = z
	.object({
		startDate: deliveryDate(FIRST_DELIVERY_DATE),
		endDate: deliveryDate(LAST_DELIVERY_DATE),
		horizonHours: z.coerce
			.number()
			.int()
			.min(0)
			.max(MAX_HORIZON_HOURS)
			.catch(DEFAULT_HORIZON_HOURS),
	})
	.transform((filters) =>
		filters.startDate > filters.endDate
			? { ...filters, endDate: filters.startDate }
			: filters,
	);
