"use client";

import { Globe2, Clock } from "lucide-react";

// ── Timezone list — curated IANA zones covering India + key global zones ────
// Full list kept short on purpose; India/Kolkata is first (default)
export const TIMEZONE_OPTIONS: { value: string; label: string; offset: string }[] = [
    { value: "Asia/Kolkata", label: "India Standard Time", offset: "+05:30" },
    { value: "Asia/Colombo", label: "Sri Lanka Standard Time", offset: "+05:30" },
    { value: "Asia/Dhaka", label: "Bangladesh Standard Time", offset: "+06:00" },
    { value: "Asia/Karachi", label: "Pakistan Standard Time", offset: "+05:00" },
    { value: "Asia/Kathmandu", label: "Nepal Time", offset: "+05:45" },
    { value: "Asia/Dubai", label: "Gulf Standard Time", offset: "+04:00" },
    { value: "Asia/Riyadh", label: "Arabia Standard Time", offset: "+03:00" },
    { value: "Asia/Singapore", label: "Singapore Standard Time", offset: "+08:00" },
    { value: "Asia/Kuala_Lumpur", label: "Malaysia Time", offset: "+08:00" },
    { value: "Asia/Bangkok", label: "Indochina Time", offset: "+07:00" },
    { value: "Asia/Jakarta", label: "Western Indonesian Time", offset: "+07:00" },
    { value: "Asia/Manila", label: "Philippine Standard Time", offset: "+08:00" },
    { value: "Asia/Tokyo", label: "Japan Standard Time", offset: "+09:00" },
    { value: "Asia/Shanghai", label: "China Standard Time", offset: "+08:00" },
    { value: "Asia/Seoul", label: "Korea Standard Time", offset: "+09:00" },
    { value: "Europe/London", label: "Greenwich Mean Time", offset: "+00:00" },
    { value: "Europe/Paris", label: "Central European Time", offset: "+01:00" },
    { value: "Europe/Amsterdam", label: "Amsterdam / Berlin / Paris", offset: "+01:00" },
    { value: "America/New_York", label: "Eastern Time", offset: "−05:00" },
    { value: "America/Chicago", label: "Central Time", offset: "−06:00" },
    { value: "America/Denver", label: "Mountain Time", offset: "−07:00" },
    { value: "America/Los_Angeles", label: "Pacific Time", offset: "−08:00" },
    { value: "America/Sao_Paulo", label: "Brasilia Time", offset: "−03:00" },
    { value: "Africa/Nairobi", label: "East Africa Time", offset: "+03:00" },
    { value: "Africa/Lagos", label: "West Africa Time", offset: "+01:00" },
    { value: "Pacific/Auckland", label: "New Zealand Standard Time", offset: "+12:00" },
    { value: "Australia/Sydney", label: "Australian Eastern Standard Time", offset: "+10:00" },
    { value: "UTC", label: "Coordinated Universal Time", offset: "+00:00" },
];

