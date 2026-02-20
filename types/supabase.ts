export type Json =
    | string
    | number
    | boolean
    | null
    | { [key: string]: Json | undefined }
    | Json[]

export interface Database {
    public: {
        Tables: {
            products: {
                Row: ProductEntity
            }
            stores: {
                Row: StoreEntity
            }
            product_variants: {
                Row: ProductVariantEntity
            }
            platform_settings: {
                Row: PlatformSettingsEntity
            }
            prepaid_configs: {
                Row: PrepaidConfigEntity
            }
            shipping_settings: {
                Row: ShippingSettingsEntity
            }
        }
    }
}

export interface ProductEntity {
    id: string
    created_at: string
    store_id: string
    slug: string
    title: string
    subtitle?: string | null
    short_description?: string | null
    description?: string | null
    content_markup?: string | null
    images?: string[] | null
    price: number
    mrp?: number | null
    status: 'published' | 'draft' | 'archived'
    rating?: number | null
    review_count?: number | null

    // Settings
    urgency_settings?: Json | null
    bundle_settings?: Json | null
    shipping_settings?: Json | null

    // Category
    category?: string | null
    category_data?: Json | null

    // Payment & Trust
    cod_enabled?: boolean | null
    prepaid_discount_type?: 'percentage' | 'flat' | null
    prepaid_discount_value?: number | null
    prepaid_offer_text?: string | null
    trust_indicators?: Json | null
    trust_strip_image_url?: string | null

    // Relations/Cross-sell
    related_products_title?: string | null
    use_store_payment_settings?: boolean | null
    show_estimated_delivery?: boolean | null

    // Content
    highlights?: string[] | null
    testimonials?: Json[] | null // { name, location, rating, quote, hidden }
    how_to_use?: string | null
    who_is_it_for?: string | null
    why_it_works?: string | null

    variant_options?: Json[] | null
    has_variants?: boolean | null
}

export interface StoreEntity {
    id: string
    created_at: string
    name: string
    slug: string

    // Payment Settings
    cod_enabled?: boolean | null
    prepaid_enabled?: boolean | null
    cart_button_enabled?: boolean | null
    prepaid_discount_type?: 'percentage' | 'flat' | null
    prepaid_discount_value?: number | null
    prepaid_stacking_logic?: 'highest_only' | 'stack' | null
}

export interface ProductVariantEntity {
    id: string
    product_id: string
    title: string
    price: number
    mrp?: number | null
    inventory: number
    is_default: boolean
    status: 'active' | 'archived' | 'draft'
    unit_count?: number | null
    sku?: string | null
    attributes?: Json | null
}

export interface PlatformSettingsEntity {
    id: number
    cod_enabled: boolean
    prepaid_enabled: boolean
    cart_button_enabled: boolean
}

export interface PrepaidConfigEntity {
    id: string
    store_id: string
    is_active: boolean
    rule_type: string
    min_order_value?: number | null
    discount_type: 'percentage' | 'flat'
    discount_value: number
}

export interface ShippingSettingsEntity {
    id: string
    store_id: string
    // Add other fields as needed
}
