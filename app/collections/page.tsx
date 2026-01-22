import Link from "next/link";
import { collections } from "@/lib/collections";

export default function CollectionsPage() {
  return (
    <main className="bg-white">
      <section className="container py-12">
        {/* Header */}
        <div className="mb-10 text-center">
          <h1 className="text-2xl md:text-3xl font-semibold">
            Collections
          </h1>
          <p className="mt-2 text-sm text-gray-500">
            Curated groups for different needs and routines
          </p>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
          {collections.map((c) => (
            <Link
              key={c.slug}
              href={`/collections/${c.slug}`}
              className="block rounded-lg overflow-hidden border border-gray-200 hover:shadow-sm transition"
            >
              <div className="aspect-square bg-gray-100">
                <img
                  src={c.image}
                  alt={c.title}
                  className="h-full w-full object-cover"
                />
              </div>

              <div className="p-4">
                <h3 className="text-sm font-semibold text-gray-900">
                  {c.title}
                </h3>
                <p className="mt-1 text-xs text-gray-500">
                  {c.description}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
}
