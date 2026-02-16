'use client'

import React from 'react'

export function PageSkeleton() {
    return (
        <div className="p-8 space-y-8 animate-pulse">
            <div className="flex items-center justify-between">
                <div className="space-y-2">
                    <div className="h-8 w-64 bg-slate-200 rounded-lg" />
                    <div className="h-4 w-48 bg-slate-100 rounded-md" />
                </div>
                <div className="h-10 w-32 bg-slate-200 rounded-xl" />
            </div>

            <div className="h-48 w-full bg-slate-100 rounded-[2rem]" />

            <div className="space-y-4">
                {[1, 2, 3, 4, 5].map((i) => (
                    <div key={i} className="flex gap-4 items-center">
                        <div className="h-12 w-12 bg-slate-200 rounded-xl" />
                        <div className="flex-1 space-y-2">
                            <div className="h-4 w-full bg-slate-100 rounded" />
                            <div className="h-3 w-2/3 bg-slate-50 rounded" />
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}

export function TableSkeleton({ rows = 5 }: { rows?: number }) {
    return (
        <div className="w-full space-y-4 animate-pulse">
            {[...Array(rows)].map((_, i) => (
                <div key={i} className="flex items-center gap-4 py-4 border-b border-slate-50">
                    <div className="h-10 w-10 bg-slate-100 rounded-lg" />
                    <div className="flex-1 space-y-2">
                        <div className="h-4 w-1/3 bg-slate-100 rounded" />
                        <div className="h-3 w-1/4 bg-slate-50 rounded" />
                    </div>
                    <div className="h-8 w-20 bg-slate-100 rounded" />
                </div>
            ))}
        </div>
    )
}
