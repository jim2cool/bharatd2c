'use client'

import React from 'react'

export function Card({ title, subtitle, children, className = '' }: { title: string; subtitle?: string; children: React.ReactNode; className?: string }) {
    return (
        <section className={`bg-white border rounded-3xl p-6 ${className}`}>
            <h2 className="font-semibold mb-1 text-neutral-900">{title}</h2>
            {subtitle && <p className="text-sm text-neutral-500 mb-6">{subtitle}</p>}
            {children}
        </section>
    )
}

export function Field({ label, error, children, className = '' }: { label: string; error?: string; children: React.ReactNode; className?: string }) {
    return (
        <label className={`block ${className}`}>
            <span className="text-sm font-medium text-neutral-700">{label}</span>
            <div className="mt-1">{children}</div>
            {error && <p className="text-sm text-red-500 mt-1">{error}</p>}
        </label>
    )
}

export function Label({ children, className = '' }: { children: React.ReactNode; className?: string }) {
    return <div className={`text-sm font-medium text-neutral-900 mb-1 ${className}`}>{children}</div>
}

export function Stat({ label, value, className = '' }: { label: string; value: string; className?: string }) {
    return (
        <div className={`border rounded-2xl px-4 py-3 bg-neutral-50 ${className}`}>
            <div className="text-xs text-neutral-500 uppercase font-black tracking-widest mb-1">{label}</div>
            <div className="font-black text-neutral-900">{value}</div>
        </div>
    )
}
