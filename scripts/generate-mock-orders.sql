-- Mock Order Generation Script
-- Generates 20 orders across 4 stores with varying risk profiles

DO $$
DECLARE
    store_a_id UUID := '3a46d40e-8fa0-40b8-87a5-3ed29fc9d5ee'; -- Spice Route (Full)
    store_b_id UUID := '770db076-76c2-45be-a753-c495a8e019a8'; -- TrendDrop (Payments Only)
    store_c_id UUID := 'adeceb32-629f-40e5-9c8c-7b10b9282802'; -- OmniMart (WhatsApp Only)
    store_d_id UUID := '2597d6f1-c56c-4fec-b9ab-99f8c89669dc'; -- Elevate Fit (Minimal)
    
    prod_a_id UUID := '1114639f-42d7-4cdf-8ec3-d2507173ab48'; -- Spice Route Prod
    prod_b_id UUID := 'ef52a502-70d9-498f-b70f-8985f673c139'; -- TrendDrop Prod
    prod_c_id UUID := 'cd8530f1-639c-4bc9-8792-daa229e07891'; -- OmniMart Prod
    prod_d_id UUID := 'ce641724-00dd-4fa5-a766-e0429c0f460c'; -- Elevate Fit Prod
    
    dummy_customer_id UUID := '561393a5-77f2-4311-840a-fb20c638244a';
    order_id UUID;
    i INTEGER;
    pincodes TEXT[] := ARRAY[
        -- High Risk (Exclusion/Emerging)
        '531061', '791121', '843113', '110056', '362710',
        '464331', '686024', '743704', '360023', '222127',
        -- Regional Risk
        '182141', '781127', '794109', '744104', '790101',
        -- Safe
        '400001', '110001', '122001', '560001', '411001'
    ];
    
    curr_store UUID;
    curr_prod UUID;
    curr_pin TEXT;
    curr_score INTEGER;
    curr_target TEXT;
    curr_action TEXT;
    curr_level TEXT;
    curr_state TEXT;
    curr_summary TEXT;
    curr_rec TEXT;
    curr_status TEXT;
BEGIN
    FOR i IN 1..20 LOOP
        -- Select Store
        IF i <= 5 THEN curr_store := store_a_id; curr_prod := prod_a_id; curr_state := 'STATE_A';
        ELSIF i <= 10 THEN curr_store := store_b_id; curr_prod := prod_b_id; curr_state := 'STATE_B';
        ELSIF i <= 15 THEN curr_store := store_c_id; curr_prod := prod_c_id; curr_state := 'STATE_C';
        ELSE curr_store := store_d_id; curr_prod := prod_d_id; curr_state := 'STATE_D';
        END IF;
        
        curr_pin := pincodes[i];
        
        -- Logic: Score/Level/Actions
        IF i <= 10 THEN -- Exclusion / Emerging
            curr_score := 100;
            curr_level := 'high';
            curr_target := 'auto_cancel';
            curr_action := 'auto_cancel';
            curr_summary := 'High Risk — Auto-Cancellation Triggered';
            curr_rec := 'Pincode matches historical deep exclusion list. Order rejected to protect margins.';
            curr_status := 'cancelled';
        ELSIF i <= 15 THEN -- Regional
            curr_score := 60;
            curr_level := 'medium';
            curr_target := 'partial_prepaid';
            IF curr_state = 'STATE_A' OR curr_state = 'STATE_B' THEN curr_action := 'partial_prepaid';
            ELSIF curr_state = 'STATE_C' THEN curr_action := 'whatsapp_confirm';
            ELSE curr_action := 'hold_for_review';
            END IF;
            curr_summary := 'Medium Risk — Intervention Required';
            curr_rec := 'Regional risk zone detected. Fallback triggered based on store capabilities.';
            curr_status := CASE WHEN curr_action = 'hold_for_review' THEN 'held' ELSE 'new' END;
        ELSE -- Safe
            curr_score := 0;
            curr_level := 'low';
            curr_target := 'none';
            curr_action := 'none';
            curr_summary := 'Low Risk — Safe to Ship';
            curr_rec := 'No significant risk factors detected.';
            curr_status := 'new';
        END IF;

        -- Insert Order
        INSERT INTO orders (
            store_id, customer_id, status, payment_mode, total_amount, risk_level, order_number, meta
        ) VALUES (
            curr_store, dummy_customer_id, curr_status, 'cod', 1499, curr_level, 'MOCK-' || i,
            jsonb_build_object(
                'name', 'Mock Customer ' || i,
                'phone', '9876543' || (100 + i),
                'address', '123 Test Lane, Sector ' || i,
                'city', 'Test City',
                'state', 'Test State',
                'pincode', curr_pin,
                'risk_score', curr_score,
                'risk_summary', curr_summary,
                'risk_recommendation', curr_rec,
                'target_action', curr_target,
                'action_type', curr_action
            )
        ) RETURNING id INTO order_id;

        -- Insert Order Item
        INSERT INTO order_items (order_id, product_id, qty, price, cogs_at_sale)
        VALUES (order_id, curr_prod, 1, 1499, 499);

        -- Insert Intervention Record for Analytics
        INSERT INTO order_interventions (
            order_id, score, config_state, action_taken, target_action, metadata
        ) VALUES (
            order_id, curr_score, curr_state, curr_action, curr_target,
            jsonb_build_object('test_run', true)
        );
    END LOOP;
END $$;
