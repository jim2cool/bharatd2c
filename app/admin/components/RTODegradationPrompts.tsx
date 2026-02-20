'use client';

import { useEffect, useState } from 'react';
import { supabaseBrowser } from '@/lib/supabase-browser';
import { AlertCircle, ArrowRight, Wallet, MessageSquare, Zap } from 'lucide-react';
import Link from 'next/link';

export function RTODegradationPrompts({ storeId }: { storeId: string }) {
    const [interventions, setInterventions] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchDegraded = async () => {
            const { data } = await supabaseBrowser
                .from('order_interventions')
                .select(`
          *,
          orders ( order_number, total_amount )
        `)
                .neq('action_taken', 'target_action')
                .order('created_at', { ascending: false })
                .limit(5);

            setInterventions(data || []);
            setLoading(false);
        };

        if (storeId) fetchDegraded();
    }, [storeId]);

    if (loading || interventions.length === 0) return null;

    return (
        <div className="space-y-4">
            <div className="flex items-center gap-2 mb-2">
                <Zap className="w-4 h-4 text-blue-600" />
                <h3 className="text-sm font-black text-neutral-900 uppercase tracking-tighter">RTO Protection Gaps</h3>
            </div>

            {interventions.map((item) => {
                const isMissingWhatsapp = item.config_state === 'STATE_B';
                const isMissingGateway = item.config_state === 'STATE_C';
                const isMissingBoth = item.config_state === 'STATE_D';
                const orderNum = item.orders?.order_number || 'Unknown';
                const amount = item.orders?.total_amount || 0;

                return (
                    <div key={item.id} className="bg-white border-2 border-slate-100 rounded-3xl p-6 shadow-sm hover:border-blue-100 transition-all group relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                            {isMissingWhatsapp ? <MessageSquare className="w-16 h-16" /> : <Wallet className="w-16 h-16" />}
                        </div>

                        <div className="relative z-10 space-y-3">
                            <div className="flex items-center gap-2">
                                <span className="px-2 py-0.5 bg-slate-100 text-[9px] font-black rounded uppercase text-slate-500">Order #{orderNum}</span>
                                <span className="px-2 py-0.5 bg-red-50 text-[9px] font-black rounded uppercase text-red-600">Intervention Degraded</span>
                            </div>

                            <p className="text-xs font-bold text-neutral-700 leading-relaxed">
                                {isMissingWhatsapp && (
                                    <>Order was medium risk but we couldn't send a confirmation because WhatsApp isn't connected. Based on platform data, 61% of buyers confirm delivery in this band.</>
                                )}
                                {isMissingGateway && item.target_action === 'prepaid_only' && (
                                    <>Order was high risk so we blocked COD. Without a payment gateway, we couldn't offer a prepaid alternative—the sale was lost entirely.</>
                                )}
                                {isMissingBoth && item.action_taken === 'hold_for_review' && (
                                    <>This order is held for manual review. With WhatsApp confirmation this would have been automatically verified. With a gateway, we could have offered prepaid.</>
                                )}
                                {!isMissingWhatsapp && !isMissingGateway && !isMissingBoth && (
                                    <>Capability mismatch: Target was {item.target_action} but executed {item.action_taken}.</>
                                )}
                            </p>

                            <div className="flex items-center gap-4 pt-2">
                                {isMissingWhatsapp && (
                                    <Link href="/admin/settings/whatsapp" className="text-[10px] font-black text-blue-600 uppercase tracking-widest flex items-center gap-1 hover:gap-2 transition-all">
                                        Connect WhatsApp <ArrowRight className="w-3 h-3" />
                                    </Link>
                                )}
                                {isMissingGateway && (
                                    <Link href="/admin/settings/general" className="text-[10px] font-black text-blue-600 uppercase tracking-widest flex items-center gap-1 hover:gap-2 transition-all">
                                        Setup Gateway <ArrowRight className="w-3 h-3" />
                                    </Link>
                                )}
                                {isMissingBoth && (
                                    <div className="flex gap-4">
                                        <Link href="/admin/settings/whatsapp" className="text-[10px] font-black text-blue-600 uppercase tracking-widest flex items-center gap-1">WS Setup</Link>
                                        <Link href="/admin/settings/general" className="text-[10px] font-black text-blue-600 uppercase tracking-widest flex items-center gap-1">Payment Setup</Link>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                );
            })}
        </div>
    );
}
