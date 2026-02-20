"use client"

import React, { Suspense } from 'react';
import dynamic from 'next/dynamic';
import { usePDP } from '@/app/(storefront)/products/[slug]/context/PDPContext';
import { ProductInfo } from '@/app/(storefront)/products/[slug]/components/ProductInfo';
import { PriceBlock } from '@/app/(storefront)/products/[slug]/components/conversion/PriceBlock';
import { VariantSelector } from '@/app/(storefront)/products/[slug]/components/conversion/VariantSelector';
import { QuantitySelector } from '@/app/(storefront)/products/[slug]/components/conversion/QuantitySelector';
import { QuantityBreaks } from '@/app/(storefront)/products/[slug]/components/conversion/QuantityBreaks';
import { BundleSelector } from '@/app/(storefront)/products/[slug]/components/conversion/BundleSelector';
import { EstimatedDelivery } from '@/app/(storefront)/products/[slug]/components/conversion/EstimatedDelivery';
import { CTAGroup } from '@/app/(storefront)/products/[slug]/components/conversion/CTAGroup';
import { TrustStrip } from '@/app/(storefront)/products/[slug]/components/conversion/TrustStrip';
import { Highlights } from '@/app/(storefront)/products/[slug]/components/highlights/Highlights';
import { MediaGallery } from '@/app/(storefront)/products/[slug]/components/hero/MediaGallery';
import { usePDPHandlers } from '@/app/(storefront)/products/[slug]/hooks/usePDPHandlers';
import { toast } from 'sonner';
import { StorySection } from '@/app/(storefront)/products/[slug]/components/content/StorySection';
import { BrandNarrativeBlocks } from '@/app/(storefront)/products/[slug]/components/content/BrandNarrativeBlocks';
import { StaggeredGallery } from '@/app/(storefront)/products/[slug]/components/hero/StaggeredGallery';
// Lazy Loaded Category Modules
const IngredientsGlossary = dynamic(() => import('@/app/(storefront)/products/[slug]/components/beauty/IngredientsGlossary').then(mod => mod.IngredientsGlossary), { loading: () => <SlotSkeleton height="300px" /> });
const SpecsTable = dynamic(() => import('@/app/(storefront)/products/[slug]/components/tech/SpecsTable').then(mod => mod.SpecsTable), { loading: () => <SlotSkeleton height="400px" /> });
const EMICalculator = dynamic(() => import('@/app/(storefront)/products/[slug]/components/tech/EMICalculator').then(mod => mod.EMICalculator), { loading: () => <SlotSkeleton height="150px" /> });
const RitualGuide = dynamic(() => import('@/app/(storefront)/products/[slug]/components/spiritual/RitualGuide').then(mod => mod.RitualGuide), { loading: () => <SlotSkeleton height="350px" /> });
const AuthenticityNarrative = dynamic(() => import('@/app/(storefront)/products/[slug]/components/spiritual/AuthenticityNarrative').then(mod => mod.AuthenticityNarrative), { loading: () => <SlotSkeleton height="300px" /> });
const DocGradeCertifications = dynamic(() => import('@/app/(storefront)/products/[slug]/components/health/DocGradeCertifications').then(mod => mod.DocGradeCertifications), { loading: () => <SlotSkeleton height="100px" /> });
const UsageProtocol = dynamic(() => import('@/app/(storefront)/products/[slug]/components/health/UsageProtocol').then(mod => mod.UsageProtocol), { loading: () => <SlotSkeleton height="250px" /> });
const UrgencyController = dynamic(() => import('@/app/(storefront)/products/[slug]/components/behavioral/UrgencyController').then(mod => mod.UrgencyController), { ssr: false });
const SocialProofEngine = dynamic(() => import('@/app/(storefront)/products/[slug]/components/behavioral/SocialProofEngine').then(mod => mod.SocialProofEngine), { ssr: false });
const DimensionsSchematic = dynamic(() => import('@/app/(storefront)/products/[slug]/components/home/DimensionsSchematic').then(mod => mod.DimensionsSchematic), { loading: () => <SlotSkeleton height="300px" /> });
const InstallationGuide = dynamic(() => import('@/app/(storefront)/products/[slug]/components/home/InstallationGuide').then(mod => mod.InstallationGuide), { loading: () => <SlotSkeleton height="400px" /> });
const NutritionalTransparency = dynamic(() => import('@/app/(storefront)/products/[slug]/components/food/NutritionalTransparency').then(mod => mod.NutritionalTransparency), { loading: () => <SlotSkeleton height="300px" /> });
const FSSAIComplianceBlock = dynamic(() => import('@/app/(storefront)/products/[slug]/components/food/FSSAIComplianceBlock').then(mod => mod.FSSAIComplianceBlock), { loading: () => <SlotSkeleton height="100px" /> });
const FurnitureDimensionVisual = dynamic(() => import('@/app/(storefront)/products/[slug]/components/furniture/FurnitureDimensionVisual').then(mod => mod.FurnitureDimensionVisual), { loading: () => <SlotSkeleton height="400px" /> });
const DeliveryTimeline = dynamic(() => import('@/app/(storefront)/products/[slug]/components/furniture/DeliveryTimeline').then(mod => mod.DeliveryTimeline), { loading: () => <SlotSkeleton height="150px" /> });
const FinancingCalculator = dynamic(() => import('@/app/(storefront)/products/[slug]/components/furniture/FinancingCalculator').then(mod => mod.FinancingCalculator), { loading: () => <SlotSkeleton height="150px" /> });
const DropshippingStockCounter = dynamic(() => import('@/app/(storefront)/products/[slug]/components/dropshipping/DropshippingStockCounter').then(mod => mod.DropshippingStockCounter), { ssr: false, loading: () => <SlotSkeleton height="80px" /> });
const DropshippingShippingTimeline = dynamic(() => import('@/app/(storefront)/products/[slug]/components/dropshipping/DropshippingShippingTimeline').then(mod => mod.DropshippingShippingTimeline), { loading: () => <SlotSkeleton height="150px" /> });
const DropshippingSalesPulse = dynamic(() => import('@/app/(storefront)/products/[slug]/components/dropshipping/DropshippingSalesPulse').then(mod => mod.DropshippingSalesPulse), { ssr: false });
const BeforeAfterSlider = dynamic(() => import('@/app/(storefront)/products/[slug]/components/beauty/BeforeAfterSlider').then(mod => mod.BeforeAfterSlider), { loading: () => <SlotSkeleton height="400px" /> });
const SizeGuideModule = dynamic(() => import('@/app/(storefront)/products/[slug]/components/fashion/SizeGuideModule').then(mod => mod.SizeGuideModule), { loading: () => <SlotSkeleton height="300px" /> });
const FabricDetailsModule = dynamic(() => import('@/app/(storefront)/products/[slug]/components/fashion/FabricDetailsModule').then(mod => mod.FabricDetailsModule), { loading: () => <SlotSkeleton height="150px" /> });
const CertificationsModule = dynamic(() => import('@/app/(storefront)/products/[slug]/components/proof/CertificationsModule').then(mod => mod.CertificationsModule), { loading: () => <SlotSkeleton height="50px" /> });
import { CheckCircle2, Zap, Sparkles, Layout, Shirt, Globe, Layers } from 'lucide-react';

