'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { supabaseBrowser } from '@/lib/supabase-browser'
import { getActiveStoreIdClient } from '@/lib/getActiveStore.client'
import { TableSkeleton } from '../components/AdminSkeletons'
import { Layout, ArrowRight } from 'lucide-react'

export default function PagesListPage() {
    const router = useRouter()
    const [storeId, setStoreId] = useState<string | null>(null)
    const [pages, setPages] = useState<any[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const id = getActiveStoreIdClient()
        if (!id) {
            router.replace('/admin/stores')
            return
        }
        setStoreId(id)
        loadPages(id)
    }, [router])

    const loadPages = async (activeStoreId: string) => {
        setLoading(true)
        const { data, error } = await supabaseBrowser
            .from('pages')
            .select('*')
            .eq('store_id', activeStoreId)
            .order('updated_at', { ascending: false })

        if (data && data.length === 0) {
            // AUTO-FILL STANDARD PAGES
            const standardPages = [
                {
                    title: 'About Us',
                    slug: 'about-us',
                    content: `
                        <div style="padding: 20px; border: 2px dashed #e2e8f0; background: #f8fafc; margin-bottom: 20px; border-radius: 12px; font-weight: bold; text-align: center; color: #64748b;">
                            [DRAFT - PLEASE REVIEW AND PERSONALIZE TO YOUR BRAND]
                        </div>
                        <h1>Our Story</h1>
                        <p>Welcome to Our Store! We started with a simple idea: to bring high-quality, curated products to our community. Our mission is to provide an exceptional shopping experience and build a brand that stands for excellence and customer trust.</p>
                        <h2>Our Values</h2>
                        <ul>
                            <li><strong>Quality:</strong> We never compromise on the standard of our products.</li>
                            <li><strong>Customer First:</strong> Your satisfaction is our top priority.</li>
                            <li><strong>Integrity:</strong> We operate with transparency and honesty in everything we do.</li>
                        </ul>
                    `,
                    status: 'draft'
                },
                {
                    title: 'Refund Policy',
                    slug: 'refund-policy',
                    content: `
                         <div style="padding: 20px; border: 2px dashed #e2e8f0; background: #f8fafc; margin-bottom: 20px; border-radius: 12px; font-weight: bold; text-align: center; color: #64748b;">
                            [DRAFT - PLEASE REVIEW AND UPDATE BASED ON YOUR BUSINESS MODEL]
                        </div>
                        <h1>Refund Policy</h1>
                        <p>Our policy lasts 30 days. If 30 days have gone by since your purchase, unfortunately we cannot offer you a refund or exchange.</p>
                        <h2>Eligibility for Refunds</h2>
                        <p>To be eligible for a return, your item must be unused and in the same condition that you received it. It must also be in the original packaging.</p>
                        <h2>How to Return</h2>
                        <p>To complete your return, we require a receipt or proof of purchase. Please contact our support team at [Your Email Address] before sending any items back.</p>
                    `,
                    status: 'draft'
                },
                {
                    title: 'Privacy Policy',
                    slug: 'privacy-policy',
                    content: `
                         <div style="padding: 20px; border: 2px dashed #e2e8f0; background: #f8fafc; margin-bottom: 20px; border-radius: 12px; font-weight: bold; text-align: center; color: #64748b;">
                            [DRAFT - GDPR & CCPA COMPLIANCE REVIEW REQUIRED]
                        </div>
                        <h1>Privacy Policy</h1>
                        <p>This Privacy Policy describes how your personal information is collected, used, and shared when you visit or make a purchase from Our Store.</p>
                        <h2>Information We Collect</h2>
                        <p>When you visit the site, we automatically collect certain information about your device, including information about your web browser, IP address, and time zone.</p>
                        <h2>How We Use Your Personal Information</h2>
                        <p>We use the Order Information that we collect generally to fulfill any orders placed through the Site (including processing your payment information, arranging for shipping, and providing you with invoices and/or order confirmations).</p>
                    `,
                    status: 'draft'
                },
                {
                    title: 'Shipping Policy',
                    slug: 'shipping-policy',
                    content: `
                         <div style="padding: 20px; border: 2px dashed #e2e8f0; background: #f8fafc; margin-bottom: 20px; border-radius: 12px; font-weight: bold; text-align: center; color: #64748b;">
                            [DRAFT - UPDATE WITH YOUR LOGISTICS PARTNERS AND RATES]
                        </div>
                        <h1>Shipping Policy</h1>
                        <p>Thank you for visiting and shopping at Our Store. Following are the terms and conditions that constitute our Shipping Policy.</p>
                        <h2>Shipment Processing Time</h2>
                        <p>All orders are processed within 2-3 business days. Orders are not shipped or delivered on weekends or holidays.</p>
                        <h2>Shipping Rates & Delivery Estimates</h2>
                        <p>Shipping charges for your order will be calculated and displayed at checkout.</p>
                    `,
                    status: 'draft'
                },
                {
                    title: 'Terms of Service',
                    slug: 'terms-of-service',
                    content: `
                        <div style="padding: 20px; border: 2px dashed #e2e8f0; background: #f8fafc; margin-bottom: 20px; border-radius: 12px; font-weight: bold; text-align: center; color: #64748b;">
                            [DRAFT - LEGALLY BINDING TERMS - REVIEW REQUIRED]
                        </div>
                        <h1>Terms of Service</h1>
                        <p>Please read these Terms of Service carefully before accessing or using our website. By accessing or using any part of the site, you agree to be bound by these Terms of Service.</p>
                        <h2>Online Store Terms</h2>
                        <p>By agreeing to these Terms of Service, you represent that you are at least the age of majority in your state or province of residence.</p>
                        <h2>Modifications to the Service and Prices</h2>
                        <p>Prices for our products are subject to change without notice.</p>
                    `,
                    status: 'draft'
                }
            ]

            const { data: inserted, error: upsertError } = await supabaseBrowser
                .from('pages')
                .upsert(
                    standardPages.map(p => ({ ...p, store_id: activeStoreId })),
                    { onConflict: 'store_id,slug', ignoreDuplicates: true }
                )
                .select()

            if (!upsertError) {
                setPages(inserted || [])
                if (inserted && inserted.length > 0) {
                    toast.success('Standard policy pages have been pre-filled for your store!')
                }
            } else {
                console.error('Failed to pre-fill pages:', upsertError.message || upsertError)
                setPages([])
            }
        } else {
            setPages(data || [])
        }
        setLoading(false)
    }

    if (loading || !storeId) {
        return (
            <div className="p-6 space-y-4">
                <div className="h-8 w-48 bg-gray-200 rounded animate-pulse mb-6" />
                <TableSkeleton rows={5} cols={4} />
            </div>
        )
    }

    return (
        <div className="p-6 space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-semibold">Pages</h1>
                <Link
                    href="/admin/pages/new"
                    className="bg-black text-white px-4 py-2 rounded text-sm font-medium"
                >
                    Add page
                </Link>
            </div>

            {/* HOMEPAGE DESIGNER CARD */}
            <div className="bg-gradient-to-r from-neutral-900 to-neutral-800 rounded-2xl p-6 text-white flex items-center justify-between shadow-xl">
                <div className="flex items-center gap-6">
                    <div className="w-14 h-14 rounded-2xl bg-white/10 backdrop-blur-md flex items-center justify-center border border-white/20">
                        <Layout className="w-7 h-7 text-white" />
                    </div>
                    <div>
                        <h2 className="text-xl font-bold">Homepage Designer</h2>
                        <p className="text-neutral-400 text-sm mt-0.5">Customize your storefront's main page sections and content.</p>
                    </div>
                </div>
                <Link
                    href="/admin/homepage"
                    className="bg-white text-black px-6 py-2.5 rounded-xl text-sm font-black hover:bg-neutral-100 transition-all flex items-center gap-2"
                >
                    Design Homepage <ArrowRight className="w-4 h-4" />
                </Link>
            </div>

            <div className="bg-white border rounded overflow-hidden">
                <table className="w-full text-sm">
                    <thead className="bg-gray-50 border-b">
                        <tr>
                            <th className="text-left px-6 py-3">Title</th>
                            <th className="text-left px-6 py-3">Status</th>
                            <th className="text-right px-6 py-3">Last modified</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y">
                        {pages.length === 0 && (
                            <tr>
                                <td colSpan={3} className="px-6 py-12 text-center text-gray-500">
                                    No pages found. Create your first page to get started.
                                </td>
                            </tr>
                        )}
                        {pages.map((page) => (
                            <tr key={page.id} className="hover:bg-gray-50">
                                <td className="px-6 py-4">
                                    <Link href={`/admin/pages/${page.id}`} className="font-medium text-blue-600 hover:underline">
                                        {page.title}
                                    </Link>
                                    <div className="text-xs text-gray-400">/{page.slug}</div>
                                </td>
                                <td className="px-6 py-4">
                                    <span className={`px-2 py-1 rounded-full text-[10px] uppercase font-bold tracking-wider ${page.status === 'published' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'}`}>
                                        {page.status}
                                    </span>
                                </td>
                                <td className="px-6 py-4 text-right text-gray-500">
                                    {new Date(page.updated_at).toLocaleDateString('en-IN', { dateStyle: 'medium' })}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    )
}
