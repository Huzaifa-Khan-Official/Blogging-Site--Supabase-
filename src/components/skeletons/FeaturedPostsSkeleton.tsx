"use client"

import { cn } from "@/lib/utils"
import { Skeleton } from "@/components/ui/skeleton"

type Props = {
    className?: string
    rightCount?: number
}

export function FeaturedPostsSkeleton({ className, rightCount = 3 }: Props) {
    return (
        <section aria-busy="true" aria-live="polite" role="status" className={cn("py-6", className)}>
            <span className="sr-only">Loading featured posts…</span>
            <div className="grid gap-8 md:grid-cols-2">
                {/* Left: Large featured placeholder */}
                <article className="flex flex-col gap-3">
                    <Skeleton className="w-full aspect-[703/400] rounded-3xl" />
                    <div className="flex items-center gap-4">
                        <Skeleton className="h-4 w-6 rounded-full" />
                        <Skeleton className="h-4 w-24 rounded-full" />
                        <Skeleton className="h-4 w-16 rounded-full" />
                    </div>
                    <Skeleton className="h-7 w-3/4 rounded-md md:h-10" />
                </article>

                {/* Right: Stacked compact placeholders */}
                <div className="flex flex-col gap-6">
                    {Array.from({ length: rightCount }).map((_, i) => (
                        <article key={i} className="flex items-start gap-4 rounded-2xl p-2">
                            <Skeleton className="w-[140px] md:w-[180px] aspect-[234/156] rounded-2xl" />
                            <div className="min-w-0 flex-1 space-y-2">
                                <div className="flex items-center gap-2">
                                    <Skeleton className="h-4 w-6 rounded-full" />
                                    <Skeleton className="h-4 w-20 rounded-full" />
                                    <Skeleton className="h-4 w-14 rounded-full" />
                                </div>
                                <Skeleton className="h-5 w-4/5 rounded-md md:h-6" />
                            </div>
                        </article>
                    ))}
                </div>
            </div>
        </section>
    )
}

export default FeaturedPostsSkeleton
