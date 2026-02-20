"use client"

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { ChevronDown, ArrowRight } from 'lucide-react'
import { supabaseBrowser } from '@/lib/supabase-browser'

interface Collection {
    id: string
    title: string
    slug: string
    description?: string
    image_url?: string
}

export default function MegaMenu({ storeId }: { storeId?: string }) {
    const [isOpen, setIsOpen] = useState(false)
    const [collections, setCollections] = useState<Collection[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const timeoutRef = useRef<NodeJS.Timeout | null>(null)

    useEffect(() => {
        async function fetchCollections() {
            if (!storeId) return
            setIsLoading(true)
            const { data, error } = await supabaseBrowser
                .from('collections')
                .select('id, title, slug, description, image_url')
                .eq('store_id', storeId)
                .eq('status', 'published')
                .limit(6)

            if (!error && data) {
                setCollections(data)
            }
            setIsLoading(false)
        }
        fetchCollections()
    }, [storeId])

    const handleMouseEnter = () => {
        if (timeoutRef.current) clearTimeout(timeoutRef.current)
        setIsOpen(true)
    }

    const handleMouseLeave = () => {
        timeoutRef.current = setTimeout(() => {
            setIsOpen(false)
        }, 150) // Small delay prevents accidental closures
    }

    return (
        <div
            className="relative"
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
        >
            <Link
                href="/collections"
                className="flex items-center gap-1 text-sm font-medium text-gray-700 hover:text-primary transition-colors tracking-wide py-4"
            >
                Shop
                <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
            </Link>

            {isOpen && (
                <div
                    className="absolute top-full left-1/2 -translate-x-1/2 w-[800px] bg-white border border-gray-100 shadow-xl rounded-xl p-6 mt-1 animate-in fade-in slide-in-from-top-2 duration-200 z-50 flex gap-8"
                >
                    {/* Main Categories column */}
                    <div className="flex-1 grid grid-cols-2 gap-x-8 gap-y-6">
                        {!isLoading && collections.slice(0, 4).map((collection) => (
                            <div key={collection.id} className="group">
                                <Link
                                    href={`/collections/${collection.slug}`}
                                    className="block font-semibold text-gray-900 mb-1 group-hover:text-primary transition-colors"
                                >
                                    {collection.title}
                                </Link>
                                {collection.description && (
                                    <p className="text-sm text-gray-500 line-clamp-2">
                                        {collection.description}
                                    </p>
                                )}
                            </div>
                        ))}

                        {!isLoading && collections.length === 0 && (
                            <p className="text-sm text-gray-500">No categories found.</p>
                        )}

                        {isLoading && (
                            <div className="col-span-2 flex justify-center py-4">
                                <div className="w-5 h-5 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
                            </div>
                        )}
                    </div>

                    {/* Featured/Promotional Column */}
                    <div className="w-[300px] bg-gray-50 rounded-lg p-5 flex flex-col justify-between">
                        <div>
                            <span className="text-xs font-bold uppercase tracking-wider text-primary mb-2 block">Featured</span>
                            <h3 className="text-lg font-semibold text-gray-900 mb-3">
                                {collections[0]?.title || "Discover Our Collection"}
                            </h3>
                            <p className="text-sm text-gray-600 mb-4">
                                Explore our handpicked curation of premium products designed for your lifestyle.
                            </p>
                        </div>
                        <Link
                            href={collections[0] ? `/collections/${collections[0].slug}` : "/collections"}
                            className="inline-flex items-center gap-2 text-sm font-semibold text-primary group"
                        >
                            Shop Now
                            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                        </Link>
                    </div>
                </div>
            )}
        </div>
    )
}
