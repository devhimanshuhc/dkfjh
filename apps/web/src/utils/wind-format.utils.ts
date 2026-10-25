import { UK_TIMEZONE } from "@/constants";

const megawattFormatter = new Intl.NumberFormat("en-GB", {
	maximumFractionDigits: 0,
});

const ukDateTimeFormatter = new Intl.DateTimeFormat("en-GB", {
	timeZone: UK_TIMEZONE,
	day: "numeric",
	month: "short",
	hour: "2-digit",
	minute: "2-digit",
});

const ukDayFormatter = new Intl.DateTimeFormat("en-GB", {
	timeZone: UK_TIMEZONE,
	day: "numeric",
	month: "short",
});

const ukTimeFormatter = new Intl.DateTimeFormat("en-GB", {
	timeZone: UK_TIMEZONE,
	hour: "2-digit",
	minute: "2-digit",
});

const ukLongDayFormatter = new Intl.DateTimeFormat("en-GB", {
	timeZone: UK_TIMEZONE,
	weekday: "short",
	day: "numeric",
	month: "short",
});

export function formatMegawatts(value: number): string {
	return `${megawattFormatter.format(value)} MW`;
}

export function formatSignedMegawatts(value: number): string {
	const sign = value > 0 ? "+" : "";
	return `${sign}${formatMegawatts(value)}`;
}

export function formatUkDateTime(timestamp: string | number): string {
	return ukDateTimeFormatter.format(new Date(timestamp));
}

export function formatUkDay(timestamp: string | number): string {
	return ukDayFormatter.format(new Date(timestamp));
}

export function formatUkTime(timestamp: string | number): string {
	return ukTimeFormatter.format(new Date(timestamp));
}

export function formatUkLongDay(isoDate: string): string {
	return ukLongDayFormatter.format(new Date(`${isoDate}T12:00:00Z`));
}

export function formatHourOfDay(hour: number): string {
	return `${String(hour).padStart(2, "0")}:00`;
}

export function formatPercentOf(value: number, total: number): string {
	if (total === 0) return "–";
	return `${Math.round((value / total) * 100)}%`;
}
