
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
    console.error('Missing Supabase credentials');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function runMigration() {
    console.log('Starting migration...');

    const queries = [
        `
    CREATE TABLE IF NOT EXISTS platform_settings (
        id INT PRIMARY KEY DEFAULT 1 CHECK (id = 1),
        cod_enabled BOOLEAN DEFAULT true,
        prepaid_enabled BOOLEAN DEFAULT true,
        cart_button_enabled BOOLEAN DEFAULT true,
        created_at TIMESTAMPTZ DEFAULT NOW(),
        updated_at TIMESTAMPTZ DEFAULT NOW()
    );
    `,
        `
    INSERT INTO platform_settings (id, cod_enabled, prepaid_enabled, cart_button_enabled)
    VALUES (1, true, true, true)
    ON CONFLICT (id) DO NOTHING;
    `,
        `
    ALTER TABLE stores
    ADD COLUMN IF NOT EXISTS cod_enabled BOOLEAN DEFAULT true,
    ADD COLUMN IF NOT EXISTS prepaid_enabled BOOLEAN DEFAULT true,
    ADD COLUMN IF NOT EXISTS cart_button_enabled BOOLEAN DEFAULT true,
    ADD COLUMN IF NOT EXISTS prepaid_discount_type TEXT CHECK (prepaid_discount_type IN ('flat', 'percentage')),
    ADD COLUMN IF NOT EXISTS prepaid_discount_value DECIMAL(10, 2);
    `,
        `
    ALTER TABLE products
    ADD COLUMN IF NOT EXISTS use_store_payment_settings BOOLEAN DEFAULT true;
    `
    ];

    /* 
       Attempting to run raw SQL. 
       If this fails because 'exec_sql' RPC is missing, we will output instructions for the user.
    */

    try {
        // Try using the pg driver directly if available? No, usually not installed.
        // Try RPC 'exec_sql'
        for (const query of queries) {
            console.log(`Executing: ${query.trim().substring(0, 50)}...`);
            const { error } = await supabase.rpc('exec_sql', { sql_query: query });
            if (error) {
                console.error('RPC Error:', error);
                throw error;
            }
        }
        console.log('Migration successful!');
    } catch (err) {
        console.error('Migration failed via RPC. Please run the SQL manually in Supabase Dashboard.');
        console.error(err);
        process.exit(1);
    }
}

runMigration();
