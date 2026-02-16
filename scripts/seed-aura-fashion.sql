-- AURORA FASHION SEED SCRIPT
-- Purpose: Create a premium fashion test store with full mock data

DO $$
DECLARE
    new_store_id UUID := 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11'; -- Fixed ID for consistency
    product_hoodie_id UUID := gen_random_uuid();
    product_jeans_id UUID := gen_random_uuid();
    product_tee_id UUID := gen_random_uuid();
    product_dress_id UUID := gen_random_uuid();
    product_belt_id UUID := gen_random_uuid();
    product_socks_id UUID := gen_random_uuid();
    product_hat_id UUID := gen_random_uuid();
    product_jacket_id UUID := gen_random_uuid();
    product_shorts_id UUID := gen_random_uuid();
    product_bag_id UUID := gen_random_uuid();
    
    cust_id_1 UUID := gen_random_uuid();
    cust_id_2 UUID := gen_random_uuid();
    
    i INTEGER;
BEGIN
    -- 1. Create Store
    INSERT INTO public.stores (id, name, slug, store_code, logo_url, about, social_links, theme_config)
    VALUES (
        new_store_id,
        'Aura Fashion',
        'aura-fashion',
        'AUR',
        'https://images.unsplash.com/photo-1558769132-cb1aea458c5e?q=80&w=200&h=200&fit=crop',
        'Minimalist streetwear for the modern urban dweller. Premium quality, sustainable materials.',
        '{"instagram": "aura.fashion", "whatsapp": "+91 98765 43210"}',
        '{"presetId": "editorial", "colors": {"primary": "#000000", "secondary": "#ffffff"}}'
    ) ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name;

    -- 2. Create Products
    -- Oversized Hoodie
    INSERT INTO public.products (id, store_id, title, slug, description, price, mrp, cogs, status, category, bundle_settings)
    VALUES (
        product_hoodie_id, new_store_id, 'Urban Oversized Hoodie', 'urban-oversized-hoodie',
        'Premium cotton-blend hoodie with a relaxed fit. Perfect for layering.',
        2499, 3999, 800, 'published', 'Apparel',
        '{"enabled": true, "multi_purchase_enabled": true, "multi_qty": 2, "multi_discount_type": "percentage", "multi_discount_value": 15}'
    );

    -- Slim Fit Jeans
    INSERT INTO public.products (id, store_id, title, slug, description, price, mrp, cogs, status, category, bundle_settings)
    VALUES (
        product_jeans_id, new_store_id, 'Midnight Slim Fit Jeans', 'midnight-slim-jeans',
        'Deep indigo denim with a hint of stretch for all-day comfort.',
        2999, 4999, 1200, 'published', 'Apparel',
        '{"enabled": true, "cross_sell_product_ids": []}'
    );

    -- Essential Tee
    INSERT INTO public.products (id, store_id, title, slug, description, price, mrp, cogs, status, category)
    VALUES (
        product_tee_id, new_store_id, 'Essential White Tee', 'essential-white-tee',
        'The perfect white t-shirt. Heavyweight organic cotton.',
        899, 1499, 250, 'published', 'Apparel'
    );

    -- Leather Belt (Cross-sell for Jeans)
    INSERT INTO public.products (id, store_id, title, slug, description, price, mrp, cogs, status, category)
    VALUES (
        product_belt_id, new_store_id, 'Classic Leather Belt', 'classic-leather-belt',
        'Handcrafted genuine leather belt with a brushed metal buckle.',
        1299, 1999, 400, 'published', 'Accessories'
    );

    -- Update Jeans with Belt cross-sell
    UPDATE public.products 
    SET bundle_settings = jsonb_set(COALESCE(bundle_settings, '{}'::jsonb), '{cross_sell_product_ids}', jsonb_build_array(product_belt_id::text))
    WHERE id = product_jeans_id;

    -- 3. Customers
    INSERT INTO public.customers (id, phone, name)
    VALUES (cust_id_1, '9876543210', 'Rahul Sharma') ON CONFLICT DO NOTHING;
    INSERT INTO public.customers (id, phone, name)
    VALUES (cust_id_2, '9988776655', 'Priya Singh') ON CONFLICT DO NOTHING;

    -- 4. Mock Orders (Loop for volume)
    FOR i IN 1..50 LOOP
        INSERT INTO public.orders (
            store_id, customer_id, order_number, status, payment_mode, total_amount, created_at, meta
        ) VALUES (
            new_store_id,
            CASE WHEN i % 2 = 0 THEN cust_id_1 ELSE cust_id_2 END,
            'AUR-' || TO_CHAR(CURRENT_DATE, 'MMYY') || '-' || LPAD(i::text, 6, '0'),
            CASE WHEN i % 5 = 0 THEN 'cancelled'::text WHEN i % 3 = 0 THEN 'delivered'::text ELSE 'new'::text END,
            CASE WHEN i % 4 = 0 THEN 'online'::text ELSE 'cod'::text END,
            CASE WHEN i % 3 = 0 THEN 2499 WHEN i % 2 = 0 THEN 899 ELSE 3898 END,
            CURRENT_TIMESTAMP - (i || ' hours')::interval,
            jsonb_build_object(
                'name', CASE WHEN i % 2 = 0 THEN 'Rahul Sharma' ELSE 'Priya Singh' END,
                'phone', CASE WHEN i % 2 = 0 THEN '9876543210' ELSE '9988776655' END,
                'city', 'New Delhi',
                'address', 'H-Block, Connaught Place'
            )
        );
    END LOOP;

END $$;
