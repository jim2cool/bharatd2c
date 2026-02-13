import { notFound } from "next/navigation";
import ProductCard from "@/components/ui/product-card";
import SortSelect from "@/components/ui/sort-select";
import { getProductsByCollection } from "@/lib/products";

type SearchParams = {
  page?: string;
  sort?: string;
};

import { getActiveStoreId } from "@/lib/getActiveStore";

export default async function CollectionPage({
  params,
  searchParams,
}: {
  params: Promise<{ slug?: string }>;
  searchParams: Promise<SearchParams>;
}) {
  const resolvedParams = await params;
  const resolvedSearchParams = await searchParams;
  const storeId = await getActiveStoreId();

  if (!storeId) return notFound();

  const slug = (resolvedParams.slug ?? "").toLowerCase().trim();

  if (!slug) {
    notFound();
  }

  const page = Number(resolvedSearchParams.page) || 1;
  const sort = resolvedSearchParams.sort || "newest";
  const PAGE_SIZE = 12;

  const { products, total } = await getProductsByCollection(
    storeId,
    slug,
    page,
    PAGE_SIZE,
    sort
  );

  const totalPages = Math.ceil(total / PAGE_SIZE);
  const title = slug.replace(/-/g, " ");

  return (
    <main>
      <section className="section">
        <div className="container">
          {/* HEADER */}
          <header className="section-header">
            <h1 className="section-title capitalize">
              {title}
            </h1>
            <p className="section-subtitle">
              Showing {products.length} products
            </p>
          </header>

          {/* SORT BAR */}
          <div className="mb-6 flex items-center justify-between">
            <div />
            <SortSelect
              currentSort={sort}
              basePath={`/collections/${slug}`}
            />
          </div>

          {/* GRID */}
          {products.length > 0 ? (
            <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
              {products.map((product: any) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <p className="text-center text-gray-500 py-20">
              No products found in this collection.
            </p>
          )}

          {/* PAGINATION */}
          {totalPages > 1 && (
            <div className="mt-12 flex items-center justify-center gap-2">
              {Array.from({ length: totalPages }).map((_, i) => {
                const pageNum = i + 1;
                const isActive = pageNum === page;

                return (
                  <a
                    key={pageNum}
                    href={`/collections/${slug}?page=${pageNum}&sort=${sort}`}
                    className={`px-3 py-1.5 rounded-md text-sm transition-colors ${isActive
                      ? "bg-primary text-white"
                      : "border border-gray-300 text-gray-700 hover:bg-gray-100"
                      }`}
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
