/**
 * dummyContent.ts — Sprint 9 (V3 Rewritten Edition)
 * Placeholder assets and high-converting copy for all 24 product categories.
 * Crafted using the 'copywriting' skill principles: Benefits over Features, Specificity, and Clarity.
 * Used during onboarding to seed stores before real content is uploaded.
 */

// ─── Category → Unsplash hero images (5 per category) ─────────────────────────
export const CATEGORY_HERO_IMAGES: Record<string, string[]> = {
    health: [
        'https://images.unsplash.com/photo-1607619056574-7b8d3ee536b2?w=1200',
        'https://images.unsplash.com/photo-1505576399279-565b52d4ac71?w=1200',
        'https://images.unsplash.com/photo-1583864697784-a0efc8379f70?w=1200',
        'https://images.unsplash.com/photo-1576858574144-9ae1ebcf5ae5?w=1200',
        'https://images.unsplash.com/photo-1490474418585-ba9bad8fd0ea?w=1200',
    ],
    food: [
        'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=1200',
        'https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=1200',
        'https://images.unsplash.com/photo-1543352634-a1c51d9f1fa7?w=1200',
        'https://images.unsplash.com/photo-1606787366850-de6330128bfc?w=1200',
        'https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=1200',
    ],
    fashion: [
        'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1200',
        'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=1200',
        'https://images.unsplash.com/photo-1523381210434-271e8be1f52b?w=1200',
        'https://images.unsplash.com/photo-1445205170230-053b83016050?w=1200',
        'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=1200',
    ],
    beauty: [
        'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=1200',
        'https://images.unsplash.com/photo-1487412947147-5cebf100ffc2?w=1200',
        'https://images.unsplash.com/photo-1580870069867-74c57ee1bb07?w=1200',
        'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=1200',
        'https://images.unsplash.com/photo-1571781926291-c477ebfd024b?w=1200',
    ],
    spiritual: [
        'https://images.unsplash.com/photo-1602607144573-f33e9eb6bb87?w=1200',
        'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=1200',
        'https://images.unsplash.com/photo-1545558014-8692077e9b5c?w=1200',
        'https://images.unsplash.com/photo-1528360983277-13d401cdc186?w=1200',
        'https://images.unsplash.com/photo-1587474260584-136574528ed5?w=1200',
    ],
    home: [
        'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=1200',
        'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=1200',
        'https://images.unsplash.com/photo-1484101403633-562f891dc89a?w=1200',
        'https://images.unsplash.com/photo-1567016376408-0226e4d0c1ea?w=1200',
        'https://images.unsplash.com/photo-1617103996702-96ff29b1c467?w=1200',
    ],
    furniture: [
        'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=1200',
        'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=1200',
        'https://images.unsplash.com/photo-1484101403633-562f891dc89a?w=1200',
    ],
    baby: [
        'https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?w=1200',
        'https://images.unsplash.com/photo-1519340241574-2cec6aef0c01?w=1200',
        'https://images.unsplash.com/photo-1487956382158-bb926046304a?w=1200',
        'https://images.unsplash.com/photo-1612817288484-6f916006741a?w=1200',
        'https://images.unsplash.com/photo-1533483595632-c5f0e57a1936?w=1200',
    ],
    pets: [
        'https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=1200',
        'https://images.unsplash.com/photo-1543466835-00a7907e9de1?w=1200',
        'https://images.unsplash.com/photo-1450778869180-41d0601e046e?w=1200',
        'https://images.unsplash.com/photo-1425082661705-1834bfd09dca?w=1200',
        'https://images.unsplash.com/photo-1601758174486-e9e8c68ea5f7?w=1200',
    ],
    electronics: [
        'https://images.unsplash.com/photo-1518770660439-4636190af475?w=1200',
        'https://images.unsplash.com/photo-1498049794561-7780e7231661?w=1200',
        'https://images.unsplash.com/photo-1468495244123-6c6c332eeece?w=1200',
        'https://images.unsplash.com/photo-1611532736597-de2d4265fba3?w=1200',
        'https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?w=1200',
    ],
    sports: [
        'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=1200',
        'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=1200',
        'https://images.unsplash.com/photo-1534258936925-c58bed479fcb?w=1200',
        'https://images.unsplash.com/photo-1522898467493-49726bf28798?w=1200',
        'https://images.unsplash.com/photo-1574680096145-d05b474e2155?w=1200',
    ],
    stationery: [
        'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=1200',
        'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=1200',
        'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?w=1200',
        'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=1200',
        'https://images.unsplash.com/photo-1531346680769-a1d79b57de5c?w=1200',
    ],
    automotive: [
        'https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=1200',
        'https://images.unsplash.com/photo-1494976388531-d1058494cdd8?w=1200',
        'https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?w=1200',
        'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=1200',
        'https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=1200',
    ],
    gardening: [
        'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=1200',
        'https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?w=1200',
        'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1200',
        'https://images.unsplash.com/photo-1523301343968-6a6ebf63c672?w=1200',
        'https://images.unsplash.com/photo-1466692476868-aef1dfb1e735?w=1200',
    ],
    art: [
        'https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=1200',
        'https://images.unsplash.com/photo-1460661419201-fd4cecdf8a8b?w=1200',
        'https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?w=1200',
        'https://images.unsplash.com/photo-1561839561-b13bcfe47225?w=1200',
        'https://images.unsplash.com/photo-1574017469870-89bef9edab6e?w=1200',
    ],
    jewellery: [
        'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=1200',
        'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=1200',
        'https://images.unsplash.com/photo-1599643478514-4a420416281b?w=1200',
        'https://images.unsplash.com/photo-1573408302382-999b55c25e6e?w=1200',
        'https://images.unsplash.com/photo-1531995811006-35cb42e1a022?w=1200',
    ],
    digital: [
        'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=1200',
        'https://images.unsplash.com/photo-1607799279861-4dddf8b87eda?w=1200',
        'https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=1200',
        'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=1200',
        'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=1200',
    ],
    b2b: [
        'https://images.unsplash.com/photo-1586528116311-ad8ed7c80a30?w=1200',
        'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=1200',
        'https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?w=1200',
        'https://images.unsplash.com/photo-1542744094-24638eff58bb?w=1200',
        'https://images.unsplash.com/photo-1454165205744-3b78555e5572?w=1200',
    ],
    dropshipping: [
        'https://images.unsplash.com/photo-1563986768609-322da13575f3?w=1200',
        'https://images.unsplash.com/photo-1531297484001-80022131f5a1?w=1200',
        'https://images.unsplash.com/photo-1555664424-778a1e5e1b48?w=1200',
        'https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=1200',
        'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=1200',
    ],
    marketplace: [
        'https://images.unsplash.com/photo-1544816155-12df9643f363?w=1200',
        'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=1200',
        'https://images.unsplash.com/photo-1472851294608-062f824d29cc?w=1200',
        'https://images.unsplash.com/photo-1512418490979-92798ccc13fb?w=1200',
        'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1200',
    ],
    multi: [
        'https://images.unsplash.com/photo-1526304640581-d334cdbbf45e?w=1200',
        'https://images.unsplash.com/photo-1567401893414-76b7b1e5a7a5?w=1200',
        'https://images.unsplash.com/photo-1485955900006-10f4d324d411?w=1200',
        'https://images.unsplash.com/photo-1555529669-e69e7aa0ba9a?w=1200',
        'https://images.unsplash.com/photo-1441986115162-8f484157352e?w=1200',
    ],
    experience: [
        'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=1200',
        'https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=1200',
        'https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=1200',
        'https://images.unsplash.com/photo-1519671482749-fd09be4ccebf?w=1200',
        'https://images.unsplash.com/photo-1540206351-d6067b219738?w=1200',
    ],
    renewed: [
        'https://images.unsplash.com/photo-1518770660439-4636190af475?w=1200',
        'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=1200',
        'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=1200',
        'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=1200',
        'https://images.unsplash.com/photo-1531297484001-80022131f5a1?w=1200',
    ],
    consultation: [
        'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=1200',
        'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=1200',
        'https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=1200',
        'https://images.unsplash.com/photo-1542744173-8e7e53415bb0?w=1200',
        'https://images.unsplash.com/photo-1600880212340-0e43c7afd90c?w=1200',
    ],
    generic: [
        'https://images.unsplash.com/photo-1567401893414-76b7b1e5a7a5?w=1200',
        'https://images.unsplash.com/photo-1472851294608-062f824d29cc?w=1200',
        'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=1200',
        'https://images.unsplash.com/photo-1485955900006-10f4d324d411?w=1200',
        'https://images.unsplash.com/photo-1560393464-5c69a73c5770?w=1200',
    ],
};

