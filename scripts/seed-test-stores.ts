import { createClient } from '@supabase/supabase-js';
import crypto from 'crypto';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
    console.error('❌ Missing Supabase env variables.');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
    auth: { autoRefreshToken: false, persistSession: false }
});

const TEST_EMAIL = 'test@e4a.in';
const TEST_PASSWORD = 'E4A@Test123';

const TEST_MATRIX = [
    { name: 'Elevate Fit', sub: 'test-fashion', cat: 'fashion', arch: 'product-engine', style: 'gen-z' },
    { name: 'Pure Botanicals', sub: 'test-beauty', cat: 'beauty', arch: 'story-first', style: 'organic' },
    { name: 'TechPro Audio', sub: 'test-electronics', cat: 'electronics', arch: 'product-engine', style: 'tech' },
    { name: 'Culinary Hearth', sub: 'test-home', cat: 'home', arch: 'catalog-first', style: 'minimal' },
    { name: 'Vitality Supps', sub: 'test-health', cat: 'health', arch: 'product-engine', style: 'bold' },
    { name: 'Aura Stones', sub: 'test-spiritual', cat: 'spiritual', arch: 'story-first', style: 'feminine' },
    { name: 'Oak & Loom', sub: 'test-furniture', cat: 'furniture', arch: 'product-engine', style: 'premium' },
    { name: 'Spice Route', sub: 'test-food', cat: 'food', arch: 'catalog-first', style: 'marketplace' },
    { name: 'TrendDrop', sub: 'test-dropshipping', cat: 'dropshipping', arch: 'product-engine', style: 'gen-z' },
    { name: 'OmniMart', sub: 'test-multi', cat: 'multi', arch: 'catalog-first', style: 'minimal' },
];

const MOCK_IMAGES = [
    "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&q=80&w=800",
    "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&q=80&w=800",
    "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&q=80&w=800",
    "https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?auto=format&fit=crop&q=80&w=800",
    "https://images.unsplash.com/photo-1583394838336-acd977736f90?auto=format&fit=crop&q=80&w=800"
]

function getCategoryData(cat: string, index: number) {
    let specificData = {};
    let imgSource = MOCK_IMAGES[index % MOCK_IMAGES.length];

    switch (cat) {
        case 'food':
            specificData = { fssai_number: "10012011000000", nutritional_info: { energy: "100kcal", protein: "5g" }, ingredients: "Spice, Herbs" };
            imgSource = "https://images.unsplash.com/photo-1596040033229-a9821ebd058d?auto=format&fit=crop&q=80&w=800";
            break;
        case 'fashion':
            specificData = { size_guide: { S: "36", M: "38", L: "40" }, fabric_details: "100% Cotton" };
            imgSource = index % 2 === 0 ? "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&q=80&w=800" : "https://images.unsplash.com/photo-1529374255404-311a2a4f1fd9?auto=format&fit=crop&q=80&w=800";
            break;
        case 'electronics':
            specificData = { specs: [{ name: "Battery", value: "4000mAh" }, { name: "Weight", value: "200g" }], warranty: "1 Year Standard" };
            imgSource = index % 2 === 0 ? "https://images.unsplash.com/photo-1498049794561-7780e7231661?auto=format&fit=crop&q=80&w=800" : "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&q=80&w=800";
            break;
        case 'beauty':
            specificData = { ingredients: "Water, Glycerin, Niacinamide", how_to_use: "Apply daily on dry skin." };
            imgSource = "https://images.unsplash.com/photo-1596462502278-27bfdc403348?auto=format&fit=crop&q=80&w=800";
            break;
        case 'furniture':
            specificData = { dimensions: { length: "120cm", width: "60cm", height: "45cm" }, assembly: "Required" };
            imgSource = "https://images.unsplash.com/photo-1505691938895-1758d7feb511?auto=format&fit=crop&q=80&w=800";
            break;
        case 'health':
            specificData = { dosage: "2 scoops daily", fssai_number: "23344555" }
            imgSource = "https://images.unsplash.com/photo-1579722820308-d74e571900a9?auto=format&fit=crop&q=80&w=800";
            break;
    }
    return { specificData, imgSource };
}

