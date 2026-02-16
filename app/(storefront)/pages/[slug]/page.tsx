"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { supabaseBrowser } from "@/lib/supabase-browser";
import StaticPageLayout from "@/components/pages/StaticPageLayout";
import ReactMarkdown from "react-markdown";

export default function DynamicStaticPage() {
    const { slug } = useParams();
    const [page, setPage] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!slug) return;
        loadPage();
    }, [slug]);

    const loadPage = async () => {
        setLoading(true);
        // 1. Try pg_store_pages (New Registry)
        const { data: pgPage } = await supabaseBrowser
            .from('pg_store_pages')
            .select('*')
            .eq('slug', slug)
            .single();

        if (pgPage) {
            setPage(pgPage);
        } else {
            // 2. Fallback to legacy pages
            const { data: legacyPage } = await supabaseBrowser
                .from('pages')
                .select('*')
                .eq('slug', slug)
                .single();

            if (legacyPage) setPage(legacyPage);
        }
        setLoading(false);
    };

    if (loading) return <div className="min-h-screen flex items-center justify-center font-bold uppercase tracking-widest text-xs opacity-50">Loading Content...</div>;

    if (!page) return (
        <StaticPageLayout title="404 - Not Found">
            <p>The page you are looking for does not exist or has been moved.</p>
        </StaticPageLayout>
    );

    return (
        <StaticPageLayout title={page.title}>
            <div className="prose prose-sm md:prose-base max-w-none prose-headings:font-black prose-headings:uppercase prose-headings:italic prose-a:text-[var(--primary)]">
                <ReactMarkdown>{page.content || ""}</ReactMarkdown>
            </div>
        </StaticPageLayout>
    );
}
