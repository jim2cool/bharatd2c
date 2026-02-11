import { Skeleton } from "@/components/ui/skeleton";

export default function PDPSkeleton() {
    return (
        <div className="max-w-[1200px] mx-auto px-4 md:px-6 lg:px-8 py-6 md:py-10">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-12 gap-y-10">

                {/* LEFT COLUMN: Media Gallery Skeleton */}
                <div className="w-full">
                    <Skeleton className="aspect-square w-full rounded-lg" />
                    <div className="flex gap-2 mt-4 overflow-hidden">
                        {[1, 2, 3, 4].map((i) => (
                            <Skeleton key={i} className="h-20 w-20 shrink-0 rounded-md" />
                        ))}
                    </div>
                </div>

                {/* RIGHT COLUMN: Product Info Skeleton */}
                <div className="flex flex-col gap-6">
                    <div className="space-y-2">
                        <Skeleton className="h-10 w-3/4" />
                        <Skeleton className="h-6 w-1/2" />
                    </div>

                    <div className="flex items-center gap-2">
                        <Skeleton className="h-5 w-24" />
                        <Skeleton className="h-5 w-16" />
                    </div>

                    <div className="space-y-3 pt-4">
                        {[1, 2, 3].map((i) => (
                            <div key={i} className="flex items-center gap-3">
                                <Skeleton className="h-5 w-5 rounded-full" />
                                <Skeleton className="h-4 w-full" />
                            </div>
                        ))}
                    </div>

                    <div className="mt-8 space-y-4">
                        <Skeleton className="h-14 w-full rounded-md" />
                        <Skeleton className="h-14 w-full rounded-md" />
                        <Skeleton className="h-10 w-full rounded-md" />
                    </div>

                    <div className="space-y-2 mt-6">
                        <Skeleton className="h-12 w-full" />
                        <Skeleton className="h-12 w-full" />
                    </div>
                </div>
            </div>
        </div>
    );
}