// Lazy Loaded Components
const ContentAccordions = dynamic(() => import('@/app/(storefront)/products/[slug]/components/content/ContentAccordions').then(mod => mod.ContentAccordions), {
    loading: () => <SlotSkeleton height="200px" />
});

const Proof = dynamic(() => import('@/app/(storefront)/products/[slug]/components/proof/Proof').then(mod => mod.Proof), {
    loading: () => <SlotSkeleton height="400px" />
});

const PeopleAlsoBought = dynamic(() => import('@/app/(storefront)/products/[slug]/components/aov/PeopleAlsoBought').then(mod => mod.PeopleAlsoBought), {
    loading: () => <SlotSkeleton height="300px" />
});

// Skeleton Helper
const SlotSkeleton = ({ height }: { height: string }) => (
    <div className="w-full bg-neutral-100 animate-pulse rounded-2xl" style={{ height }} />
);

export const SlotRenderer = ({ name }: { name: string }) => {
    const {
        product,
        selectedVariant,
        setSelectedVariant,
        qty,
        setQty,
        selectedBundleId,
        setSelectedBundleId,
        currentPrice,
        currentMrp,
        currentQty,
        prepaidSavings,
        currentStock,
        isSizeGuideOpen,
        setIsSizeGuideOpen
    } = usePDP();

    const { handleCod, handlePrepaid, handleAddToCart } = usePDPHandlers();

    switch (name) {
        case 'media-gallery':
            return <MediaGallery media={product.media} />;

        case 'staggered-gallery':
            return <StaggeredGallery />;

        case 'product-header':
            return <ProductInfo product={product} />;

        case 'price-display':
            return (
                <PriceBlock
                    mrp={currentMrp}
                    sellingPrice={currentPrice}
                    savingsAmount={currentMrp - currentPrice}
                    prepaidSavings={prepaidSavings}
                    stock={currentStock}
                />
            );

        case 'variant-selector':
            return product.has_variants ? (
                <VariantSelector
                    options={product.variant_options || []}
                    variants={product.variants || []}
                    onVariantSelect={setSelectedVariant}
                />
            ) : null;

        case 'quantity-selector':
            return (
                <QuantitySelector
                    qty={qty}
                    onQtyChange={setQty}
                />
            );

        case 'edd-display':
            return product.show_estimated_delivery ? (
                <EstimatedDelivery settings={product.shipping_settings} />
            ) : null;

        case 'cta-group':
            return (
                <CTAGroup
                    sellingPrice={currentPrice}
                    savingsAmount={currentMrp - currentPrice}
                    prepaidSavings={prepaidSavings}
                    onCodClick={handleCod}
                    onPrepaidClick={handlePrepaid}
                    onAddToCart={handleAddToCart}
                    codEnabled={product.cod_enabled}
                    prepaidEnabled={product.prepaid_enabled}
                    cartEnabled={product.cart_button_enabled}
                    prepaidOfferText={product.pricing.prepaid?.offerText}
                />
            );

        case 'trust-badges':
            return (
                <div className="space-y-4">
                    {product.trust_strip_image_url && (
                        <img src={product.trust_strip_image_url} alt="Trust" className="max-w-[280px] mx-auto opacity-80" />
                    )}
                    <TrustStrip indicators={product.trust_indicators} />
                </div>
            );

        case 'highlights':
            return <Highlights highlights={product.highlights} />;

        case 'bundles':
            if (product.bundle_settings?.enabled && product.bundle_settings?.tiers) {
                return (
                    <QuantityBreaks
                        currentQty={qty}
                        price={product.pricing.sellingPrice}
                        onQtySelect={setQty}
                        tiers={product.bundle_settings.tiers}
                        mostPopularIndex={product.bundle_settings.most_popular_index}
                    />
                );
            }
            if (!product.has_variants && product.bundles && product.bundles.length > 1) {
                return (
                    <BundleSelector
                        bundles={product.bundles}
                        selectedBundleId={selectedBundleId}
                        onSelect={setSelectedBundleId}
                    />
                );
            }
            return null;

        case 'trust-bar':
            return (
                <div className="flex items-center justify-between py-4 border-y text-[10px] font-bold uppercase tracking-widest text-neutral-500">
                    <span className="flex items-center gap-1.5"><CheckCircle2 className="w-3 h-3 text-green-500" /> SECURE CHECKOUT</span>
                    <span className="flex items-center gap-1.5"><CheckCircle2 className="w-3 h-3 text-green-500" /> QUALITY GUARANTEED</span>
                    <span className="flex items-center gap-1.5"><CheckCircle2 className="w-3 h-3 text-green-500" /> FAST SHIPPING</span>
                </div>
            );

        case 'story-section':
            return <StorySection />;

        case 'brand-narrative-blocks':
            return <BrandNarrativeBlocks />;

        case 'features-section':
            return (
                <div className="grid grid-cols-2 gap-4">
                    {product.highlights.map((h, i) => (
                        <div key={i} className="p-6 bg-neutral-50 rounded-2xl border aspect-square flex flex-col justify-center items-center text-center gap-3">
                            <div className="p-3 bg-white rounded-full shadow-sm"><Zap className="w-6 h-6 text-primary" /></div>
                            <span className="text-xs font-black uppercase tracking-wider leading-tight">{h.text}</span>
                        </div>
                    ))}
                </div>
            );

        case 'faq-section':
            return <ContentAccordions sections={product.content} />;

        case 'testimonials-section':
            return <Proof rating={product.rating} reviewCount={product.reviewCount} reviews={product.reviews} />;

        case 'accordions':
            return <ContentAccordions sections={product.content} intro={product.description_intro} />;

        case 'reviews':
            return <Proof rating={product.rating} reviewCount={product.reviewCount} reviews={product.reviews} />;

        case 'cross-sell':
            return <PeopleAlsoBought products={product.relatedProducts} title={product.related_products_title || "People Also Bought"} />;

        case 'category-modules':
            return <CategoryModuleDistributor />;

        default:
            return null;
    }
};

