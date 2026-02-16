'use client';

import { useEffect, useState } from 'react';

interface CountdownConfig {
    end_date?: string;
    label?: string;
}

function getTimeLeft(endDate: string) {
    const diff = new Date(endDate).getTime() - Date.now();
    if (diff <= 0) return { hours: 0, minutes: 0, seconds: 0 };
    const totalSeconds = Math.floor(diff / 1000);
    return {
        hours: Math.floor(totalSeconds / 3600),
        minutes: Math.floor((totalSeconds % 3600) / 60),
        seconds: totalSeconds % 60,
    };
}

export default function CountdownTimerBlock({ config }: { config: CountdownConfig }) {
    const endDate = config.end_date || new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString();
    const label = config.label || 'Offer ends in';

    const [timeLeft, setTimeLeft] = useState(getTimeLeft(endDate));

    useEffect(() => {
        const t = setInterval(() => setTimeLeft(getTimeLeft(endDate)), 1000);
        return () => clearInterval(t);
    }, [endDate]);

    const pad = (n: number) => String(n).padStart(2, '0');

    return (
        <section className="py-[var(--section-gap)] bg-[var(--urgency-bg)]">
            <div className="container mx-auto px-4 text-center">
                <p className="text-sm uppercase tracking-widest text-[var(--urgency-text)] mb-4 font-semibold">
                    {label}
                </p>
                <div className="flex justify-center gap-4 md:gap-8">
                    {[
                        { value: pad(timeLeft.hours), label: 'Hours' },
                        { value: pad(timeLeft.minutes), label: 'Minutes' },
                        { value: pad(timeLeft.seconds), label: 'Seconds' },
                    ].map(({ value, label: unitLabel }, i) => (
                        <div key={i} className="flex flex-col items-center">
                            <div
                                className="text-4xl md:text-6xl font-black tabular-nums"
                                style={{ color: 'var(--urgency-text)', fontFamily: 'var(--heading-font)' }}
                            >
                                {value}
                            </div>
                            <div className="text-xs uppercase tracking-widest mt-1 text-[var(--urgency-text)] opacity-70">
                                {unitLabel}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
