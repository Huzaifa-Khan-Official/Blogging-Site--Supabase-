"use client";

export default function SinglePostSkeleton() {
    return (
        <div className="max-w-4xl mx-auto p-6 animate-pulse">
            {/* Title */}
            <div className="h-8 bg-gray-300 rounded w-3/4 mb-6"></div>

            {/* Meta info (author, category, time) */}
            <div className="flex gap-3 mb-8">
                <div className="h-4 w-16 bg-gray-300 rounded"></div>
                <div className="h-4 w-10 bg-gray-300 rounded"></div>
                <div className="h-4 w-20 bg-gray-300 rounded"></div>
            </div>

            {/* Image */}
            <div className="w-full h-64 bg-gray-300 rounded-lg mb-8"></div>

            {/* Short description */}
            <div className="space-y-3 mb-6">
                <div className="h-4 bg-gray-300 rounded w-11/12"></div>
                <div className="h-4 bg-gray-300 rounded w-9/12"></div>
            </div>

            {/* Blog content lines */}
            <div className="space-y-3">
                <div className="h-4 bg-gray-300 rounded w-full"></div>
                <div className="h-4 bg-gray-300 rounded w-10/12"></div>
                <div className="h-4 bg-gray-300 rounded w-9/12"></div>
                <div className="h-4 bg-gray-300 rounded w-11/12"></div>
                <div className="h-4 bg-gray-300 rounded w-8/12"></div>
            </div>
        </div>
    );
}
