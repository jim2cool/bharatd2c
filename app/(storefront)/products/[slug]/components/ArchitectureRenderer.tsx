"use client"

import React from 'react';
import { ARCHITECTURE_REGISTRY } from '@/lib/architecture/registry';
import { SlotRenderer } from './slots/SlotRenderer';
import { VisualDivider } from './VisualDivider';
import { usePDP } from '@/app/(storefront)/products/[slug]/context/PDPContext';
import { SizeGuideModal } from '@/app/(storefront)/products/[slug]/components/fashion/SizeGuideModal';
import { BehavioralProvider } from '../context/BehavioralContext';
import { TrustDensityManager } from './behavioral/TrustDensityManager';
import { ThemeInjector } from './theme/ThemeInjector';
import { InteractionProvider } from '../context/InteractionContext';
import { SignalProvider } from '../context/SignalContext';
import { SmartPrompts } from './behavioral/SmartPrompts';
import { BehavioralTracker } from './behavioral/BehavioralTracker';

interface ArchitectureRendererProps {
    architectureId: string;
}

export function ArchitectureRenderer() {
    const { product, isSizeGuideOpen, setIsSizeGuideOpen, storeConfig } = usePDP();

    // --- INTELLIGENCE MODE BRANCHING (Phase 3) ---
    const isIntelligenceMode = storeConfig?.config_mode === 'intelligence';

    // Helper: Component Visibility Filter
    const shouldRender = (componentId: string) => {
        if (!isIntelligenceMode) return true; // Legacy mode ignores component filtering
        return storeConfig.active_components_all?.includes(componentId);
    };

    // Define Zone Component
    const Zone = ({ slots, className, style }: { slots: string[], className?: string, style?: React.CSSProperties }) => {
        if (!slots || slots.length === 0) return null;

        // Wrap trust-badges with TrustDensityManager if current zone contains it
        return (
            <div className={className} style={style}>
                {slots.map(slot => (
                    slot === 'trust-badges'
                        ? <TrustDensityManager key={slot}><SlotRenderer name={slot} /></TrustDensityManager>
                        : <SlotRenderer key={slot} name={slot} />
                ))}
            </div>
        )
    };

    const renderIntelligenceLayout = () => {
        if (!storeConfig.pdp_component_sequence) return null;

        // Phase 9: Above-the-Fold Grid Composition
        // On mobile, everything is a single column.
        // On desktop (md+), we move Gallery and Nucleus into a 2-column grid.

        const sequence = storeConfig.pdp_component_sequence;

        // 1. Identify "Above the Fold" core
        const galleryRole = 'gallery_zone';
        const nucleusRoles = ['product_header', 'offer_cluster', 'cta_block', 'reviews_zone', 'urgency_signal'];

        const otherRoles = sequence.filter(role => role !== galleryRole && !nucleusRoles.includes(role));

        // Mapping Database Roles to Slot Names
        const roleToSlotMap: Record<string, string> = {
            'gallery_zone': 'gallery',
            'offer_cluster': 'price-display', // Updated for SlotRenderer alignment
            'cod_trust_badge': 'trust-badges',
            'size_guide': 'fashion-size-guide',
            'reviews_zone': 'reviews', // Unified social proof
            'urgency_signal': 'urgency-signals',
            'cta_block': 'cta-group',
            'return_policy': 'trust-signals',
            'product_highlights': 'description',
            'product_header': 'product-header'
        };

        return (
            <div className="flex flex-col" style={{ gap: 'var(--section-gap)' }}>
                {/* 1. Above the Fold Segment */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-16 items-start">
                    {/* Column 1: Media Gallery */}
                    <div className="w-full">
                        <SlotRenderer name="media-gallery" />
                    </div>

                    {/* Column 2: Conversion Nucleus */}
                    <div className="flex flex-col pb-[72px] md:pb-0">
                        <SlotRenderer name="conversion-nucleus" />
                    </div>
                </div>

                <VisualDivider />

                {/* 2. Remainder of Persuasion Sequence */}
                <div className="flex flex-col" style={{ gap: 'var(--section-gap)' }}>
                    {otherRoles.map((role) => {
                        const slotName = roleToSlotMap[role] || role;
                        if (slotName === 'gallery' || slotName === 'gallery_zone') return null; // Skip if duplicated
                        return (
                            <React.Fragment key={role}>
                                <SlotRenderer name={slotName} />
                                <VisualDivider />
                            </React.Fragment>
                        );
                    })}
                </div>
            </div>
        );
    };

    const renderLegacyLayout = () => {
        const architectureId = storeConfig?.commerce_architecture || 'product_engine';
        const schema = ARCHITECTURE_REGISTRY[architectureId] || ARCHITECTURE_REGISTRY['product_engine'];

        if (schema.layout === 'standard') {
            return (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-12 lg:gap-x-16" style={{ gap: 'var(--section-gap)' }}>
                    <div className="w-full min-w-0">
                        <Zone slots={schema.zones.gallery} className="flex flex-col" style={{ gap: 'var(--component-gap)' }} />
                    </div>
                    <div className="relative">
                        <div className="lg:sticky lg:top-8 h-fit flex flex-col" style={{ gap: 'var(--component-gap)' }}>
                            <Zone slots={schema.zones.conversion} className="flex flex-col" style={{ gap: 'var(--component-gap)' }} />
                        </div>
                    </div>
                    <div className="lg:col-span-2 border-t pt-[var(--section-gap)] flex flex-col" style={{ gap: 'var(--section-gap)' }}>
                        <Zone slots={schema.zones.description} className="flex flex-col" style={{ gap: 'var(--section-gap)' }} />
                        <Zone slots={schema.zones.socialProof} className="py-[var(--section-gap)] border-y bg-muted/50 -mx-4 px-4 sm:-mx-8 sm:px-8 lg:-mx-20 lg:px-20" />
                        <Zone slots={schema.zones.crossSell} className="pb-[var(--section-gap)]" />
                    </div>
                </div>
            );
        }

        if (schema.layout === 'story') {
            return (
                <div className="flex flex-col" style={{ gap: 'var(--section-gap)' }}>
                    <Zone slots={schema.zones.gallery} className="w-full" />
                    <div className="max-w-4xl mx-auto w-full px-6 flex flex-col" style={{ gap: 'var(--section-gap)' }}>
                        <Zone
                            slots={schema.zones.conversion}
                            className="p-8 lg:p-12 border rounded-[2.5rem] shadow-xl shadow-neutral-100 bg-card relative z-10 -mt-12 lg:-mt-20 flex flex-col"
                            style={{ gap: 'var(--component-gap)' }}
                        />
                        <Zone slots={schema.zones.description} className="flex flex-col" style={{ gap: 'var(--section-gap)' }} />
                        <Zone slots={schema.zones.socialProof} className="py-[var(--section-gap)] border-y" />
                        <Zone slots={schema.zones.crossSell} />
                    </div>
                </div>
            );
        }

        return (
            <div className="flex flex-col" style={{ gap: 'var(--section-gap)' }}>
                <Zone slots={schema.zones.gallery} />
                <Zone slots={schema.zones.conversion} className="flex flex-col" style={{ gap: 'var(--component-gap)' }} />
                <Zone slots={schema.zones.description} className="flex flex-col" style={{ gap: 'var(--section-gap)' }} />
                <Zone slots={schema.zones.socialProof} />
                <Zone slots={schema.zones.crossSell} />
            </div>
        );
    }

    // Default or Computed Seller Context
    const sellerConfig = isIntelligenceMode ? {
        urgencyLevel: storeConfig.urgency_level,
        socialProofWeight: storeConfig.trust_density, // Trust density maps to weight in this version
        trustDensity: storeConfig.trust_density,
        ctaProminence: storeConfig.cta_prominence,
        densityScale: storeConfig.density_scale,
        codBias: storeConfig.cod_bias
    } : (product.seller_config || {
        urgencyLevel: 'medium',
        socialProofWeight: 'medium',
        trustDensity: 'medium',
        ctaProminence: 'balanced',
        densityScale: 'balanced',
        codBias: true
    });

    return (
        <InteractionProvider>
            <SignalProvider>
                <BehavioralProvider seller={sellerConfig}>
                    <BehavioralTracker />
                    {isIntelligenceMode ? renderIntelligenceLayout() : renderLegacyLayout()}
                    <SmartPrompts />
                    <SizeGuideModal isOpen={isSizeGuideOpen} onClose={() => setIsSizeGuideOpen(false)} />
                </BehavioralProvider>
            </SignalProvider>
        </InteractionProvider>
    );
}
