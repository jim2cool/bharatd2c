import { notFound } from "next/navigation";
import SortSelect from "@/components/ui/sort-select";
import { getProductsByCollection } from "@/lib/products";
import CategoryGridManager from "@/components/storefront/catalog/CategoryGridManager";
import MandatoryFilterSystem from "@/components/storefront/catalog/MandatoryFilterSystem";

type SearchParams = {
  page?: string;
  sort?: string;
  minPrice?: string;
  maxPrice?: string;
  inStock?: string;
  subcategory?: string | string[];
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

  const filters = {
    minPrice: resolvedSearchParams.minPrice ? Number(resolvedSearchParams.minPrice) : undefined,
    maxPrice: resolvedSearchParams.maxPrice ? Number(resolvedSearchParams.maxPrice) : undefined,
    inStock: resolvedSearchParams.inStock === "true",
    subcategories: resolvedSearchParams.subcategory
      ? (Array.isArray(resolvedSearchParams.subcategory) ? resolvedSearchParams.subcategory : [resolvedSearchParams.subcategory])
      : undefined
  };

  const { products, total } = await getProductsByCollection(
    storeId,
    slug,
    page,
    PAGE_SIZE,
    sort,
    filters
  );

  const totalPages = Math.ceil(total / PAGE_SIZE);
  const title = slug.replace(/-/g, " ");

  // In a robust implementation, these categories might be dynamically fetched from the DB
  // For the MVP, we can provide some basic ones or extract from products
  const availableCategories = Array.from(new Set(products.map((p: any) => p.category).filter(Boolean))) as string[];

  return (
    <main className="bg-white min-h-screen">
      <section className="pt-8 pb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* HEADER */}
          <header className="mb-10 text-center md:text-left">
            <h1 className="text-3xl md:text-5xl font-black tracking-tighter capitalize text-neutral-900 mb-2">
              {title}
            </h1>
            <p className="text-neutral-500 font-medium">
              Showing {products.length} of {total} products
            </p>
          </header>

          <div className="flex flex-col lg:flex-row gap-8 items-start">
            {/* SIDEBAR FILTER SYSTEM */}
            <MandatoryFilterSystem categories={availableCategories} />

            {/* MAIN CONTENT AREA */}
            <div className="flex-1 w-full min-w-0">
              {/* SORT BAR */}
              <div className="mb-6 flex items-center justify-between border-b pb-4">
                <div />
                <SortSelect
                  currentSort={sort}
                  basePath={`/collections/${slug}`}
                />
              </div>

              {/* DYNAMIC GRID MANAGER */}
              <CategoryGridManager products={products} />

              {/* PAGINATION */}
              {totalPages > 1 && (
                <div className="mt-16 flex items-center justify-center gap-2 border-t pt-8">
                  {Array.from({ length: totalPages }).map((_, i) => {
                    const pageNum = i + 1;
                    const isActive = pageNum === page;
                    // Construct search params string preserving filters
                    const currentParams = new URLSearchParams();
                    if (filters.minPrice) currentParams.set("minPrice", filters.minPrice.toString());
                    if (filters.maxPrice) currentParams.set("maxPrice", filters.maxPrice.toString());
                    if (filters.inStock) currentParams.set("inStock", "true");
                    if (filters.subcategories) filters.subcategories.forEach(sub => currentParams.append("subcategory", sub));
                    currentParams.set("sort", sort);
                    currentParams.set("page", pageNum.toString());

                    return (
                      <a
                        key={pageNum}
                        href={`/collections/${slug}?${currentParams.toString()}`}
                        className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${isActive
                          ? "bg-black text-white shadow-md ring-1 ring-black"
                          : "border border-neutral-200 text-neutral-600 hover:bg-neutral-50 hover:text-black hover:border-neutral-300"
                          }`}
                      >
                        {pageNum}
                      </a>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
