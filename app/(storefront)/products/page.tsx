import ProductCard from "@/app/components/ProductCard";
import SortSelect from "@/app/components/SortSelect";
import { getProductsPaginated } from "@/lib/products";

type SearchParams = {
  page?: string;
  sort?: string;
};

import { getActiveStoreId } from "@/lib/getActiveStore";
import { notFound } from "next/navigation";

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const resolvedSearchParams = await searchParams;
  const storeId = await getActiveStoreId();

  if (!storeId) return notFound();

  const page = Number(resolvedSearchParams.page) || 1;
  const sort = resolvedSearchParams.sort || "newest"; // Default sort
  const PAGE_SIZE = 12;

  const { products, total } = await getProductsPaginated(
    storeId,
    page,
    PAGE_SIZE,
    sort
  );

  const totalPages = Math.ceil(total / PAGE_SIZE);

  return (
    <main className="min-h-screen bg-background">
      <section className="py-12 md:py-16">
        <div className="container px-4 md:px-6 mx-auto max-w-[1400px]">
          {/* HEADER */}
          <header className="mb-10 text-center space-y-2">
            <h1 className="text-3xl md:text-4xl font-normal tracking-tight text-foreground">
              All Products
            </h1>
            <p className="text-muted-foreground text-sm md:text-base">
              Thoughtfully curated for everyday Indian routines
            </p>
          </header>

          {/* CONTROLS */}
          <div className="mb-8 flex flex-col sm:flex-row items-center justify-between gap-4 border-b border-border/40 pb-6">
            <p className="text-sm text-muted-foreground">
              Showing {products.length} of {total} products
            </p>

            <div className="flex items-center gap-4">
              <span className="text-sm text-foreground/70 hidden sm:inline-block">Sort by:</span>
              <SortSelect
                currentSort={sort}
                basePath="/products"
              />
            </div>
          </div>

          {/* GRID */}
          {products.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-4 gap-y-8 md:gap-x-8 md:gap-y-12">
              {products.map((product: any) => (
                <ProductCard
                  key={product.id}
                  product={product}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-32 border border-dashed border-border/60 rounded-lg">
              <p className="text-muted-foreground">
                No products found.
              </p>
            </div>
          )}

          {/* PAGINATION */}
          {totalPages > 1 && (
            <div className="mt-16 flex items-center justify-center gap-2 border-t border-border/40 pt-12">
              {Array.from({ length: totalPages }).map((_, i) => {
                const pageNum = i + 1;
                const isActive = pageNum === page;

                return (
                  <a
                    key={pageNum}
                    href={`/products?page=${pageNum}&sort=${sort}`}
                    className={`
                      h-10 w-10 flex items-center justify-center rounded-sm text-sm font-medium transition-colors
                      ${isActive
                        ? "bg-foreground text-background"
                        : "text-foreground hover:bg-muted"
                      }
                    `}
                  >
                    {pageNum}
                  </a>
                );
              })}
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