// ─── High-Converting Hero Headlines by Category ────────────────────────────────
export const ARCHETYPE_HEADLINES: Record<string, { title: string; subtitle: string }> = {
    health: { title: 'Health Supplements You Can Actually Trust', subtitle: 'Lab-tested, natural ingredients. Stop guessing and start feeling your best.' },
    food: { title: 'Farm-Fresh Food, Directly to Your Door', subtitle: 'Skip the supermarket shelves. Taste pure, unadulterated food made the traditional way.' },
    fashion: { title: 'Look Expensive. Pay the Maker Directly.', subtitle: 'Skip the middleman markups. Discover premium fabrics and modern fits meant to last.' },
    beauty: { title: 'Reveal Your Best Skin Without the Chemicals', subtitle: 'Dermatologist-tested skincare that hydrates, protects, and restores your natural glow.' },
    spiritual: { title: 'Bring Pure Devotion Into Your Daily Routine', subtitle: 'Authentic pooja essentials sourced directly from sacred artisan communities.' },
    home: { title: 'Turn Your House Into a Sanctuary', subtitle: 'Handcrafted decor and essentials that make every corner of your home feel inviting.' },
    furniture: { title: 'Heirloom Furniture That Anchors Your Room', subtitle: 'Solid wood, expert craftsmanship, and designs that outlive the trends.' },
    baby: { title: 'Safe, Gentle Choices for Your Little One', subtitle: 'BPA-free, non-toxic essentials that give parents complete peace of mind.' },
    pets: { title: 'Premium Care for Your Best Friend', subtitle: 'Vet-approved nutrition and accessories so they live happier, healthier lives.' },
    electronics: { title: 'Genuine Electronics That Just Work', subtitle: 'Stop worrying about fakes. Get 100% authentic tech with full replacement warranties.' },
    sports: { title: 'Gear Up to Perform at Your Peak', subtitle: 'Durable, professional-grade equipment designed for serious athletes and beginners alike.' },
    stationery: { title: 'Tools for the Organized Mind', subtitle: 'Premium notebooks and supplies that make working and studying an absolute pleasure.' },
    automotive: { title: 'Keep Your Ride Running Like New', subtitle: 'High-quality OEM parts and accessories guaranteed to fit perfectly and last longer.' },
    gardening: { title: 'Everything You Need to Grow Your Oasis', subtitle: 'Beginner-friendly kits, rich soil, and tools to make your balcony bloom.' },
    art: { title: 'Supplies to Match Your Creative Ambition', subtitle: 'Professional-grade pigments and canvases that bring your exact vision to life.' },
    dropshipping: { title: 'The Internet’s Most Viral Products', subtitle: 'Stop scrolling and start using. Get today’s trending problem-solvers delivered fast.' },
    marketplace: { title: 'India’s Best Independent Brands in One Place', subtitle: 'We do the vetting. You get the quality. Shop top-rated products safely.' },
    multi: { title: 'Your Daily Essentials, Solved.', subtitle: 'Everything you need to run your home and life, delivered quickly and reliably.' },
    jewellery: { title: 'Fine Jewellery Minus the Showroom Markup', subtitle: 'Certified, hallmarked pieces crafted by master artisans. Wear elegance every day.' },
    b2b: { title: 'Reliable Sourcing for Growing Businesses', subtitle: 'Consistent quality, GST invoices, and volume pricing that protects your margins.' },
    digital: { title: 'Accelerate Your Work from Day One', subtitle: 'Instant access to premium digital tools, templates, and courses that save you hours.' },
    experience: { title: 'Book Memories That Last a Lifetime', subtitle: 'Skip the generic tours. Connect with expert hosts for truly unforgettable experiences.' },
    renewed: { title: 'Flagship Tech at Smarter Prices', subtitle: 'Rigorously tested and certified renewed electronics backed by a solid 1-year warranty.' },
    consultation: { title: 'Get Expert Clarity in 30 Minutes', subtitle: 'Stop guessing. Book a secure, 1-on-1 session with a vetted professional today.' },
    generic: { title: 'Premium Quality, Delivered Directly', subtitle: 'Cut out the middlemen. Get better products, faster shipping, and honest pricing.' },
};

