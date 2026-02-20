"use client"

import React from 'react';
import { ARCHITECTURE_REGISTRY } from '@/lib/architecture/registry';
import { SlotRenderer } from './slots/SlotRenderer';
import { usePDP } from '@/app/(storefront)/products/[slug]/context/PDPContext';
import { SizeGuideModal } from '@/app/(storefront)/products/[slug]/components/fashion/SizeGuideModal';
import { BehavioralProvider } from '../context/BehavioralContext';
import { TrustDensityManager } from './behavioral/TrustDensityManager';
import { ThemeInjector } from './theme/ThemeInjector';
import { InteractionProvider } from '../context/InteractionContext';
import { SignalProvider } from '../context/SignalContext';
import { SmartPrompts } from './behavioral/SmartPrompts';

interface ArchitectureRendererProps {
    architectureId: string;
}

export function ArchitectureRenderer({ architectureId }: ArchitectureRendererProps) {
    const { product, isSizeGuideOpen, setIsSizeGuideOpen } = usePDP();
    // Fallback to product-engine if architectureId is not found
    const schema = ARCHITECTURE_REGISTRY[architectureId] || ARCHITECTURE_REGISTRY['product-engine'];

    // --- STRUCTURAL GUARDRAILS (Section 7) ---
    const allSlots = Object.values(schema.zones).flat();

    // 1. CTA Block Must Exist
    const hasCTA = allSlots.includes('cta-group');
    if (!hasCTA && process.env.NODE_ENV !== 'production') {
        console.error(`[Architecture Violation] Architecture "${architectureId}" is missing a mandatory "cta-group" slot.`);
    }

    // 2. Offer Cluster (Price + Variant) Must Remain Grouped in Conversion Zone
    const conversionSlots = schema.zones.conversion;
    const priceIndex = conversionSlots.indexOf('price-display');
    const variantIndex = conversionSlots.indexOf('variant-selector');
    if (priceIndex !== -1 && variantIndex !== -1 && Math.abs(priceIndex - variantIndex) > 2) {
        console.warn(`[Architecture Alert] Price and Variant are drifting apart in "${architectureId}". Recommended proximity: < 2 slots.`);
    }

    // Define Zone Component
    const Zone = ({ slots, className }: { slots: string[], className?: string }) => {
        if (!slots || slots.length === 0) return null;

        const content = slots.map(slot => <SlotRenderer key={slot} name={slot} />);

        // Wrap trust-badges with TrustDensityManager if current zone contains it
        if (slots.includes('trust-badges')) {
            return (
                <div className={className}>
                    {slots.map(slot => (
                        slot === 'trust-badges'
                            ? <TrustDensityManager key={slot}><SlotRenderer name={slot} /></TrustDensityManager>
                            : <SlotRenderer key={slot} name={slot} />
                    ))}
                </div>
            )
        }

        return (
            <div className={className}>
                {content}
            </div>
        );
    };

    const renderLayout = () => {
        if (schema.layout === 'standard') {
            return (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-16 lg:gap-x-20 gap-y-12">
                    {/* Gallery Zone */}
                    <div className="w-full min-w-0">
                        <Zone slots={schema.zones.gallery} className="flex flex-col gap-4" />
                    </div>

                    {/* Conversion Zone (Sticky Side) */}
                    <div className="relative">
                        <div className="lg:sticky lg:top-8 h-fit flex flex-col gap-6">
                            <Zone slots={schema.zones.conversion} className="flex flex-col gap-4 lg:gap-6" />
                        </div>
                    </div>

                    {/* Content & Social Zones */}
                    <div className="lg:col-span-2 mt-12 lg:mt-20 space-y-16 lg:space-y-24 border-t pt-16">
                        <Zone slots={schema.zones.description} className="space-y-12 lg:space-y-20" />
                        <Zone slots={schema.zones.socialProof} className="py-16 border-y bg-neutral-50/50 -mx-4 px-4 sm:-mx-8 sm:px-8 lg:-mx-20 lg:px-20" />
                        <Zone slots={schema.zones.crossSell} className="pb-16" />
                    </div>
                </div>
            );
        }

        if (schema.layout === 'story') {
            return (
                <div className="flex flex-col gap-16 lg:gap-24">
                    <Zone slots={schema.zones.gallery} className="w-full" />
                    <div className="max-w-4xl mx-auto w-full px-6 space-y-16 lg:space-y-24">
                        <Zone
                            slots={schema.zones.conversion}
                            className="space-y-8 p-8 lg:p-12 border rounded-[2.5rem] shadow-xl shadow-neutral-100 bg-white relative z-10 -mt-12 lg:-mt-20"
                        />
                        <Zone slots={schema.zones.description} className="space-y-16 lg:space-y-24" />
                        <Zone slots={schema.zones.socialProof} className="py-12 border-y" />
                        <Zone slots={schema.zones.crossSell} />
                    </div>
                </div>
            );
        }

        return (
            <div className="space-y-12">
                <Zone slots={schema.zones.gallery} />
                <Zone slots={schema.zones.conversion} className="space-y-6" />
                <Zone slots={schema.zones.description} className="space-y-8" />
                <Zone slots={schema.zones.socialProof} />
                <Zone slots={schema.zones.crossSell} />
            </div>
        );
    }

    // Default seller config if not provided in product (though it should be in theme_config)
    const sellerConfig = product.seller_config || {
        urgencyLevel: 'medium',
        socialProofWeight: 'medium',
        trustDensity: 'medium',
        ctaProminence: 'balanced',
        densityScale: 'balanced',
        codBias: true
    };



    return (
        <InteractionProvider>
            <SignalProvider>
                <ThemeInjector style={schema.style}>
                    <BehavioralProvider seller={sellerConfig}>
                        {renderLayout()}
                        <SmartPrompts />
                        <SizeGuideModal isOpen={isSizeGuideOpen} onClose={() => setIsSizeGuideOpen(false)} />
                    </BehavioralProvider>
                </ThemeInjector>
            </SignalProvider>
        </InteractionProvider>
    );
}
