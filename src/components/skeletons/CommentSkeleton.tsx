export default function CommentSkeleton() {
    return (
        <div className="p-4 bg-slate-50 rounded-xl mb-2 animate-pulse">
            {/* User info */}
            <div className="flex items-center gap-4">
                {/* Profile image */}
                <div className="w-10 h-10 bg-gray-300 rounded-full"></div>

                {/* Username */}
                <div className="h-4 w-24 bg-gray-300 rounded"></div>

                {/* Date */}
                <div className="h-3 w-16 bg-gray-200 rounded"></div>

                {/* Delete button placeholder */}
                <div className="h-3 w-10 bg-gray-200 rounded ml-auto"></div>
            </div>

            {/* Comment text */}
            <div className="mt-3 space-y-2">
                <div className="h-3 w-11/12 bg-gray-300 rounded"></div>
                <div className="h-3 w-10/12 bg-gray-300 rounded"></div>
                <div className="h-3 w-8/12 bg-gray-300 rounded"></div>
            </div>
        </div>
    );
}
