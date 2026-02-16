"use client";

import { useEffect } from 'react';
import Script from 'next/script';
import { supabaseBrowser } from '@/lib/supabase-browser';
import { useState } from 'react';

export default function MarketingScripts({ storeId }: { storeId: string }) {
    const [configs, setConfigs] = useState<any[]>([]);

    useEffect(() => {
        async function fetchConfigs() {
            if (!storeId) return;
            const { data } = await supabaseBrowser
                .from('marketing_configs')
                .select('*')
                .eq('store_id', storeId)
                .eq('is_active', true);

            if (data) setConfigs(data);
        }
        fetchConfigs();
    }, [storeId]);

    const metaConfig = configs.find(c => c.type === 'meta');
    const googleConfig = configs.find(c => c.type === 'google');

    return (
        <>
            {/* Meta Pixel */}
            {metaConfig?.pixel_id && (
                <>
                    <Script id="fb-pixel" strategy="afterInteractive">
                        {`
              !function(f,b,e,v,n,t,s)
              {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
              n.callMethod.apply(n,arguments):n.queue.push(arguments)};
              if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
              n.queue=[];t=b.createElement(e);t.async=!0;
              t.src=v;s=b.getElementsByTagName(e)[0];
              s.parentNode.insertBefore(t,s)}(window, document,'script',
              'https://connect.facebook.net/en_US/fbevents.js');
              fbq('init', '${metaConfig.pixel_id}');
              fbq('track', 'PageView');
            `}
                    </Script>
                    <noscript>
                        <img
                            height="1"
                            width="1"
                            style={{ display: 'none' }}
                            src={`https://www.facebook.com/tr?id=${metaConfig.pixel_id}&ev=PageView&noscript=1`}
                        />
                    </noscript>
                </>
            )}

            {/* Google Tag */}
            {googleConfig?.pixel_id && (
                <>
                    <Script
                        src={`https://www.googletagmanager.com/gtag/js?id=${googleConfig.pixel_id}`}
                        strategy="afterInteractive"
                    />
                    <Script id="google-analytics" strategy="afterInteractive">
                        {`
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', '${googleConfig.pixel_id}');
            `}
                    </Script>
                </>
            )}

            {/* Client-side Event Tracking */}
            <Script id="marketing-events" strategy="afterInteractive">
                {`
          window.fbq_track = function(event, data) {
            if (window.fbq) fbq('track', event, data);
          };
          window.gtag_event = function(event, data) {
            if (window.gtag) gtag('event', event, data);
          };

          // Listen for custom events from the app
          window.addEventListener('add-to-cart', function(e) {
            const data = e.detail;
            window.fbq_track('AddToCart', {
              content_name: data.name,
              content_ids: [data.id],
              content_type: 'product',
              value: data.price,
              currency: 'INR'
            });
            window.gtag_event('add_to_cart', {
              items: [{
                item_id: data.id,
                item_name: data.name,
                price: data.price,
                currency: 'INR',
                quantity: 1
              }]
            });
          });

          window.addEventListener('initiate-checkout', function(e) {
            const data = e.detail;
            window.fbq_track('InitiateCheckout', {
              value: data.total,
              currency: 'INR',
              num_items: data.count
            });
            window.gtag_event('begin_checkout', {
              value: data.total,
              currency: 'INR',
              items: data.items
            });
          });
        `}
            </Script>
        </>
    );
}
