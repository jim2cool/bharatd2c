import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'
import path from 'path'

// Load env explicitly
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY
const targetStoreId = 'b3589f69-28a2-4831-b20c-06512f483ce4'

if (!supabaseUrl || !supabaseServiceKey) {
    console.error('Missing env vars')
    process.exit(1)
}

const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey)

async function setupFeaturedCollection() {
    console.log('--- SETTING UP FEATURED COLLECTION ---')

    // 1. Check if it exists
    const { data: existing } = await supabaseAdmin
        .from('collections')
        .select('id')
        .eq('store_id', targetStoreId)
        .eq('slug', 'featured')
        .single()

    if (existing) {
        console.log('Featured collection already exists.')
        // Update it to be featured just in case
        await supabaseAdmin
            .from('collections')
            .update({ is_featured: true, source_type: 'latest' })
            .eq('id', existing.id)
    } else {
        console.log('Creating Featured collection...')
        const { data, error } = await supabaseAdmin
            .from('collections')
            .insert([{
                store_id: targetStoreId,
                title: 'Curated for your ritual',
                description: 'Essentials designed to elevate your daily care routine.',
                slug: 'featured',
                is_featured: true,
                source_type: 'latest',
                collection_type: 'automated'
            }])
            .select()

        if (error) console.error('Error creating collection:', error)
        else console.log('Successfully created Featured collection:', data[0].id)
    }
}

setupFeaturedCollection()
