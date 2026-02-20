"use client";

import { useEffect } from "react";

export default function LandingPage() {
    useEffect(() => {
        // Direct redirect to the static high-fidelity landing page stored in public/index-landing.html
        window.location.replace("/index-landing.html");
    }, []);

    return (
        <div style={{ background: '#06070D', height: '100vh', display: 'flex', alignItems: 'center', justifyCenter: 'center' }}>
            {/* Loading state while redirecting */}
            <div style={{ color: '#00F5FF', fontFamily: 'monospace' }}>INITIALIZING ENGINE...</div>
        </div>
    );
}
