import { Skeleton } from "@repo/ui/components/skeleton";
import AlertMessage from "@repo/ui/general/AlertMessage";
import { NoWindDataView } from "./NoWindData.view";

type QueryStateViewProps = {
	isLoading: boolean;
	error: Error | null;
	isEmpty: boolean;
	skeletonClassName: string;
	children: React.ReactNode;
};

export function QueryStateView({
	isLoading,
	error,
	isEmpty,
	skeletonClassName,
	children,
}: QueryStateViewProps) {
	if (isLoading) return <Skeleton className={skeletonClassName} />;
	if (error)
		return <AlertMessage variant="destructive" message={error.message} />;
	if (isEmpty) return <NoWindDataView />;
	return children;
}
