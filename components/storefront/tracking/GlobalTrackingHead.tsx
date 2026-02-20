import Script from "next/script";

interface TrackingHeadProps {
    metaPixelId?: string | null;
    ga4Id?: string | null;
    isActive?: boolean;
}

export function GlobalTrackingHead({ metaPixelId, ga4Id, isActive = true }: TrackingHeadProps) {
    if (!isActive) return null;

    return (
        <>
            {/* 🚀 META PIXEL SETUP */}
            {metaPixelId && (
                <Script id="meta-pixel-init" strategy="afterInteractive">
                    {`
            !function(f,b,e,v,n,t,s)
            {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
            n.callMethod.apply(n,arguments):n.queue.push(arguments)};
            if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
            n.queue=[];t=b.createElement(e);t.async=!0;
            t.src=v;s=b.getElementsByTagName(e)[0];
            s.parentNode.insertBefore(t,s)}(window, document,'script',
            'https://connect.facebook.net/en_US/fbevents.js');
            fbq('init', '${metaPixelId}');
            fbq('track', 'PageView');
          `}
                </Script>
            )}

            {/* 🚀 GOOGLE TAG MANAGER (GA4) SETUP */}
            {ga4Id && (
                <>
                    <Script
                        src={`https://www.googletagmanager.com/gtag/js?id=${ga4Id}`}
                        strategy="afterInteractive"
                    />
                    <Script id="google-analytics-init" strategy="afterInteractive">
                        {`
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', '${ga4Id}');
            `}
                    </Script>
                </>
            )}
        </>
    );
}