// ─── USP Bar Items (Benefits-focused) ─────────────────────────────────────────
export const CATEGORY_USP_DEFAULTS: Record<string, [string, string, string]> = {
    health: ['100% Natural Ingredients', '3rd-Party Lab Tested', 'Zero Harmful Fillers'],
    food: ['Sourced Straight from Farms', 'No Artificial Preservatives', 'Sealed for Maximum Freshness'],
    fashion: ['Premium, Breathable Fabrics', 'Hassle-Free 7-Day Returns', 'Free Delivery Pan India'],
    beauty: ['Clinically Dermatologist Tested', '100% Cruelty-Free', 'Results in 14 Days'],
    spiritual: ['Ethically Sourced Materials', 'Authentic Ritual Quality', 'Blessed & Sanctified'],
    home: ['Master Artisan Craftsmanship', 'Eco-Friendly Materials', 'Damage-Free Delivery'],
    furniture: ['Solid Wood Construction', 'Includes Free Assembly', '10-Year Structural Warranty'],
    baby: ['BIS Certified Safe', '100% BPA Free', 'Ultra-Gentle on Skin'],
    pets: ['Trusted by Veterinarians', 'Made with Real Ingredients', 'Safe for Sensitive Breeds'],
    electronics: ['1-Year Replacement Warranty', '100% Genuine Products', 'Free Insured Delivery'],
    sports: ['Built for Heavy Use', 'ISI Safety Certified', 'Sweat & Impact Resistant'],
    stationery: ['Bleed-Proof Archival Quality', 'Eco-Friendly Packaging', 'Smooth Writing Feel'],
    automotive: ['Guaranteed Universal Fit', 'Genuine OEM Standard', 'Easy DIY Installation'],
    gardening: ['High Yield Guarantee', 'Organic & Chemical-Free', 'Beginner Friendly Instructions'],
    art: ['High-Pigment Colors', 'Non-Toxic & Safe', 'Long-Lasting Durability'],
    dropshipping: ['Fast Priority Dispatch', 'Easy Returns Supported', 'Secure Payment Gateway'],
    marketplace: ['Vetted Quality Sellers', 'Centralized Easy Returns', 'Buyer Protection Guarantee'],
    multi: ['Massive Everyday Range', 'One-Click Easy Checkouts', 'Rapid Doorstep Delivery'],
    jewellery: ['BIS Hallmarked Purity', 'Insured Secure Shipping', 'Lifetime Exchange Value'],
    b2b: ['Assured Volume Discounts', 'GST Invoices Provided', 'Dedicated Account Manager'],
    digital: ['Instant Secure Access', 'Lifetime Free Updates', '24/7 Priority Support'],
    experience: ['Top-Rated Expert Hosts', 'Instant Confirmation', 'Flexible Rescheduling'],
    renewed: ['72-Point Quality Check', '1-Year Full Warranty', 'Looks & Works Like New'],
    consultation: ['Vetted Domain Experts', '100% Private & Secure', 'Actionable Next Steps'],
    generic: ['Free Express Delivery', 'No-Questions Returns', '100% Secure Payments'],
};

