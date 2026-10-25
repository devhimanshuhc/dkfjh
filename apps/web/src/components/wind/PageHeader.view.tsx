type PageHeaderViewProps = {
	title: string;
	description?: string;
	children?: React.ReactNode;
};

export function PageHeaderView({
	title,
	description,
	children,
}: PageHeaderViewProps) {
	return (
		<header className="space-y-1">
			<h1 className="text-2xl font-semibold">{title}</h1>
			{description && (
				<p className="text-muted-foreground max-w-3xl text-sm">{description}</p>
			)}
			{children}
		</header>
	);
}