const CategoryModuleDistributor = () => {
    const { activeModules, setIsSizeGuideOpen, currentPrice, categoryConfig } = usePDP();
    const data = categoryConfig?.data || {};

    return (
        <div className="space-y-6">
            {activeModules.map(module => {
                switch (module) {
                    case 'size-guide':
                    case 'size-guide-modal':
                        return <SizeGuideModule key={module} onOpen={() => setIsSizeGuideOpen(true)} />;
                    case 'ingredients-list':
                    case 'ingredient-block':
                    case 'ingredients-block':
                        return <IngredientsGlossary key={module} ingredients={data.ingredients} />;
                    case 'fssai-display':
                    case 'fssai-compliance':
                        return <FSSAIComplianceBlock key={module} />;
                    case 'nutritional-info':
                    case 'nutritional-fact-sheet':
                        return <NutritionalTransparency key={module} />;
                    case 'technical-specs':
                    case 'specs-table':
                        return <SpecsTable key={module} specs={data.specs} />;
                    case 'fabric-details':
                    case 'care-instructions':
                        return <FabricDetailsModule key={module} fabric={data.fabric} care={data.care} />;
                    case 'certification-badge':
                    case 'safety-badge':
                        return <DocGradeCertifications key={module} />;
                    case 'dimensions-block':
                    case 'dimension-visual':
                    case 'dimensions-visual':
                    case 'dimensions-schematic':
                        return <FurnitureDimensionVisual key={module} dimensions={data.dimensions} image={data.dimension_image} />;
                    case 'delivery-info':
                    case 'delivery-timeline':
                        return <DeliveryTimeline key={module} />;
                    case 'installation-info':
                    case 'installation-guide':
                        return <InstallationGuide key={module} guide={data.installation} />;
                    case 'financing-option':
                    case 'emi-block':
                        return <FinancingCalculator key={module} price={currentPrice} />;
                    case 'stock-counter':
                    case 'inventory-scarcity':
                    case 'stock-scarcity':
                        return <DropshippingStockCounter key={module} />;
                    case 'shipping-timeline':
                    case 'delivery-info':
                    case 'delivery-timeline':
                        return <DropshippingShippingTimeline key={module} />;
                    case 'sales-pulse':
                    case 'real-time-purchases':
                        return <DropshippingSalesPulse key={module} />;
                    case 'direct-trust-badges':
                    case 'certification-badge':
                    case 'fssai-display':
                    case 'fssai-compliance':
                    case 'safety-badge':
                    case 'exchange-trust-messaging':
                    case 'warranty-badge':
                        return <CertificationsModule key={module} />;
                    case 'meaning-benefits-section':
                    case 'ritual-guide':
                        return <RitualGuide key={module} ritual={data.ritual} />;
                    case 'authenticity-block':
                    case 'emotional-story-block':
                        return <AuthenticityNarrative key={module} />;
                    case 'how-to-use-section':
                    case 'routine-builder':
                    case 'usage-instructions':
                    case 'dosage-instructions':
                        return <UsageProtocol key={module} usage={data.usage} />;
                    case 'before-after-slider':
                        return <BeforeAfterSlider key={module} />;
                    case 'demo-gallery':
                    case 'dimension-schematic':
                        return <VisualProofModule key={module} />;
                    case 'comparison-toggle':
                        return <EMICalculator key={module} price={currentPrice} />;
                    case 'feature-icon-grid':
                    case 'delivery-emphasis-block':
                    case 'nutritional-table':
                    case 'shelf-life-display':
                    case 'storage-instructions':
                        return <HighlightsGridModule key={module} />;
                    case 'mega-menu':
                    case 'advanced-filters':
                    case 'category-banners':
                    case 'collection-logic':
                        return <CatalogManagementModule key={module} />;
                    // Pass-through for other modules as simple stubs
                    default:
                        return (
                            <div key={module} className="p-4 border border-dashed rounded-2xl bg-neutral-50 flex items-center gap-3">
                                <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
                                <span className="text-[10px] font-black uppercase tracking-widest text-neutral-400">Vertical Module: {module}</span>
                            </div>
                        );
                }
            })}
        </div>
    );
};

