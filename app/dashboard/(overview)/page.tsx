import { roboto } from "@/app/ui/fonts";
import { CardsSkeleton, LatestInvoicesSkeleton, RevenueChartSkeleton } from "@/app/ui/skeletons";
import { Suspense } from "react";

export default async function Page() {
    return (
        <main>
            <h1 className={`${roboto.className} mb-4 text-x1 md:text-2x1`}>
                Dashboard
            </h1>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                <Suspense fallback={<CardsSkeleton />}>

                </Suspense>
            </div>
            <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-4 lg:grid-cols-8">
                <Suspense fallback={<RevenueChartSkeleton />}>

                </Suspense>
                <Suspense fallback={<LatestInvoicesSkeleton />}>

                </Suspense>
            </div>
        </main>
    );
} 