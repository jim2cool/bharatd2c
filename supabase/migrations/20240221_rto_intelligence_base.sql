-- RTO Intelligence: Layer 1.4 - Real-time Pincode Intelligence
-- Tracks delivery outcomes by pincode and category to drive risk scoring.

CREATE TABLE IF NOT EXISTS public.pincode_intelligence (
    pincode TEXT NOT NULL,
    category TEXT NOT NULL DEFAULT 'default',
    total_orders INTEGER DEFAULT 0,
    rto_orders INTEGER DEFAULT 0,
    delivered_orders INTEGER DEFAULT 0,
    risk_score_modifier INTEGER DEFAULT 0, -- Manual or auto-calculated offset
    last_updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    PRIMARY KEY (pincode, category)
);

-- Index for fast lookup by pincode
CREATE INDEX IF NOT EXISTS idx_pincode_intel_pincode ON public.pincode_intelligence(pincode);

-- Table for logging outcomes to feed the intelligence table (Layer 1.4.B)
CREATE TABLE IF NOT EXISTS public.delivery_outcomes_log (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_id UUID REFERENCES public.orders(id),
    pincode TEXT NOT NULL,
    category TEXT NOT NULL,
    status TEXT NOT NULL, -- 'delivered', 'rto', 'returned'
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.pincode_intelligence ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.delivery_outcomes_log ENABLE ROW LEVEL SECURITY;

-- Allow read access for authenticated admins
CREATE POLICY "Admins can read pincode intelligence" ON public.pincode_intelligence
    FOR SELECT USING (true);
