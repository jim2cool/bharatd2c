import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'
import path from 'path'

// Load env explicitly
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY
const targetStoreId = 'b3589f69-28a2-4831-b20c-06512f483ce4'

if (!supabaseUrl || !supabaseAnonKey || !supabaseServiceKey) {
    console.error('Missing env vars')
    process.exit(1)
}

const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey)

async function verifyFeaturedFlow() {
    console.log('--- VERIFYING FEATURED FLOW ---')

    // 1. Check collection
    const { data: featuredCol } = await supabaseAdmin
        .from('collections')
        .select('*')
        .eq('store_id', targetStoreId)
        .eq('is_featured', true)
        .single()

    console.log('Featured Collection found:', featuredCol?.title, '(Slug:', featuredCol?.slug, ')')

    // 2. Check products via getProducts logic (manual mock)
    const { data: products, error } = await supabaseAdmin
        .from('products')
        .select('*')
        .eq('store_id', targetStoreId)
        .eq('status', 'published')
        .order('created_at', { ascending: false })
        .limit(5)

    if (error) {
        console.error('Error fetching products:', error)
    } else {
        console.log(`Successfully fetched ${products?.length} products through the fallback logic (if featuredCol source_type=latest).`)
        if (products?.length > 0) {
            console.log('Sample Product:', products[0].title)
        }
    }
}

verifyFeaturedFlow()
