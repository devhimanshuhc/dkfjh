const ELEXON_URL = "https://bmrs.elexon.co.uk/";

export function LandingFooterView() {
	return (
		<footer className="text-muted-foreground mx-auto max-w-6xl border-t px-4 py-8 text-center text-sm">
			Data: wind power produced and wind forecasts for Great Britain, from{" "}
			<a
				href={ELEXON_URL}
				target="_blank"
				rel="noreferrer"
				className="underline underline-offset-4"
			>
				Elexon
			</a>
			. Covers electricity bought in January 2026 (used 2 January – 1 February).
		</footer>
	);
}
