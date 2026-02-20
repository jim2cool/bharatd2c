"use client"

import React from 'react';
import { PDPProvider } from '@/app/(storefront)/products/[slug]/context/PDPContext';
import { ArchitectureRenderer } from './ArchitectureRenderer';
import { ProductData } from '../types/pdp';
import { CategoryConfig } from '@/types/architecture';

interface PDPClientWrapperProps {
    product: ProductData;
    architectureId: string;
    categoryConfig: CategoryConfig;
}

export function PDPClientWrapper({ product, architectureId, categoryConfig }: PDPClientWrapperProps) {
    return (
        <PDPProvider product={product} categoryConfig={categoryConfig}>
            <ArchitectureRenderer architectureId={architectureId} />
        </PDPProvider>
    );
}
