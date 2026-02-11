import Link from "next/link";
import { collections } from "@/lib/collections";

export default function CollectionsPage() {
  return (
    <main className="min-h-screen bg-background">
      <section className="container px-4 md:px-6 py-16 mx-auto max-w-[1400px]">
        {/* Header */}
        <header className="mb-12 text-center space-y-2">
          <h1 className="text-3xl md:text-4xl font-normal tracking-tight text-foreground">
            Collections
          </h1>
          <p className="text-muted-foreground text-sm md:text-base">
            Curated groups for different needs and routines
          </p>
        </header>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {collections.map((c) => (
            <Link
              key={c.slug}
              href={`/collections/${c.slug}`}
              className="group block relative overflow-hidden"
            >
              <div className="aspect-square bg-muted/20 overflow-hidden rounded-sm">
                <img
                  src={c.image}
                  alt={c.title}
                  className="h-full w-full object-cover transition-transform duration-700 ease-in-out group-hover:scale-105"
                />
              </div>

              <div className="mt-4 text-center">
                <h3 className="text-lg font-medium text-foreground flex items-center justify-center gap-2">
                  {c.title}
                  <span className="inline-block transform transition-transform group-hover:translate-x-1">→</span>
                </h3>
                {c.description && (
                  <p className="mt-1 text-sm text-muted-foreground line-clamp-2 max-w-xs mx-auto">
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