// --- MODULE STUBS ---

const VisualProofModule = () => (
    <div className="space-y-4">
        <div className="flex justify-between items-end">
            <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-neutral-400 ml-1">Transformation Gallery</h3>
            <span className="text-[9px] font-bold bg-green-100 text-green-700 px-2 py-0.5 rounded-full uppercase">Verified Results</span>
        </div>
        <div className="grid grid-cols-2 gap-3">
            <div className="aspect-[4/5] bg-neutral-100 rounded-[2rem] relative overflow-hidden flex items-center justify-center grayscale">
                <span className="text-[8px] font-black uppercase opacity-20">Before_Shot.jpg</span>
                <div className="absolute bottom-4 left-4 right-4 bg-black/60 backdrop-blur-md px-3 py-1.5 rounded-full text-[9px] font-black text-white text-center">BEFORE</div>
            </div>
            <div className="aspect-[4/5] bg-neutral-200 rounded-[3rem] relative overflow-hidden flex items-center justify-center">
                <span className="text-[8px] font-black uppercase opacity-20">After_Shot.jpg</span>
                <div className="absolute bottom-4 left-4 right-4 bg-primary px-3 py-1.5 rounded-full text-[9px] font-black text-white text-center">AFTER</div>
            </div>
        </div>
    </div>
);