// ─── Trust Bar Statements (Social Proof) ───────────────────────────────────────
export const CATEGORY_TRUST_BAR: Record<string, string> = {
    health: 'Improving the energy and health of 50,000+ Indians',
    food: 'Served fresh on 25,000+ dining tables across India',
    fashion: 'Worn & loved by over 10,000 happy customers',
    beauty: 'Achieving clearer skin for 25,000+ beauty lovers',
    spiritual: 'The trusted choice for 1000+ daily temple rituals',
    home: 'Beautifying 15,000+ modern homes safely',
    furniture: 'Anchoring the living rooms of 5,000+ families',
    baby: 'Giving 20,000+ parents complete peace of mind',
    pets: 'Keeping 20,000+ Indian pets healthy and active',
    electronics: '100% Genuine tech trusted by 30,000+ professionals',
    sports: 'Powering the PRs of 5,000+ dedicated athletes',
    stationery: 'Inspiring the best ideas of 15,000+ creators',
    automotive: 'Keeping 10,000+ cars running smoothly across India',
    gardening: 'Greening up balconies in 5,000+ Indian cities',
    art: 'Enabling the vibrant creativity of 10,000+ artists',
    dropshipping: 'Delivering trending viral hits to 50,000+ doorsteps',
    marketplace: 'The reliable platform for 100,000+ monthly shoppers',
    multi: 'Serving everyday essentials to 40,000+ households',
    jewellery: 'Celebrating the special moments of 12,000+ women',
    b2b: 'Empowering the growth of 2,500+ Indian businesses',
    digital: 'Accelerating the workflows of 15,000+ professionals',
    experience: 'Creating unforgettable memories for 5,000+ guests',
    renewed: 'Saving money and e-waste for 20,000+ smart tech buyers',
    consultation: 'Providing clarity and strategy to 3,000+ ambitious clients',
    generic: 'Highly rated and trusted by thousands of happy buyers',
};

