"use client";

import { useEffect, useState } from 'react';
import Script from 'next/script';
import { supabaseBrowser } from '@/lib/supabase-browser';

export default function MarketingScripts({ storeId }: { storeId: string }) {
  const [config, setConfig] = useState<any>(null);

  useEffect(() => {
    async function fetchConfig() {
      if (!storeId) return;
      const { data } = await supabaseBrowser
        .from('sales_channels_config')
        .select('*')
        .eq('store_id', storeId)
        .single();

      if (data) setConfig(data);
    }
    fetchConfig();
  }, [storeId]);

  if (!config) return null;

  const showMeta = config.meta_is_active && config.meta_pixel_id;
  const showGoogle = config.google_is_active && config.ga4_measurement_id;

  return (
    <>
      {/* 🚀 META PIXEL SETUP */}
      {showMeta && (
        <>
          <Script id="fb-pixel-init" strategy="afterInteractive">
            {`
                          !function(f,b,e,v,n,t,s)
                          {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
                          n.callMethod.apply(n,arguments):n.queue.push(arguments)};
                          if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
                          n.queue=[];t=b.createElement(e);t.async=!0;
                          t.src=v;s=b.getElementsByTagName(e)[0];
                          s.parentNode.insertBefore(t,s)}(window, document,'script',
                          'https://connect.facebook.net/en_US/fbevents.js');
                          fbq('init', '${config.meta_pixel_id}');
                          fbq('track', 'PageView');
                        `}
          </Script>
          <noscript>
            <img
              height="1"
              width="1"
              style={{ display: 'none' }}
              src={`https://www.facebook.com/tr?id=${config.meta_pixel_id}&ev=PageView&noscript=1`}
              alt=""
            />
          </noscript>
        </>
      )}

      {/* 🚀 GOOGLE TAG MANAGER (GA4) SETUP */}
      {showGoogle && (
        <>
          <Script
            src={`https://www.googletagmanager.com/gtag/js?id=${config.ga4_measurement_id}`}
            strategy="afterInteractive"
          />
          <Script id="google-analytics-init" strategy="afterInteractive">
            {`
                          window.dataLayer = window.dataLayer || [];
                          function gtag(){dataLayer.push(arguments);}
                          gtag('js', new Date());
                          gtag('config', '${config.ga4_measurement_id}');
                        `}
          </Script>
        </>
      )}

      {/* 🎯 GLOBAL EVENT LISTENERS */}
      {/* The individual storefront components (like buttons) throw these CustomEvents, and this global script catches them and routes them to FB/Google if active. */}
      <Script id="marketing-events-router" strategy="afterInteractive">
        {`
                  window.fbq_track = function(event, data) {
                    if (window.fbq) fbq('track', event, data);
                  };
                  window.gtag_event = function(event, data) {
                    if (window.gtag) gtag('event', event, data);
                  };

                  // Catch AddToCart Event
                  window.addEventListener('add-to-cart', function(e) {
                    const data = e.detail;
                    if ('${showMeta}' === 'true') {
                        window.fbq_track('AddToCart', {
                          content_name: data.name,
                          content_ids: [data.id],
                          content_type: 'product',
                          value: data.price,
                          currency: 'INR'
                        });
                    }
                    if ('${showGoogle}' === 'true') {
                        window.gtag_event('add_to_cart', {
                          items: [{
                            item_id: data.id,
                            item_name: data.name,
                            price: data.price,
                            currency: 'INR',
                            quantity: 1
                          }]
                        });
                    }
                  });

                  // Catch InitiateCheckout Event
                  window.addEventListener('initiate-checkout', function(e) {
                    const data = e.detail;
                    if ('${showMeta}' === 'true') {
                        window.fbq_track('InitiateCheckout', {
                          value: data.total,
                          currency: 'INR',
                          num_items: data.count
                        });
                    }
                    if ('${showGoogle}' === 'true') {
                        window.gtag_event('begin_checkout', {
                          value: data.total,
                          currency: 'INR',
                          items: data.items
                        });
                    }
                  });
                `}
      </Script>
    </>
  );
}
