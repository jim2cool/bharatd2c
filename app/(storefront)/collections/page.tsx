import Link from "next/link";
import { getCollections } from "@/lib/collections";
import { getActiveStoreId } from "@/lib/getActiveStore";
import { notFound } from "next/navigation";

export default async function CollectionsPage() {
  const storeId = await getActiveStoreId();
  if (!storeId) return notFound();

  const collections = await getCollections(storeId);

  return (
    <main className="min-h-screen bg-[var(--bg-primary)]">
      <section className="container px-4 md:px-6 py-16 mx-auto max-w-[1400px]">
        {/* Header */}
        <header className="mb-12 text-center space-y-2">
          <h1 className="text-3xl md:text-4xl font-[var(--font-weight-display)] tracking-tight text-[var(--text-primary)]" style={{ fontFamily: 'var(--heading-font)' }}>
            Collections
          </h1>
          <p className="text-[var(--text-secondary)] text-sm md:text-base">
            Curated groups for different needs and routines
          </p>
        </header>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {collections.map((c) => (
            <Link
              key={c.slug}
              href={`/collections/${c.slug}`}
              className="group block relative overflow-hidden"
            >
              <div className="aspect-square bg-[var(--bg-secondary)] overflow-hidden rounded-[var(--radius-card)]">
                {c.image && (
                  <img
                    src={c.image}
                    alt={c.title}
                    className="h-full w-full object-cover transition-transform duration-700 ease-in-out group-hover:scale-105"
                  />
                )}
              </div>

              <div className="mt-4 text-center">
                <h3 className="text-lg font-medium text-[var(--text-primary)] flex items-center justify-center gap-2">
                  {c.title}
                  <span className="inline-block transform transition-transform group-hover:translate-x-1">→</span>
                </h3>
                {c.description && (
                  <p className="mt-1 text-sm text-[var(--text-secondary)] line-clamp-2 max-w-xs mx-auto">
                    {c.description}
                  </p>
                )}
              </div>
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
}