// ─── Dummy Testimonials (Outcome and Relief Focused) ──────────────────────────
export const DUMMY_TESTIMONIALS: Record<string, Array<{ name: string; location: string; text: string; rating: number }>> = {
    health: [
        { name: 'Meena R.', location: 'Chennai', text: 'Unlike other brands, I actually felt my energy levels return after a week. Complete game changer.', rating: 5 },
        { name: 'Arvind S.', location: 'Pune', text: 'I love that they share their lab reports. Finally, supplements I can trust without anxiety.', rating: 5 },
        { name: 'Deepa K.', location: 'Mumbai', text: 'Fast delivery, proper sealed packaging, and no stomach upsets. Highly recommended.', rating: 4 },
    ],
    fashion: [
        { name: 'Kavita P.', location: 'Delhi', text: 'The fabric quality feels far more expensive than the price tag. The fit was exactly as per the size chart.', rating: 5 },
        { name: 'Rohan S.', location: 'Ahmedabad', text: 'I was hesitant to buy online due to sizing, but their exchange process was incredibly smooth. Kept it anyway!', rating: 5 },
    ],
    beauty: [
        { name: 'Nisha A.', location: 'Mumbai', text: 'Cleared my stubborn breakouts within two weeks. My skin feels deeply hydrated without feeling oily.', rating: 5 },
        { name: 'Pooja G.', location: 'Jaipur', text: 'It\'s hard finding clean beauty that actually does what it claims. This is my new holy grail.', rating: 5 },
    ],
    b2b: [
        { name: 'Vikram Mehta', location: 'Surat', text: 'Getting bulk materials with prompt GST invoices has streamlined our accounting. Quality is always consistent.', rating: 5 },
        { name: 'Sanjay Ops', location: 'Delhi', text: 'Their dedicated account manager responds in minutes. Sourcing is no longer a headache for our firm.', rating: 5 },
    ],
    jewellery: [
        { name: 'Anjali D.', location: 'Bengaluru', text: 'The hallmark certification gave me the confidence to buy online. The craftsmanship is breathtaking in person.', rating: 5 },
        { name: 'Ritu K.', location: 'Hyderabad', text: 'Beautifully packaged and arrived fully insured. It made for the perfect anniversary gift.', rating: 5 },
    ],
    electronics: [
        { name: 'Arun M.', location: 'Noida', text: 'Verified the serial number on the manufacturer website instantly. 100% genuine and fast delivery.', rating: 5 },
    ],
    digital: [
        { name: 'Karan T.', location: 'Pune', text: 'Downloaded instantly after payment. These templates saved me at least 15 hours of manual work this week.', rating: 5 },
    ],
    consultation: [
        { name: 'Priya S.', location: 'Gurgaon', text: 'The 45-minute call gave me more actionable clarity than a month of reading blogs. Worth every rupee.', rating: 5 },
    ],
    generic: [
        { name: 'Priya S.', location: 'Mumbai', text: 'Absolutely love the quality! It solved exactly the problem I was having. Delivered within 3 days.', rating: 5 },
        { name: 'Rahul K.', location: 'Delhi', text: 'Great products at amazing prices. Packaging was excellent and the customer support is super responsive.', rating: 5 },
        { name: 'Anita M.', location: 'Bangalore', text: 'Trustworthy seller. The item looks exactly as described on the website. Very happy with the purchase!', rating: 4 },
    ],
};

