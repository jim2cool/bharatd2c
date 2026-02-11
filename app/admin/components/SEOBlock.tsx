'use client'

import { useState, useEffect } from 'react'

interface SEOBlockProps {
    title: string
    description: string
    slug: string
    onChange: (data: { title: string; description: string; slug: string }) => void
    baseUrl: string
}

export default function SEOBlock({ title, description, slug, onChange, baseUrl }: SEOBlockProps) {
    return (
        <div className="bg-white border rounded p-6 space-y-4">
            <div className="flex justify-between items-center mb-2">
                <h2 className="font-medium">Search engine listing</h2>
                <span className="text-xs text-blue-600 cursor-pointer hover:underline">Edit SEO</span>
            </div>

            <div className="p-4 bg-gray-50 rounded border border-dashed border-gray-200 mb-4">
                <div className="text-[#1a0dab] text-lg font-medium truncate max-w-full">
                    {title || 'Page Title'}
                </div>
                <div className="text-[#006621] text-xs truncate mb-1">
                    {baseUrl}/{slug || 'your-slug'}
                </div>
                <div className="text-[#545454] text-xs line-clamp-2">
                    {description || 'Add a meta description to see how this page might appear in search engine results.'}
                </div>
            </div>

            <div className="space-y-4">
                <div>
                    <label className="block text-sm font-medium mb-1">Page title</label>
                    <input
                        className="w-full border rounded px-3 py-2 text-sm"
                        value={title}
                        onChange={(e) => onChange({ title: e.target.value, description, slug })}
                        maxLength={70}
                    />
                    <div className="text-right text-[10px] text-gray-400 mt-1">{title.length} / 70 characters</div>
                </div>

                <div>
                    <label className="block text-sm font-medium mb-1">Meta description</label>
                    <textarea
                        className="w-full border rounded px-3 py-2 text-sm h-20"
                        value={description}
                        onChange={(e) => onChange({ title, description: e.target.value, slug })}
                        maxLength={160}
                    />
                    <div className="text-right text-[10px] text-gray-400 mt-1">{description.length} / 160 characters</div>
                </div>

                <div>
                    <label className="block text-sm font-medium mb-1">URL handle</label>
                    <div className="flex items-center">
                        <span className="bg-gray-50 border border-r-0 rounded-l px-3 py-2 text-sm text-gray-500">{baseUrl}/</span>
                        <input
                            className="flex-1 border rounded-r px-3 py-2 text-sm"
                            value={slug}
                            onChange={(e) => onChange({ title, description, slug: e.target.value.toLowerCase().replace(/\s+/g, '-') })}
                        />
                    </div>
                </div>
            </div>
        </div>
    )
}
