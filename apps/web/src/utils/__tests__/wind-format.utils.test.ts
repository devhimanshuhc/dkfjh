import { describe, expect, it } from "vitest";
import {
	formatHourOfDay,
	formatMegawatts,
	formatPercentOf,
	formatSignedMegawatts,
	formatUkDateTime,
	formatUkDay,
	formatUkLongDay,
	formatUkTime,
} from "../wind-format.utils";

describe("wind formatting", () => {
	it("formats megawatts with thousands separators and no decimals", () => {
		expect(formatMegawatts(1932.6)).toBe("1,933 MW");
	});

	it("prefixes positive values with a plus sign only", () => {
		expect(formatSignedMegawatts(250)).toBe("+250 MW");
		expect(formatSignedMegawatts(-250)).toBe("-250 MW");
		expect(formatSignedMegawatts(0)).toBe("0 MW");
	});


	it("formats timestamps in UK time", () => {
		expect(formatUkDateTime("2026-01-02T18:00:00Z")).toBe("2 Jan, 18:00");
		expect(formatUkDay("2026-01-02T18:00:00Z")).toBe("2 Jan");
		expect(formatUkTime("2026-01-02T18:00:00Z")).toBe("18:00");
		expect(formatUkLongDay("2026-01-02")).toBe("Fri 2 Jan");
	});

	it("formats an hour of day as a two-digit clock time", () => {
		expect(formatHourOfDay(5)).toBe("05:00");
	});

	it("expresses a value as a rounded share of a total", () => {
		expect(formatPercentOf(1932, 11285)).toBe("17%");
		expect(formatPercentOf(5, 0)).toBe("–");
	});
});
