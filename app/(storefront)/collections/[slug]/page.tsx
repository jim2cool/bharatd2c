import { notFound } from "next/navigation";
import ProductCard from "@/app/components/ProductCard";
import SortSelect from "@/app/components/SortSelect";
import { getProductsByCollection } from "@/lib/products";

type SearchParams = {
  page?: string;
  sort?: string;
};

export default async function CollectionPage({
  params,
  searchParams,
}: {
  params: Promise<{ slug?: string }>;
  searchParams: Promise<SearchParams>;
}) {
  const resolvedParams = await params;
  const resolvedSearchParams = await searchParams;

  const slug = (resolvedParams.slug ?? "").toLowerCase().trim();

  if (!slug) {
    notFound();
  }

  const page = Number(resolvedSearchParams.page) || 1;
  const sort = resolvedSearchParams.sort || "newest";
  const PAGE_SIZE = 12;

  const { products, total } = await getProductsByCollection(
    slug,
    page,
    PAGE_SIZE,
    sort
  );

  const totalPages = Math.ceil(total / PAGE_SIZE);
  const title = slug.replace(/-/g, " ");

  return (
    <main className="bg-white">
      <section className="py-12 min-h-[60vh]">
        <div className="max-w-[1280px] mx-auto px-5">
          {/* HEADER */}
          <div className="mb-8 text-center">
            <h1 className="text-2xl md:text-3xl font-semibold capitalize">
              {title}
            </h1>
            <p className="mt-2 text-sm text-gray-500">
              Showing {products.length} products
            </p>
          </div>

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
                    className={`px-3 py-1.5 rounded-md text-sm ${
                      isActive
                        ? "bg-[#1E2A5E] text-white"
                        : "border border-gray-300 text-gray-700 hover:bg-gray-50"
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
