"use client";

export default function PDPLoading() {
  return (
    <div className="max-w-6xl mx-auto px-4 py-20">
      <div className="animate-pulse space-y-6">
        <div className="h-64 bg-gray-200 rounded" />
        <div className="h-6 bg-gray-200 rounded w-2/3" />
        <div className="h-5 bg-gray-200 rounded w-1/3" />
        <div className="h-12 bg-gray-200 rounded w-full" />
      </div>
    </div>
  );
}
