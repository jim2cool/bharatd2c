import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase-server'

export async function GET(req: Request) {
    try {
        const supabase = await createClient()
        const { searchParams } = new URL(req.url)
        const storeSlug = searchParams.get('storeSlug')

        if (!storeSlug) {
            return NextResponse.json({ error: 'storeSlug is required' }, { status: 400 })
        }

        // Resolve store_id
        const { data: store, error: storeError } = await supabase
            .from('stores')
            .select('id')
            .eq('slug', storeSlug)
            .single()

        if (storeError || !store) {
            return NextResponse.json({ error: 'Store not found' }, { status: 404 })
        }

        // Fetch last 3 drafts
        const { data: drafts, error: draftsError } = await supabase
            .from('product_content_drafts')
            .select('*')
            .eq('store_id', store.id)
            .order('created_at', { ascending: false })
            .limit(3)

        if (draftsError) {
            throw draftsError
        }

        return NextResponse.json(drafts)
    } catch (error) {
        console.error('Fetch Drafts Error:', error)
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
    }
}
