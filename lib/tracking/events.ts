export const trackEvent = (
    eventName: string,
    eventData: Record<string, any> = {},
    options?: { fb?: boolean; ga?: boolean }
) => {
    try {
        const shouldFireFB = options?.fb !== false;
        const shouldFireGA = options?.ga !== false;

        // Trigger Meta Pixel
        if (shouldFireFB && typeof window !== "undefined" && typeof (window as any).fbq === "function") {
            (window as any).fbq("track", eventName, eventData);
        }

        // Trigger Google Analytics (gtag.js)
        if (shouldFireGA && typeof window !== "undefined" && typeof (window as any).gtag === "function") {
            // Map common FB ecommerce events to GA4 equivalents if needed, or fire as custom
            let gaEventName = eventName;
            if (eventName === 'ViewContent') gaEventName = 'view_item';
            if (eventName === 'Purchase') gaEventName = 'purchase';
            if (eventName === 'InitiateCheckout') gaEventName = 'begin_checkout';

            (window as any).gtag("event", gaEventName, eventData);
        }
    } catch (error) {
        console.error(`Error tracking event ${eventName}:`, error);
    }
};

export const StandardEvents = {
    PAGE_VIEW: "PageView",
    VIEW_CONTENT: "ViewContent",
    ADD_TO_CART: "AddToCart",
    INITIATE_CHECKOUT: "InitiateCheckout",
    PURCHASE: "Purchase",
} as const;
