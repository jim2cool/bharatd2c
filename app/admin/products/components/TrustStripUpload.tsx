'use client'

import React, { useState } from 'react'
import { Upload, X, ImageIcon } from 'lucide-react'

interface TrustStripUploadProps {
    value: string | null | undefined
    onChange: (url: string | null) => void
    productId: string
    productTitle: string
}

export function TrustStripUpload({ value, onChange, productId, productTitle }: TrustStripUploadProps) {
    const [isUploading, setIsUploading] = useState(false)

    const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (!file) return

        setIsUploading(true)
        const form = new FormData()
        form.append('file', file)
        form.append('productId', productId)
        form.append('productTitle', productTitle)
        form.append('index', 'trust-strip') // Using a special index or folder
        form.append('folder', 'trust-signals')

        try {
            const res = await fetch('/api/upload', {
                method: 'POST',
                body: form
            })
            const data = await res.json()
            if (data.url) {
                onChange(data.url)
            }
        } catch (err) {
            console.error('Failed to upload trust strip image:', err)
        } finally {
            setIsUploading(false)
        }
    }

    return (
        <div className="space-y-4">
            {value ? (
                <div className="relative group aspect-[4/1] bg-neutral-50 rounded-2xl border border-neutral-200 overflow-hidden flex items-center justify-center p-4">
                    <img
                        src={value}
                        alt="Trust Strip Preview"
                        className="max-h-full max-w-full object-contain"
                    />
                    <div className="absolute inset-0 bg-neutral-900/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <button
                            type="button"
                            onClick={() => onChange(null)}
                            className="bg-red-500 text-white p-2 rounded-xl hover:bg-red-600 transition-colors shadow-lg"
                        >
                            <X className="w-4 h-4" />
                        </button>
                    </div>
                </div>
            ) : (
                <label className={`
                    flex flex-col items-center justify-center gap-3 p-8 
                    border-2 border-dashed border-neutral-200 rounded-[28px] 
                    hover:border-blue-300 hover:bg-blue-50/30 transition-all cursor-pointer group
                    ${isUploading ? 'opacity-50 pointer-events-none' : ''}
                `}>
                    <input
                        type="file"
                        accept="image/*"
                        onChange={handleUpload}
                        className="hidden"
                    />

                    <div className="w-12 h-12 rounded-2xl bg-neutral-50 flex items-center justify-center text-neutral-300 group-hover:bg-blue-100 group-hover:text-blue-600 transition-all shadow-sm">
                        {isUploading ? (
                            <div className="w-5 h-5 border-2 border-neutral-300 border-t-blue-600 rounded-full animate-spin" />
                        ) : (
                            <Upload className="w-5 h-5" />
                        )}
                    </div>

                    <div className="text-center">
                        <p className="text-xs font-black uppercase tracking-widest text-neutral-400 group-hover:text-blue-600">
                            {isUploading ? 'Uploading...' : 'Upload Trust Strip Image'}
                        </p>
                        <p className="text-[10px] text-neutral-400 font-medium mt-1 leading-relaxed">
                            Combine all badges into a single image.<br />
                            Recommended: <span className="text-blue-600 font-bold">800x200px</span> (Transparent PNG or WebP)
                        </p>
                    </div>
                </label>
            )}
        </div>
    )
}
