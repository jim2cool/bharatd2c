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
import { ConversionNucleus } from '@/app/(storefront)/products/[slug]/components/conversion/ConversionNucleus';
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
const SubscriptionOption = dynamic(() => import('@/app/(storefront)/products/[slug]/components/health/SubscriptionOption').then(mod => mod.SubscriptionOption), { loading: () => <SlotSkeleton height="150px" /> });
const SellerInfo = dynamic(() => import('@/app/(storefront)/products/[slug]/components/marketplace/SellerInfo').then(mod => mod.SellerInfo), { loading: () => <SlotSkeleton height="150px" /> });
const SwatchVariants = dynamic(() => import('@/app/(storefront)/products/[slug]/components/fashion/SwatchVariants').then(mod => mod.SwatchVariants), { loading: () => <SlotSkeleton height="100px" /> });
const TestimonialsSection = dynamic(() => import('@/app/(storefront)/products/[slug]/components/social/TestimonialsSection').then(mod => mod.TestimonialsSection), { loading: () => <SlotSkeleton height="400px" /> });
const EmotionalStoryBlock = dynamic(() => import('@/app/(storefront)/products/[slug]/components/brand/EmotionalStoryBlock').then(mod => mod.EmotionalStoryBlock), { loading: () => <SlotSkeleton height="500px" /> });
const ExchangeTrustBlock = dynamic(() => import('@/app/(storefront)/products/[slug]/components/fashion/ExchangeTrustBlock').then(mod => mod.ExchangeTrustBlock), { loading: () => <SlotSkeleton height="150px" /> });
const DeliveryPromiseBlock = dynamic(() => import('@/app/(storefront)/products/[slug]/components/conversion/DeliveryPromiseBlock').then(mod => mod.DeliveryPromiseBlock), { loading: () => <SlotSkeleton height="100px" /> });
const RoutineBuilder = dynamic(() => import('@/app/(storefront)/products/[slug]/components/beauty/RoutineBuilder').then(mod => mod.RoutineBuilder), { loading: () => <SlotSkeleton height="400px" /> });
const TrustBar = dynamic(() => import('@/app/(storefront)/products/[slug]/components/trust/TrustBar').then(mod => mod.TrustBar), { loading: () => <SlotSkeleton height="60px" /> });
const FeaturesSection = dynamic(() => import('@/app/(storefront)/products/[slug]/components/sections/FeaturesSection').then(mod => mod.FeaturesSection), { loading: () => <SlotSkeleton height="300px" /> });
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
    <div className="w-full bg-[var(--bg-secondary)] animate-pulse rounded-[var(--radius-card)]" style={{ height }} />
);

export const SlotRenderer = ({ name }: { name: string }) => {
    const {
        product,
        categoryConfig,
        storeConfig,
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

        case 'conversion-nucleus':
            return <ConversionNucleus />;

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
            return <TrustBar />;

        case 'story-section':
            return <StorySection />;

        case 'brand-narrative-blocks':
            return <BrandNarrativeBlocks />;

        case 'features-section':
            return <FeaturesSection highlights={product.highlights} />;

        case 'faq-section':
            return <ContentAccordions sections={product.content} />;

        case 'testimonials-section':
            return <TestimonialsSection />;

        case 'reviews':
            return <Proof rating={product.rating} reviewCount={product.reviewCount} reviews={product.reviews} />;

        case 'swatch-variants':
            return <SwatchVariants swatches={[]} />;

        case 'subscription-option':
            return <SubscriptionOption oneTimePrice={currentPrice} subscriptionPrice={currentPrice * 0.85} />;

        case 'seller-info':
            return <SellerInfo sellerName={storeConfig.store_name} rating={4.9} reviewCount={1240} location="New Delhi, India" />;

        case 'category-modules':
            return <CategoryModuleDistributor />;

        default:
            return null;
    }
};

