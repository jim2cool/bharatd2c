"use client"

import React from 'react';
import { PDPProvider } from '@/app/(storefront)/products/[slug]/context/PDPContext';
import { ArchitectureRenderer } from './ArchitectureRenderer';
import { ProductData } from '../types/pdp';
import { CategoryConfig } from '@/types/architecture';
import { StoreConfig } from '@/types/store-config';

interface PDPClientWrapperProps {
    product: ProductData;
    storeConfig: StoreConfig;
    categoryConfig: CategoryConfig;
}

export function PDPClientWrapper({ product, storeConfig, categoryConfig }: PDPClientWrapperProps) {
    return (
        <PDPProvider product={product} categoryConfig={categoryConfig} storeConfig={storeConfig}>
            <ArchitectureRenderer />
        </PDPProvider>
    );
}
