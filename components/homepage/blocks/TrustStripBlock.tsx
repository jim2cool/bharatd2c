"use client";

import React from 'react';
import TrustBar from '@/components/ui/trust-bar';

export default function TrustStripBlock({ config }: { config: any }) {
    // TrustBar might need to be refactored to accept items, 
    // but for now we'll use it as a wrapper.
    return (
        <div className="bg-[var(--bg-primary)] border-y border-[var(--border)]">
            <TrustBar />
        </div>
    );
}
