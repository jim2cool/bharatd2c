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

        const { store_id, order_count = 10 } = await req.json();

        if (!store_id) {
            throw new Error("store_id is required");
        }

        // 1. Get Store Info
        const { data: store, error: storeError } = await supabaseClient
            .from("stores")
            .select("id, store_code")
            .eq("id", store_id)
            .single();

        if (storeError || !store) throw new Error("Store not found");

        // 2. Get some products
        const { data: products } = await supabaseClient
            .from("products")
            .select("id, title, price, cogs")
            .eq("store_id", store_id)
            .limit(5);

        if (!products || products.length === 0) {
            throw new Error("No products found in store to create orders for");
        }

        const firstNames = ["Rahul", "Priya", "Amit", "Sneha", "Vikram", "Anjali", "Suresh", "Meera"];
        const lastNames = ["Sharma", "Verma", "Gupta", "Nair", "Patel", "Singh", "Das", "Joshi"];
        const cities = ["New Delhi", "Mumbai", "Bangalore", "Gurgaon", "Pune", "Hyderabad"];
        const states = ["Delhi", "Maharashtra", "Karnataka", "Haryana", "Maharashtra", "Telangana"];

        const mockOrders = [];

        for (let i = 0; i < order_count; i++) {
            const fName = firstNames[Math.floor(Math.random() * firstNames.length)];
            const lName = lastNames[Math.floor(Math.random() * lastNames.length)];
            const phone = "9" + Math.floor(100000000 + Math.random() * 900000000);
            const email = `${fName.toLowerCase()}.${lName.toLowerCase()}@example.com`;
            const cityIdx = Math.floor(Math.random() * cities.length);

            // Backdate orders over last 14 days
            const daysAgo = Math.floor(Math.random() * 14);
            const createdAt = new Date(Date.now() - (daysAgo * 24 * 60 * 60 * 1000)).toISOString();

            // Random status
            const statuses = ["new", "confirmed", "shipped", "delivered"];
            const status = statuses[Math.floor(Math.random() * statuses.length)];

            // 3. Ensure Customer
            const { data: customer } = await supabaseClient
                .from("customers")
                .upsert({ phone }, { onConflict: "phone" })
                .select()
                .single();

            // 4. Generate Order Number (Simple logic for mock)
            const mm = String(new Date(createdAt).getMonth() + 1).padStart(2, '0');
            const yy = String(new Date(createdAt).getFullYear()).slice(-2);
            const seq = Math.floor(100000 + Math.random() * 900000);
            const orderNumber = `${store.store_code}-${mm}${yy}-${seq}`;

            // 5. Select random product(s)
            const numProducts = Math.floor(Math.random() * 2) + 1;
            const selectedProducts = products.sort(() => 0.5 - Math.random()).slice(0, numProducts);
            const totalAmount = selectedProducts.reduce((sum, p) => sum + p.price, 0);

            const { data: order, error: orderError } = await supabaseClient
                .from("orders")
                .insert({
                    store_id,
                    customer_id: customer.id,
                    order_number: orderNumber,
                    status,
                    payment_mode: Math.random() > 0.3 ? "cod" : "online",
                    total_amount,
                    created_at: createdAt,
                    meta: {
                        name: `${fName} ${lName}`,
                        phone,
                        email,
                        address: `Block ${Math.floor(Math.random() * 100)}, Apartment ${Math.floor(Math.random() * 500)}`,
                        city: cities[cityIdx],
                        state: states[cityIdx],
                        pincode: "11000" + Math.floor(Math.random() * 10),
                        otp_verified: true
                    }
                })
                .select()
                .single();

            if (orderError) continue;

            // 6. Insert Order Items
            const itemsToInsert = selectedProducts.map(p => ({
                order_id: order.id,
                product_id: p.id,
                qty: 1,
                price: p.price
            }));

            await supabaseClient.from("order_items").insert(itemsToInsert);
            mockOrders.push(orderNumber);
        }

        return new Response(JSON.stringify({
            success: true,
            count: mockOrders.length,
            orders: mockOrders
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
