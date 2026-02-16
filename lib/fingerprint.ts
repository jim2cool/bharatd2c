/**
 * Lightweight device fingerprint for RTO fraud detection.
 *
 * Not cryptographic — intended only to be consistent per device
 * so the Supabase trigger can flag same-device / different-phone patterns.
 *
 * Returns a `fp_` prefixed base-36 string, e.g. "fp_1a2b3c4d".
 */
export function getDeviceFingerprint(): string {
    if (typeof window === 'undefined') return 'fp_server';

    const components = [
        navigator.userAgent,
        navigator.language,
        `${screen.width}x${screen.height}`,
        String(screen.colorDepth),
        String(new Date().getTimezoneOffset()),
        String(navigator.hardwareConcurrency ?? ''),
        String(navigator.platform ?? ''),
    ];

    const raw = components.join('|');
    let hash = 0;
    for (let i = 0; i < raw.length; i++) {
        hash = ((hash << 5) - hash) + raw.charCodeAt(i);
        hash |= 0; // Force 32-bit integer
    }
    return 'fp_' + Math.abs(hash).toString(36);
}