const HighlightsGridModule = () => (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
            { label: 'Organic Origin', icon: <Sparkles className="w-4 h-4" /> },
            { label: 'Quality Tested', icon: <CheckCircle2 className="w-4 h-4" /> },
            { label: 'Sustainably Made', icon: <Shirt className="w-4 h-4" /> },
            { label: 'Global Standard', icon: <Globe className="w-4 h-4" /> }
        ].map((h) => (
            <div key={h.label} className="p-4 bg-white border border-neutral-100 rounded-[1.5rem] flex flex-col gap-3 items-center text-center shadow-sm">
                <div className="w-8 h-8 bg-neutral-50 rounded-lg flex items-center justify-center text-neutral-400">
                    {h.icon}
                </div>
                <span className="text-[10px] font-black uppercase tracking-tight leading-tight">{h.label}</span>
            </div>
        ))}
    </div>
);

const CatalogManagementModule = () => (
    <div className="p-5 bg-neutral-100 border rounded-[2rem] flex flex-col gap-4">
        <div className="flex items-center gap-2">
            <Layers className="w-4 h-4 text-neutral-900" />
            <h3 className="text-[11px] font-black uppercase tracking-widest">Catalog Intelligence</h3>
        </div>
        <div className="grid grid-cols-1 gap-2">
            <div className="p-4 bg-white rounded-xl text-xs font-bold text-neutral-400 italic">Advanced filtering logic initialized...</div>
            <div className="p-4 bg-white rounded-xl text-xs font-bold text-neutral-400 italic">Mega-menu hierarchy ready.</div>
        </div>
    </div>
);
