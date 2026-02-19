'use client'

import React from 'react'

export function Card({ title, subtitle, children, className = '', icon: Icon, isOpen = true, onToggle }: { title: string; subtitle?: string; children: React.ReactNode; className?: string; icon?: any; isOpen?: boolean; onToggle?: () => void }) {
    return (
        <section className={`bg-neutral-50/50 border border-neutral-200/60 rounded-[28px] overflow-hidden transition-all duration-300 ${className}`}>
            <div
                className={`p-6 pb-3 flex items-start justify-between cursor-pointer group/card`}
                onClick={onToggle}
            >
                <div className="flex items-start gap-4">
                    {Icon && (
                        <div className="p-3 bg-white border border-neutral-100 rounded-2xl text-neutral-400 group-hover:text-blue-600 transition-colors shadow-sm">
                            <Icon className="w-5 h-5" />
                        </div>
                    )}
                    <div>
                        <h2 className="text-lg font-bold tracking-tight text-neutral-900">{title}</h2>
                        {subtitle && <p className="text-xs font-medium text-neutral-500 mt-1">{subtitle}</p>}
                    </div>
                </div>
                {onToggle && (
                    <div className={`p-2 rounded-xl bg-white border border-neutral-100 text-neutral-400 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}>
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" /></svg>
                    </div>
                )}
            </div>
            <div className={`px-6 pb-6 transition-all duration-500 ease-in-out ${isOpen ? 'max-h-[5000px] opacity-100' : 'max-h-0 opacity-0 pointer-events-none'}`}>
                <div className="pt-2">
                    {children}
                </div>
            </div>
        </section>
    )
}

export function Field({ label, error, children, className = '' }: { label: string; error?: string; children: React.ReactNode; className?: string }) {
    return (
        <label className={`block group ${className}`}>
            <span className="text-[11px] font-black uppercase tracking-widest text-neutral-500 group-focus-within:text-blue-600 transition-colors ml-1">{label}</span>
            <div className="mt-2 relative bg-white rounded-2xl shadow-sm border border-neutral-300/50 group-focus-within:border-blue-500/50 transition-all">
                {children}
            </div>
            {error && (
                <div className="mt-2 flex items-center gap-1.5 text-[11px] font-bold text-red-500 animate-in slide-in-from-top-1 px-1">
                    <span className="w-1 h-1 rounded-full bg-red-500" />
                    {error}
                </div>
            )}
        </label>
    )
}

export function Label({ children, className = '' }: { children: React.ReactNode; className?: string }) {
    return <div className={`text-xs font-black uppercase tracking-widest text-neutral-400 mb-3 ${className}`}>{children}</div>
}

export function Stat({ label, value, className = '' }: { label: string; value: string; className?: string }) {
    return (
        <div className={`border border-neutral-200/60 rounded-[20px] px-5 py-3 bg-white hover:border-neutral-300 transition-all duration-300 shadow-sm ${className}`}>
            <div className="text-[9px] text-neutral-500 uppercase font-black tracking-widest mb-1"> {label}</div>
            <div className="text-xl font-black text-neutral-900 tracking-tight">{value}</div>
        </div>
    )
}
