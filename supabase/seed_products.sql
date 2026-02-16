-- SEED SCRIPT: Multi-Vertical Premium Catalog
-- TARGET STORE: a961589e-f53e-415d-b38e-3a23a1b7658f

-- NOTE: Ensure these product IDs are unique or use UPSERT logic if your schema allows.
-- This script assumes standard columns: id, store_id, title, subtitle, price, mrp, cogs, status, media, inventory, category

INSERT INTO products (store_id, title, subtitle, price, mrp, cogs, status, media, category, highlights)
VALUES
-- FASHION: Premium Linen Shirt
('a961589e-f53e-415d-b38e-3a23a1b7658f', 
 'Essentials Crisp Linen Shirt', 
 'Hand-crafted from 100% European Flax linen for ultimate breathability.', 
 2499, 4999, 850, 
 'active', 
 '[{"src": "https://images.unsplash.com/photo-1594932224828-b4b057b69cce?q=80&w=800", "type": "image"}]',
 'Fashion',
 '["100% Organic Linen", "Tailored Fit", "Pre-washed for Softness"]'),

-- FASHION: Midnight Denim
('a961589e-f53e-415d-b38e-3a23a1b7658f', 
 'Modern Slim Selvedge Denim', 
 'Japanese raw denim with a modern slim silhouette and signature red selvedge ID.', 
 3999, 7499, 1200, 
 'active', 
 '[{"src": "https://images.unsplash.com/photo-1542272604-787c3835535d?q=80&w=800", "type": "image"}]',
 'Fashion',
 '["Japanese Selvedge", "Indigo Dyed", "Reinforced Stitching"]'),

-- BEAUTY: Vitamin C Serum
('a961589e-f53e-415d-b38e-3a23a1b7658f', 
 'Glow-Up 15% Vitamin C Serum', 
 'Dermatologist-formulated brightening serum with stabilized L-Ascorbic acid.', 
 1299, 2499, 320, 
 'active', 
 '[{"src": "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?q=80&w=800", "type": "image"}]',
 'Beauty',
 '["Brightens Skin", "Fades Dark Spots", "Fragrance Free"]'),

-- BEAUTY: Hydrating Face Cream
('a961589e-f53e-415d-b38e-3a23a1b7658f', 
 'Ceramide Barrier Repair Cream', 
 'Triple ceramide complex to restore your skin moisture barrier overnight.', 
 1499, 2999, 380, 
 'active', 
 '[{"src": "https://images.unsplash.com/photo-1556228720-195a672e8a03?q=80&w=800", "type": "image"}]',
 'Beauty',
 '["24h Hydration", "Non-Comedogenic", "Clinically Proven"]'),

-- TECH: Wireless Earbuds
('a961589e-f53e-415d-b38e-3a23a1b7658f', 
 'Sonic Buds Pro - Active ANC', 
 'High-fidelity audio with hybrid active noise cancellation and 30-hour battery life.', 
 5999, 12999, 1800, 
 'active', 
 '[{"src": "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?q=80&w=800", "type": "image"}]',
 'Tech',
 '["Active Noise Cancellation", "IPX5 Water Resistant", "Fast Charging"]'),

-- TECH: Smart Watch
('a961589e-f53e-415d-b38e-3a23a1b7658f', 
 'Vitals Tracker Series 4', 
 'Monitor your health metrics with precision precision including ECG and SpO2.', 
 8999, 15999, 3200, 
 'active', 
 '[{"src": "https://images.unsplash.com/photo-1544117518-30df57809b09?q=80&w=800", "type": "image"}]',
 'Tech',
 '["AMOLED Display", "7-Day Battery", "Sleep Tracking"]');
