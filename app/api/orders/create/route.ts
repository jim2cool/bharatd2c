import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, phone, address, pincode, total_amount, product_id } = body;

    /* Validate phone server-side */
    if (!/^[6-9]\d{9}$/.test(phone)) {
      return NextResponse.json(
        { success: false, error: "Invalid phone" },
        { status: 400 }
      );
    }

    /* Get or create customer */
    const { data: existingCustomer } = await supabase
      .from("customers")
      .select("id")
      .eq("phone", phone)
      .single();

    let customerId = existingCustomer?.id;

    if (!customerId) {
      const { data: newCustomer, error } = await supabase
        .from("customers")
        .insert([{ phone }])
        .select()
        .single();

      if (error) {
        return NextResponse.json(
          { success: false, error },
          { status: 500 }
        );
      }

      customerId = newCustomer.id;
    }

    /* Get store */
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

    /* Create order */
    const { data: orderRow, error: orderError } = await supabase
  .from("orders")
  .insert([
    {
      store_id: store.id,
      customer_id: customerId,
      status: "new",
      payment_mode: "cod",
      total_amount: total_amount || 0,
      risk_level: "low",
      meta: {
        name: name || "",
        phone: phone || "",
        address: address || "",
        pincode: pincode || "",
      },
    },
  ])
  .select()
  .single();

if (orderError || !orderRow) {
  return NextResponse.json(
    { success: false, error: orderError },
    { status: 500 }
  );
}
// Create order item (Buy Now = single item)
if (product_id) {
  await supabase.from("order_items").insert([
    {
      order_id: orderRow.id,
      product_id: product_id,
      qty: 1,
      price: total_amount || 0,
    },
  ]);
}


    if (orderError) {
      return NextResponse.json(
        { success: false, error: orderError },
        { status: 500 }
      );
    }

    /* ALWAYS return JSON */
    return NextResponse.json({ success: true }, { status: 200 });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err?.message || err },
      { status: 500 }
    );
  }
}
