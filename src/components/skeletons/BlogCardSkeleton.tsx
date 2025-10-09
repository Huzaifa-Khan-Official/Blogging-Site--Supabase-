export default function BlogCardSkeleton() {
    return (
        <div className="flex gap-4 p-4 rounded-xl bg-white/30 shadow animate-pulse">
            {/* Image skeleton */}
            <div className="w-40 h-28 bg-gray-300 rounded-md"></div>

            {/* Text skeleton */}
            <div className="flex flex-col flex-1 space-y-3">
                {/* Title */}
                <div className="w-1/2 h-5 bg-gray-300 rounded"></div>

                {/* Description */}
                <div className="w-full h-3 bg-gray-300 rounded"></div>
                <div className="w-5/6 h-3 bg-gray-300 rounded"></div>
                <div className="w-3/4 h-3 bg-gray-300 rounded"></div>

                {/* Small text line */}
                <div className="w-1/3 h-3 bg-gray-300 rounded"></div>
            </div>
        </div>
    );
}