async function seed() {
    console.log('🚀 Starting Deep Test Store Matrix Seeding...');

    // 1. Manage User
    console.log(`👤 Checking for user: ${TEST_EMAIL}`);
    const { data: usersData, error: usersError } = await supabase.auth.admin.listUsers();
    if (usersError) { console.error(usersError); process.exit(1); }

    let testUser = usersData.users.find(u => u.email === TEST_EMAIL);
    if (!testUser) {
        const { data: newUser, error: createError } = await supabase.auth.admin.createUser({ email: TEST_EMAIL, password: TEST_PASSWORD, email_confirm: true });
        if (createError) { console.error('❌ Failed to create user:', createError); process.exit(1); }
        testUser = newUser.user;
    }

    // Ensure the user has the correct role in the profiles table for the middleware to allow access to /admin
    const { error: profileError } = await supabase.from('profiles').update({ role: 'store_owner' }).eq('id', testUser.id);
    if (profileError) {
        console.error("Warning: could not update profile role to store_owner", profileError);
    }

    // 2. Clear old test stores
    console.log('🧹 Cleaning up old test stores...');
    const testSubdomains = TEST_MATRIX.map(m => m.sub);
    await supabase.from('stores').delete().in('domain', testSubdomains);

    // 3. Create Matrix and Content
    console.log('🏗️ Building test matrix + products + collections...');
    for (const config of TEST_MATRIX) {
        const storeId = crypto.randomUUID();

        // Insert Store
        await supabase.from('stores').insert({
            id: storeId,
            name: config.name,
            domain: config.sub,
            owner_id: testUser?.id,
            theme_config: {
                architecture: config.arch,
                stylePreset: config.style,
                category: { category: config.cat, requiredModules: [], optionalModules: [], imageRatio: '1:1', variantSelectorType: 'swatch' },
                sellerModifier: { urgencyLevel: 'high', socialProofWeight: 'heavy', trustDensity: 'heavy', ctaProminence: 'dominant', densityScale: 'compact', codBias: true }
            }
        });

        await supabase.from('store_roles').insert({ store_id: storeId, user_id: testUser?.id, role: 'owner' });

        // Insert Collections
        const collectionIds = [crypto.randomUUID(), crypto.randomUUID()];
        await supabase.from('collections').insert([
            { id: collectionIds[0], store_id: storeId, title: 'Best Sellers', slug: 'best-sellers', type: 'manual', status: 'active' },
            { id: collectionIds[1], store_id: storeId, title: 'New Arrivals', slug: 'new-arrivals', type: 'manual', status: 'active' }
        ]);

        // Insert 10 Products
        for (let i = 1; i <= 10; i++) {
            const productId = crypto.randomUUID();
            const { specificData, imgSource } = getCategoryData(config.cat, i);

            await supabase.from('products').insert({
                id: productId,
                store_id: storeId,
                title: `${config.name} Signature Product ${i}`,
                slug: `signature-product-${i}-${config.sub}`,
                price: 999 + (i * 100),
                mrp: 1499 + (i * 100),
                status: 'published',
                category: config.cat,
                category_data: specificData,
                images: [imgSource]
            });

            await supabase.from('product_variants').insert({
                id: crypto.randomUUID(),
                product_id: productId,
                store_id: storeId,
                price: 999 + (i * 100),
                inventory_quantity: 10 + i,
                slug: `signature-product-${i}-${config.sub}-base`,
                title: "Default standard",
                status: "active"
            });

            // Link to collections (Put first 5 in Best Sellers, last 5 in New Arrivals)
            const targetCollectionId = i <= 5 ? collectionIds[0] : collectionIds[1];
            await supabase.from('product_collections').insert({
                product_id: productId,
                collection_id: targetCollectionId
            });
        }

        console.log(`   ✅ Created ${config.name} (${config.sub}) with 2 Collections & 10 Products`);
    }

    console.log('🎉 Done! 10 rich test stores have been seeded.');
    process.exit(0);
}

seed().catch(err => {
    console.error(err);
    process.exit(1);
});