const CategoryModuleDistributor = () => {
    const { activeModules, setIsSizeGuideOpen, currentPrice, categoryConfig, product } = usePDP();
    const data = categoryConfig?.data || {};

    return (
        <div className="flex flex-col" style={{ gap: 'var(--component-gap)' }}>
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
                        return <EmotionalStoryBlock key={module} />;
                    case 'how-to-use-section':
                    case 'routine-builder':
                    case 'usage-instructions':
                    case 'dosage-instructions':
                        return <RoutineBuilder key={module} />;
                    case 'before-after-slider':
                        return <BeforeAfterSlider key={module} />;
                    case 'delivery-emphasis-block':
                        return <DeliveryPromiseBlock key={module} />;
                    case 'exchange-trust-messaging':
                        return <ExchangeTrustBlock key={module} />;
                    case 'feature-icon-grid':
                    case 'nutritional-table':
                    case 'shelf-life-display':
                    case 'storage-instructions':
                        return <FeaturesSection key={module} highlights={product.highlights} />;
                    case 'mega-menu':
                    case 'advanced-filters':
                    case 'category-banners':
                    case 'collection-logic':
                        return <CatalogManagementModule key={module} />;
                    // Pass-through for other modules as simple stubs
                    default:
                        return (
                            <div key={module} className="p-4 border border-dashed rounded-[var(--radius-card)] bg-[var(--bg-secondary)] flex items-center gap-3">
                                <div className="w-2 h-2 rounded-full bg-[var(--primary)] animate-pulse" />
                                <span className="text-[10px] font-black uppercase tracking-widest text-[var(--text-secondary)] opacity-40">Vertical Module: {module}</span>
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
            <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground ml-1">Transformation Gallery</h3>
            <span className="text-[9px] font-bold bg-green-100 text-green-700 px-2 py-0.5 rounded-full uppercase">Verified Results</span>
        </div>
        <div className="grid grid-cols-2 gap-3">
            <div className="aspect-[4/5] bg-[var(--bg-secondary)] rounded-[var(--radius-card)] relative overflow-hidden flex items-center justify-center grayscale">
                <span className="text-[8px] font-black uppercase opacity-20">Before_Shot.jpg</span>
                <div className="absolute bottom-4 left-4 right-4 bg-[var(--bg-secondary)]/60 backdrop-blur-md px-3 py-1.5 rounded-full text-[9px] font-black text-[var(--text-primary)] text-center">BEFORE</div>
            </div>
            <div className="aspect-[4/5] bg-[var(--bg-secondary)] rounded-[var(--radius-card)] relative overflow-hidden flex items-center justify-center">
                <span className="text-[8px] font-black uppercase opacity-20">After_Shot.jpg</span>
                <div className="absolute bottom-4 left-4 right-4 bg-[var(--primary)] px-3 py-1.5 rounded-full text-[9px] font-black text-[var(--cta-text)] text-center">AFTER</div>
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
            <div key={h.label} className="p-4 bg-[var(--bg-primary)] border border-[var(--border)] rounded-[var(--radius-card)] flex flex-col gap-3 items-center text-center shadow-sm">
                <div className="w-8 h-8 bg-[var(--bg-secondary)] rounded-lg flex items-center justify-center text-[var(--text-secondary)]">
                    {h.icon}
                </div>
                <span className="text-[10px] font-black uppercase tracking-tight leading-tight">{h.label}</span>
            </div>
        ))}
    </div>
);

const CatalogManagementModule = () => (
    <div className="p-5 bg-[var(--bg-secondary)] border border-[var(--border)] rounded-[var(--radius-card)] flex flex-col gap-4">
        <div className="flex items-center gap-2">
            <Layers className="w-4 h-4 text-[var(--text-primary)]" />
            <h3 className="text-[11px] font-black uppercase tracking-widest text-[var(--text-primary)]">Catalog Intelligence</h3>
        </div>
        <div className="grid grid-cols-1 gap-2">
            <div className="p-4 bg-[var(--bg-primary)] rounded-[var(--radius-button)] text-xs font-bold text-[var(--text-secondary)] italic">Advanced filtering logic initialized...</div>
            <div className="p-4 bg-[var(--bg-primary)] rounded-[var(--radius-button)] text-xs font-bold text-[var(--text-secondary)] italic">Mega-menu hierarchy ready.</div>
        </div>
    </div>
);