// ── Country list — curated for D2C relevance, India first ────────────────────
export const COUNTRY_OPTIONS: { value: string; label: string; flag: string }[] = [
    { value: "IN", label: "India", flag: "🇮🇳" },
    { value: "AE", label: "United Arab Emirates", flag: "🇦🇪" },
    { value: "SA", label: "Saudi Arabia", flag: "🇸🇦" },
    { value: "PK", label: "Pakistan", flag: "🇵🇰" },
    { value: "BD", label: "Bangladesh", flag: "🇧🇩" },
    { value: "LK", label: "Sri Lanka", flag: "🇱🇰" },
    { value: "NP", label: "Nepal", flag: "🇳🇵" },
    { value: "SG", label: "Singapore", flag: "🇸🇬" },
    { value: "MY", label: "Malaysia", flag: "🇲🇾" },
    { value: "TH", label: "Thailand", flag: "🇹🇭" },
    { value: "ID", label: "Indonesia", flag: "🇮🇩" },
    { value: "PH", label: "Philippines", flag: "🇵🇭" },
    { value: "VN", label: "Vietnam", flag: "🇻🇳" },
    { value: "NG", label: "Nigeria", flag: "🇳🇬" },
    { value: "KE", label: "Kenya", flag: "🇰🇪" },
    { value: "ZA", label: "South Africa", flag: "🇿🇦" },
    { value: "GB", label: "United Kingdom", flag: "🇬🇧" },
    { value: "DE", label: "Germany", flag: "🇩🇪" },
    { value: "FR", label: "France", flag: "🇫🇷" },
    { value: "NL", label: "Netherlands", flag: "🇳🇱" },
    { value: "US", label: "United States", flag: "🇺🇸" },
    { value: "CA", label: "Canada", flag: "🇨🇦" },
    { value: "BR", label: "Brazil", flag: "🇧🇷" },
    { value: "MX", label: "Mexico", flag: "🇲🇽" },
    { value: "AU", label: "Australia", flag: "🇦🇺" },
    { value: "NZ", label: "New Zealand", flag: "🇳🇿" },
    { value: "JP", label: "Japan", flag: "🇯🇵" },
    { value: "CN", label: "China", flag: "🇨🇳" },
    { value: "KR", label: "South Korea", flag: "🇰🇷" },
];

interface Props {
    timezone: string;
    country: string;
    onChange: (field: "timezone" | "country", value: string) => void;
}

export function RegionalSettings({ timezone, country, onChange }: Props) {
    const selectedTz = TIMEZONE_OPTIONS.find(t => t.value === timezone) ?? TIMEZONE_OPTIONS[0];
    const selectedCountry = COUNTRY_OPTIONS.find(c => c.value === country) ?? COUNTRY_OPTIONS[0];

    return (
        <section className="bg-white p-8 rounded-2xl border border-neutral-200 shadow-sm">
            <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-neutral-100 rounded-lg">
                    <Globe2 className="w-5 h-5 text-neutral-600" />
                </div>
                <div>
                    <h2 className="text-lg font-bold text-neutral-800">Regional Settings</h2>
                    <p className="text-xs text-neutral-400 mt-0.5">
                        Used for time-sensitive RTO signals (1am–4am COD window) and currency/locale defaults
                    </p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Country */}
                <div className="space-y-2">
                    <label className="text-xs font-black text-slate-400 uppercase tracking-widest">
                        Country
                    </label>
                    <div className="relative">
                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-lg pointer-events-none select-none">
                            {selectedCountry.flag}
                        </span>
                        <select
                            value={country}
                            onChange={e => onChange("country", e.target.value)}
                            className="w-full pl-10 pr-4 py-3 bg-white border border-slate-300 rounded-xl font-bold text-neutral-800 focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all shadow-sm appearance-none cursor-pointer"
                        >
                            {COUNTRY_OPTIONS.map(c => (
                                <option key={c.value} value={c.value}>
                                    {c.flag} {c.label}
                                </option>
                            ))}
                        </select>
                        <span className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                            ▾
                        </span>
                    </div>
                </div>

                {/* Timezone */}
                <div className="space-y-2">
                    <label className="flex items-center gap-1.5 text-xs font-black text-slate-400 uppercase tracking-widest">
                        <Clock className="w-3 h-3" /> Timezone
                    </label>
                    <div className="relative">
                        <select
                            value={timezone}
                            onChange={e => onChange("timezone", e.target.value)}
                            className="w-full px-4 py-3 bg-white border border-slate-300 rounded-xl font-bold text-neutral-800 focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all shadow-sm appearance-none cursor-pointer"
                        >
                            {TIMEZONE_OPTIONS.map(tz => (
                                <option key={tz.value} value={tz.value}>
                                    (UTC{tz.offset}) {tz.label}
                                </option>
                            ))}
                        </select>
                        <span className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                            ▾
                        </span>
                    </div>
                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-tight">
                        Current: {selectedTz.label} (UTC{selectedTz.offset}) · Used by RTO night-order detection
                    </p>
                </div>
            </div>
        </section>
    );
}
