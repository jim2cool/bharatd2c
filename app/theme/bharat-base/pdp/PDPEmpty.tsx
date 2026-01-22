"use client";

export default function PDPEmpty() {
  return (
    <div className="max-w-6xl mx-auto px-4 py-20 text-center">
      <h2 className="text-xl font-semibold">Product not found</h2>
      <p className="mt-2 text-gray-600">
        This product may be unavailable or removed.
      </p>
    </div>
  );
}
