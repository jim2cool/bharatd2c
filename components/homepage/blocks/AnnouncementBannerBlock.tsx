'use client';

interface AnnouncementConfig {
    text?: string;
    bg_colour?: string;
    text_colour?: string;
    link?: string;
    link_text?: string;
}

export default function AnnouncementBannerBlock({ config }: { config: AnnouncementConfig }) {
    const {
        text = '🎉 Free shipping on orders above ₹499',
        link,
        link_text,
    } = config;

    const content = (
        <div
            className="w-full py-2.5 px-4 text-center text-sm font-medium z-50 relative"
            style={{
                backgroundColor: 'var(--urgency-bg)',
                color: 'var(--urgency-text)',
            }}
        >
            <span>{text}</span>
            {link && link_text && (
                <a href={link} className="ml-2 underline font-semibold hover:opacity-80 transition-opacity">
                    {link_text} →
                </a>
            )}
        </div>
    );

    return content;
}
