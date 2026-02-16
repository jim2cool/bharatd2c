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

import { getActiveStore } from "@/lib/getActiveStore";

export default async function CollectionPage({
  params,
  searchParams,
}: {
  params: Promise<{ slug?: string }>;
  searchParams: Promise<SearchParams>;
}) {
  const resolvedParams = await params;
  const resolvedSearchParams = await searchParams;
  const store = await getActiveStore();

  if (!store) return notFound();
  const storeId = store.id;

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

  const availableCategories = Array.from(new Set(products.map((p: any) => p.category).filter(Boolean))) as string[];

  // Layout Intelligence
  const architecture = store.commerce_architecture || 'product_engine';
  const layoutVariant = architecture === 'catalog_first' ? 'sidebar_filters' :
    architecture === 'story_first' ? 'minimal_filters' : 'top_filters';

  return (
    <main className="bg-[var(--bg-primary)] min-h-screen">
      <section className="pt-8 pb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* HEADER */}
          <header className={`mb-10 ${layoutVariant === 'minimal_filters' ? 'text-center' : 'text-center md:text-left'}`}>
            <h1 className="text-3xl md:text-5xl font-[var(--font-weight-display)] tracking-tighter capitalize text-[var(--text-primary)] mb-2" style={{ fontFamily: 'var(--heading-font)' }}>
              {title}
            </h1>
            <p className="text-[var(--text-secondary)] font-medium">
              Showing {products.length} of {total} products
            </p>
          </header>

          <div className={`flex flex-col lg:flex-row gap-8 items-start ${layoutVariant === 'top_filters' ? 'lg:flex-col' : ''}`}>
            {/* SIDEBAR/TOP FILTER SYSTEM */}
            <MandatoryFilterSystem
              categories={availableCategories}
              variant={layoutVariant}
            />

            {/* MAIN CONTENT AREA */}
            <div className="flex-1 w-full min-w-0">
              {/* SORT BAR */}
              <div className="mb-6 flex items-center justify-between border-b border-[var(--border)] pb-4">
                <div />
                <SortSelect
                  currentSort={sort}
                  basePath={`/collections/${slug}`}
                />
              </div>

              {/* DYNAMIC GRID MANAGER */}
              <CategoryGridManager
                products={products}
                density={architecture === 'catalog_first' ? 'dense' : architecture === 'story_first' ? 'editorial' : 'standard'}
              />

              {/* PAGINATION */}
              {totalPages > 1 && (
                <div className="mt-16 flex items-center justify-center gap-2 border-t border-[var(--border)] pt-8">
                  {Array.from({ length: totalPages }).map((_, i) => {
                    const pageNum = i + 1;
                    const isActive = pageNum === page;
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
                        className={`px-4 py-2 rounded-[var(--radius-button)] text-sm font-semibold transition-all ${isActive
                          ? "bg-[var(--primary)] text-[var(--cta-text)] shadow-md ring-1 ring-[var(--primary)]"
                          : "border border-[var(--border)] text-[var(--text-secondary)] hover:bg-[var(--bg-secondary)] hover:text-[var(--text-primary)] hover:border-[var(--border)]"
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
