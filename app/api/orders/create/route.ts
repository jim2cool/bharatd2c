import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const {
      name,
      phone,
      address,
      pincode,
      city,
      state,
      cart,
      pincode_meta,
    } = body;

    /* ---------------- BASIC VALIDATION ---------------- */

    if (!Array.isArray(cart) || cart.length === 0) {
      return NextResponse.json(
        { success: false, error: "Invalid order data" },
        { status: 400 }
      );
    }

    if (!/^[6-9]\d{9}$/.test(phone)) {
      return NextResponse.json(
        { success: false, error: "Invalid phone" },
        { status: 400 }
      );
    }

    /* ---------------- STORE ---------------- */

    const { data: store } = await supabase
      .from("stores")
      .select("id")
      .limit(1)
      .single();

    if (!store) {
      return NextResponse.json(
        { success: false, error: "Store not found" },
        { status: 500 }
      );
    }

    /* ---------------- CUSTOMER ---------------- */

    const { data: existingCustomer } = await supabase
      .from("customers")
      .select("id")
      .eq("phone", phone)
      .single();

    let customerId = existingCustomer?.id;

    if (!customerId) {
      const { data: newCustomer } = await supabase
        .from("customers")
        .insert([{ phone, name }])
        .select()
        .single();

      customerId = newCustomer.id;
    }

    /* ---------------- PRICE ANCHORING (SERVER) ---------------- */

    const productIds = cart.map((i: any) => i.product_id);

    const { data: products } = await supabase
      .from("products")
      .select("id, price")
      .in("id", productIds)
      .eq("status", "published");

    if (!products || products.length !== cart.length) {
      return NextResponse.json(
        { success: false, error: "PRODUCT_LOOKUP_FAILED" },
        { status: 400 }
      );
    }

    const priceMap = new Map(
      products.map(p => [p.id, p.price])
    );

    let total_amount = 0;

    const orderItems = cart.map((item: any) => {
      const price = priceMap.get(item.product_id);
      const qty = Math.max(1, Number(item.qty) || 1);

      total_amount += price * qty;

      return {
        product_id: item.product_id,
        qty,
        price,
      };
    });

    /* ---------------- ORDER ---------------- */

    const { data: order } = await supabase
      .from("orders")
      .insert([
        {
          store_id: store.id,
          customer_id: customerId,
          status: "new",
          payment_mode: "cod",
          total_amount,
          meta: {
            name,
            phone,
            address,
            pincode,
            city,
            state,
            pincode_meta: pincode_meta || null,
          },
        },
      ])
      .select()
      .single();

    if (!order) {
      return NextResponse.json(
        { success: false, error: "Order creation failed" },
        { status: 500 }
      );
    }

    /* ---------------- ORDER ITEMS ---------------- */

    await supabase.from("order_items").insert(
      orderItems.map(item => ({
        order_id: order.id,
        product_id: item.product_id,
        qty: item.qty,
        price: item.price,
      }))
    );

    return NextResponse.json(
      { success: true, order_id: order.id },
      { status: 200 }
    );
  } catch (err: any) {
    return NextResponse.json(
      {
        success: false,
        error: err?.message || "Server error",
      },
      { status: 500 }
    );
  }
}
