import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.7";

const corsHeaders = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

Deno.serve(async (req) => {
    if (req.method === "OPTIONS") {
        return new Response("ok", { headers: corsHeaders });
    }

    try {
        const supabaseClient = createClient(
            Deno.env.get("SUPABASE_URL") ?? "",
            Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
        );

        const { store_id, order_count = 100, backdating_days = 30 } = await req.json();

        if (!store_id) throw new Error("store_id is required");

        // 1. Get Store Info
        const { data: store, error: storeError } = await supabaseClient
            .from("stores")
            .select("id, store_code")
            .eq("id", store_id)
            .single();

        if (storeError || !store) throw new Error("Store not found");

        // 2. Get products (or seed them if needed)
        let { data: products } = await supabaseClient
            .from("products")
            .select("id, title, price, cogs")
            .eq("store_id", store_id);

        if (!products || products.length === 0) {
            throw new Error("No products found. Please seed a catalog first.");
        }

        const firstNames = ["Rahul", "Priya", "Amit", "Sneha", "Vikram", "Anjali", "Suresh", "Meera", "Karan", "Ishani", "Arjun", "Riya"];
        const lastNames = ["Sharma", "Verma", "Gupta", "Nair", "Patel", "Singh", "Das", "Joshi", "Chopra", "Malhotra", "Reddy", "Iyer"];
        const cities = ["New Delhi", "Mumbai", "Bangalore", "Gurgaon", "Pune", "Hyderabad", "Chennai", "Kolkata", "Ahmedabad", "Jaipur"];
        const states = ["Delhi", "Maharashtra", "Karnataka", "Haryana", "Maharashtra", "Telangana", "Tamil Nadu", "West Bengal", "Gujarat", "Rajasthan"];

        const mockOrders = [];

        // Chunking to avoid timeouts
        for (let i = 0; i < order_count; i++) {
            const fName = firstNames[Math.floor(Math.random() * firstNames.length)];
            const lName = lastNames[Math.floor(Math.random() * lastNames.length)];
            const phone = "9" + Math.floor(100000000 + Math.random() * 900000000);
            const email = `${fName.toLowerCase()}.${lName.toLowerCase()}@example.com`;
            const cityIdx = Math.floor(Math.random() * cities.length);

            // Distributed backdating for analytics curve
            // Higher density in the last 7 days
            const rand = Math.random();
            let daysAgo;
            if (rand > 0.6) {
                daysAgo = Math.floor(Math.random() * 7); // Recent
            } else if (rand > 0.2) {
                daysAgo = Math.floor(Math.random() * 21); // Medium
            } else {
                daysAgo = Math.floor(Math.random() * backdating_days); // Old
            }

            const createdAt = new Date(Date.now() - (daysAgo * 24 * 60 * 60 * 1000) - (Math.random() * 12 * 60 * 60 * 1000)).toISOString();

            // Weight status towards 'delivered' for analytics
            const statuses = ["new", "confirmed", "confirmed", "shipped", "delivered", "delivered", "delivered", "delivered", "delivered"];
            const status = statuses[Math.floor(Math.random() * statuses.length)];

            // 3. Ensure Customer
            const { data: customer } = await supabaseClient
                .from("customers")
                .upsert({ phone, meta: { is_demo: true } }, { onConflict: "phone" })
                .select()
                .single();

            // 4. Generate Order Number
            const mm = String(new Date(createdAt).getMonth() + 1).padStart(2, '0');
            const yy = String(new Date(createdAt).getFullYear()).slice(-2);
            const seq = 1000 + i + Math.floor(Math.random() * 500);
            const orderNumber = `${store.store_code}-${mm}${yy}-${seq}`;

            // 5. Select random products (1-3)
            const nItems = Math.floor(Math.random() * 3) + 1;
            const selected = products.sort(() => 0.5 - Math.random()).slice(0, nItems);
            const totalAmount = selected.reduce((sum, p) => sum + p.price, 0);
            const totalCogs = selected.reduce((sum, p) => sum + (p.cogs || 0), 0);

            // 6. Calculated Profit Metrics
            const payment_mode = Math.random() > 0.4 ? "cod" : "online";
            const estShipping = 70 + Math.floor(Math.random() * 50); // 70-120 range
            const estGateway = payment_mode === "online" ? (totalAmount * 0.025) : 0;
            const netProfit = totalAmount - totalCogs - estShipping - estGateway;

            const { data: order, error: orderError } = await supabaseClient
                .from("orders")
                .insert({
                    store_id,
                    customer_id: customer.id,
                    order_number: orderNumber,
                    status,
                    payment_mode,
                    total_amount: totalAmount,
                    shipping_cost_actual: estShipping,
                    gateway_fee_actual: estGateway,
                    net_profit: netProfit,
                    created_at: createdAt,
                    risk_level: status === 'delivered' ? 'low' : (Math.random() > 0.9 ? 'high' : 'low'),
                    meta: {
                        name: `${fName} ${lName}`,
                        phone,
                        email,
                        address: `H.No ${Math.floor(Math.random() * 200)}, Sector ${Math.floor(Math.random() * 50)}`,
                        city: cities[cityIdx],
                        state: states[cityIdx],
                        pincode: Math.floor(110001 + Math.random() * 500000).toString(),
                        otp_verified: true,
                        is_demo: true,
                        demo_session: "p3_profit_simulation"
                    }
                })
                .select()
                .single();

            if (orderError) {
                console.error("Order Insert Error:", orderError);
                continue;
            }

            // 7. Insert Order Items with COGS snapshot
            const itemsToInsert = selected.map(p => ({
                order_id: order.id,
                product_id: p.id,
                qty: 1,
                price: p.price,
                cogs_at_sale: p.cogs || 0,
                meta: { is_demo: true }
            }));

            await supabaseClient.from("order_items").insert(itemsToInsert);
            mockOrders.push(orderNumber);
        }

        return new Response(JSON.stringify({
            success: true,
            count: mockOrders.length,
            message: `Successfully seeded ${mockOrders.length} orders over ${backdating_days} days.`
        }), {
            headers: { ...corsHeaders, "Content-Type": "application/json" },
            status: 200,
        });
    } catch (error) {
        return new Response(JSON.stringify({ error: error.message }), {
            headers: { ...corsHeaders, "Content-Type": "application/json" },
            status: 400,
        });
    }
});
