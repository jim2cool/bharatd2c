"use client";

import { useEffect, useState } from "react";
import { supabaseBrowser } from "@/lib/supabase-browser";
import { TrendingUp, ShieldAlert, Ban } from "lucide-react";

export function RiskAnalysis({ storeId }: { storeId: string }) {
    const [stats, setStats] = useState({
        protectedRevenue: 0,
        exposureGap: 0,
        blockedFraud: 0,
        totalScored: 0
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            const { data } = await supabaseBrowser
                .from('order_interventions')
                .select('*, orders(total_amount)')
                .order('created_at', { ascending: false });

            if (data) {
                let protectedRev = 0;
                let gapRev = 0;
                let blocked = 0;

                data.forEach((item: any) => {
                    const amount = item.orders?.total_amount || 0;

                    // Protected = Action was taken (whatsapp, partial, prepaid_only)
                    if (['whatsapp_confirm', 'partial_prepaid', 'prepaid_only'].includes(item.action_taken)) {
                        protectedRev += amount;
                    }

                    // Gap = We wanted to do something but did less (or nothing/hold)
                    if (item.action_taken !== item.target_action && item.target_action !== 'none') {
                        gapRev += amount;
                    }

                    // Blocked = auto_cancel
                    if (item.action_taken === 'auto_cancel') {
                        blocked += amount;
                    }
                });

                setStats({
                    protectedRevenue: protectedRev,
                    exposureGap: gapRev,
                    blockedFraud: blocked,
                    totalScored: data.length
                });
            }
            setLoading(false);
        };

        if (storeId) fetchStats();
    }, [storeId]);

    if (loading) return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-pulse">
            {[1, 2, 3].map(i => <div key={i} className="h-40 bg-white rounded-3xl border border-slate-100" />)}
        </div>
    );

    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <StatCard
                label="Protected Revenue"
                value={`₹${stats.protectedRevenue.toLocaleString()}`}
                sub="Gated by RTO Interventions"
                icon={<TrendingUp className="w-5 h-5 text-green-600" />}
                color="green"
            />
            <StatCard
                label="Exposure Gap"
                value={`₹${stats.exposureGap.toLocaleString()}`}
                sub="Degraded protection value"
                icon={<ShieldAlert className="w-5 h-5 text-red-600" />}
                color="red"
            />
            <StatCard
                label="Fraud Blocked"
                value={`₹${stats.blockedFraud.toLocaleString()}`}
                sub="Auto-cancelled High Risk"
                icon={<Ban className="w-5 h-5 text-neutral-600" />}
                color="neutral"
            />
        </div>
    );
}

function StatCard({ label, value, sub, icon, color }: any) {
    const bg = {
        green: 'bg-green-50 border-green-100',
        red: 'bg-red-50 border-red-100',
        neutral: 'bg-slate-50 border-slate-100'
    }[color as 'green' | 'red' | 'neutral'] || 'bg-white border-slate-100';

    return (
        <div className={`p-8 rounded-[2.5rem] border-2 ${bg} shadow-sm group hover:-translate-y-1 transition-all duration-500`}>
            <div className="flex items-center justify-between mb-6">
                <div className="p-3 bg-white rounded-2xl shadow-sm group-hover:scale-110 transition-transform duration-500">
                    {icon}
                </div>
                <div className="text-[10px] font-black uppercase text-slate-400 tracking-widest">{label}</div>
            </div>
            <div className="text-4xl font-black text-slate-900 tracking-tighter">{value}</div>
            <p className="text-[10px] font-bold text-slate-500 uppercase mt-3 tracking-[0.2em]">{sub}</p>
        </div>
    );
}
