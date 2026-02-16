/**
 * Vertical Mapping Matrix
 * maps industries to specific theme configurations and CRO strategies.
 */

export type VerticalType = 'fashion' | 'beauty' | 'tech' | 'health' | 'dropshipping' | 'default';

export interface VerticalConfig {
    theme_config: {
        colors: {
            primary: string;
            accent: string;
        };
        typography: {
            fontFamily: string;
            headingSize: string;
        };
        header: {
            style: 'default' | 'modern' | 'minimal';
            sticky: boolean;
        };
        footer: {
            showSocials: boolean;
            copyrightText?: string;
        };
        announcementBar: {
            enabled: boolean;
            text: string;
            style: 'static' | 'marquee';
        };
        corners: {
            button: string;
            card: string;
            image: string;
        };
    };
    cro_strategy: {
        pdp_order: string[]; // determines order of components on PDP
        trust_elements: string[];
    };
}

export const verticalMapping: Record<VerticalType, VerticalConfig> = {
    fashion: {
        theme_config: {
            colors: {
                primary: "#111111", // Sleek black
                accent: "#E26A00", // Saffron
            },
            typography: {
                fontFamily: "Inter",
                headingSize: "medium",
            },
            header: {
                style: 'modern',
                sticky: true,
            },
            footer: {
                showSocials: true,
            },
            announcementBar: {
                enabled: true,
                text: "New Season Arrivals | Free Shipping on Orders Above ₹1499",
                style: 'marquee',
            },
            corners: {
                button: "4px",
                card: "8px",
                image: "12px",
            }
        },
        cro_strategy: {
            pdp_order: ['highlights', 'bundles', 'reviews', 'shipping'],
            trust_elements: ['secure_pay', 'easy_returns'],
        }
    },
    beauty: {
        theme_config: {
            colors: {
                primary: "#4A2C2A", // Deep rose/brown
                accent: "#D4A373", // Champagne gold
            },
            typography: {
                fontFamily: "Inter",
                headingSize: "medium",
            },
            header: {
                style: 'default',
                sticky: true,
            },
            footer: {
                showSocials: true,
            },
            announcementBar: {
                enabled: true,
                text: "Dermatologist Tested | Vegan & Cruelty Free 🐰",
                style: 'static',
            },
            corners: {
                button: "24px", // Rounded for "soft" look
                card: "16px",
                image: "16px",
            }
        },
        cro_strategy: {
            pdp_order: ['reviews', 'ingredients', 'how_to_use', 'bundles'],
            trust_elements: ['dermatology', 'cruelty_free'],
        }
    },
    tech: {
        theme_config: {
            colors: {
                primary: "#0F172A", // Dark blue/gray
                accent: "#3B82F6", // Tech blue
            },
            typography: {
                fontFamily: "Inter",
                headingSize: "medium",
            },
            header: {
                style: 'minimal',
                sticky: false,
            },
            footer: {
                showSocials: true,
            },
            announcementBar: {
                enabled: true,
                text: "Same Day Shipping on Orders Before 2 PM ⚡",
                style: 'static',
            },
            corners: {
                button: "8px",
                card: "12px",
                image: "8px",
            }
        },
        cro_strategy: {
            pdp_order: ['specs', 'comparisons', 'bundles', 'reviews'],
            trust_elements: ['warranty', 'tech_support'],
        }
    },
    health: {
        theme_config: {
            colors: {
                primary: "#065F46", // Emerald green
                accent: "#10B981", // Health green
            },
            typography: {
                fontFamily: "Inter",
                headingSize: "medium",
            },
            header: {
                style: 'default',
                sticky: true,
            },
            footer: {
                showSocials: false,
            },
            announcementBar: {
                enabled: true,
                text: "Certified Organic | FSSAI Approved Ingredients",
                style: 'static',
            },
            corners: {
                button: "2px", // Professional/Sharp
                card: "4px",
                image: "4px",
            }
        },
        cro_strategy: {
            pdp_order: ['certification', 'benefits', 'reviews', 'usage'],
            trust_elements: ['fssai', 'organic_cert'],
        }
    },
    dropshipping: {
        theme_config: {
            colors: {
                primary: "#EF4444", // Red for urgency
                accent: "#FBBF24", // Yellow for stock alerts
            },
            typography: {
                fontFamily: "Inter",
                headingSize: "medium",
            },
            header: {
                style: 'modern',
                sticky: true,
            },
            footer: {
                showSocials: true,
            },
            announcementBar: {
                enabled: true,
                text: "Limited Stock! Only 11 items left! 🛒",
                style: 'marquee',
            },
            corners: {
                button: "0px", // Direct/Urgent
                card: "0px",
                image: "0px",
            }
        },
        cro_strategy: {
            pdp_order: ['stock_scarcity', 'bundles', 'reviews', 'shipping_fast'],
            trust_elements: ['delivery_check', 'cod_available'],
        }
    },
    default: {
        theme_config: {
            colors: {
                primary: "#111111",
                accent: "#E26A00",
            },
            typography: {
                fontFamily: "Inter",
                headingSize: "medium",
            },
            header: {
                style: 'default',
                sticky: true,
            },
            footer: {
                showSocials: true,
            },
            announcementBar: {
                enabled: true,
                text: "Free Shipping on Orders Above ₹999 | COD Available",
                style: 'static',
            },
            corners: {
                button: "6px",
                card: "8px",
                image: "8px",
            }
        },
        cro_strategy: {
            pdp_order: ['highlights', 'bundles', 'reviews'],
            trust_elements: ['secure_pay'],
        }
    }
};