// Fill remaining categories with generic placeholders dynamically
[
    'fashion', 'beauty', 'electronics', 'home', 'health', 'spiritual', 'furniture', 'food',
    'dropshipping', 'marketplace', 'multi', 'jewellery', 'art', 'pets', 'baby', 'stationery',
    'automotive', 'sports', 'gardening', 'b2b', 'digital', 'experience', 'renewed', 'consultation'
].forEach(cat => {
    if (!CATEGORY_HERO_IMAGES[cat]) CATEGORY_HERO_IMAGES[cat] = CATEGORY_HERO_IMAGES.generic;
    if (!ARCHETYPE_HEADLINES[cat]) ARCHETYPE_HEADLINES[cat] = ARCHETYPE_HEADLINES.generic;
    if (!CATEGORY_USP_DEFAULTS[cat]) CATEGORY_USP_DEFAULTS[cat] = CATEGORY_USP_DEFAULTS.generic;
    if (!CATEGORY_TRUST_BAR[cat]) CATEGORY_TRUST_BAR[cat] = CATEGORY_TRUST_BAR.generic;
    if (!DUMMY_TESTIMONIALS[cat]) DUMMY_TESTIMONIALS[cat] = DUMMY_TESTIMONIALS.generic;
});

// ─── Legacy API (backwards compat) ────────────────────────────────────────────
export const DUMMY_ASSETS: Record<string, string[]> = CATEGORY_HERO_IMAGES;

export const DUMMY_COPY: Record<string, any> = {};

// Build legacy DUMMY_COPY for all 24 categories + generic
[
    'fashion', 'beauty', 'electronics', 'home', 'health', 'spiritual', 'furniture', 'food',
    'dropshipping', 'marketplace', 'multi', 'jewellery', 'art', 'pets', 'baby', 'stationery',
    'automotive', 'sports', 'gardening', 'b2b', 'digital', 'experience', 'renewed', 'consultation', 'generic'
].forEach(cat => {
    DUMMY_COPY[cat] = {
        hero_title: ARCHETYPE_HEADLINES[cat]?.title || ARCHETYPE_HEADLINES.generic.title,
        hero_subtitle: ARCHETYPE_HEADLINES[cat]?.subtitle || ARCHETYPE_HEADLINES.generic.subtitle,
        usp_1: CATEGORY_USP_DEFAULTS[cat]?.[0] || CATEGORY_USP_DEFAULTS.generic[0],
        usp_2: CATEGORY_USP_DEFAULTS[cat]?.[1] || CATEGORY_USP_DEFAULTS.generic[1],
        usp_3: CATEGORY_USP_DEFAULTS[cat]?.[2] || CATEGORY_USP_DEFAULTS.generic[2],
    };
});

// ─── Accessor Functions ───────────────────────────────────────────────────────

export function getDummyAssets(category: string = 'generic'): string[] {
    return CATEGORY_HERO_IMAGES[category] || CATEGORY_HERO_IMAGES.generic;
}

export function getDummyCopy(category: string = 'generic'): Record<string, any> {
    return DUMMY_COPY[category] || DUMMY_COPY.generic;
}

export function getDummyTestimonials(category: string = 'generic') {
    return DUMMY_TESTIMONIALS[category] || DUMMY_TESTIMONIALS.generic;
}

export function getDummyTrustBar(category: string = 'generic'): string {
    return CATEGORY_TRUST_BAR[category] || CATEGORY_TRUST_BAR.generic;
}

export function getDummyHeroImage(category: string = 'generic'): string {
    const images = getDummyAssets(category);
    return images[0] || '';
}

export function getDummyHeadline(category: string = 'generic'): { title: string; subtitle: string } {
    return ARCHETYPE_HEADLINES[category] || ARCHETYPE_HEADLINES.generic;
}
