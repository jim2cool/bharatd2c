"use client";

import { useEffect, useState } from "react";
import { supabaseBrowser } from "@/lib/supabase-browser";
import { Check, X, AlertCircle, ExternalLink, Loader2 } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";

export function HoldQueue({ storeId }: { storeId: string }) {
    const [orders, setOrders] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [actionId, setActionId] = useState<string | null>(null);

    const fetchOrders = async () => {
        const { data } = await supabaseBrowser
            .from('orders')
            .select('*')
            .eq('store_id', storeId)
            .eq('status', 'held')
            .order('created_at', { ascending: false });

        setOrders(data || []);
        setLoading(false);
    };

    useEffect(() => {
        if (storeId) fetchOrders();
    }, [storeId]);

    const handleAction = async (id: string, newStatus: string) => {
        setActionId(id);
        const { error } = await supabaseBrowser
            .from('orders')
            .update({ status: newStatus })
            .eq('id', id);

        if (error) {
            toast.error("Failed to update order status");
        } else {
            toast.success(`Order ${newStatus === 'confirmed' ? 'Approved' : 'Cancelled'}`);
            fetchOrders();
        }
        setActionId(null);
    };

    if (loading) return <div className="h-64 bg-white rounded-3xl border border-slate-100 animate-pulse" />;

    if (orders.length === 0) return (
        <div className="bg-white border-2 border-dashed border-slate-100 rounded-[3rem] p-20 flex flex-col items-center justify-center text-center">
            <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mb-4">
                <Check className="w-8 h-8 text-slate-300" />
            </div>
            <h3 className="text-sm font-black text-slate-900 uppercase tracking-tighter">Queue Clear</h3>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">No orders currently require manual verification.</p>
        </div>
    );

    return (
        <div className="bg-white border-2 border-slate-100 rounded-[3rem] overflow-hidden shadow-sm">
            <div className="px-8 py-6 border-b border-slate-50 flex items-center justify-between bg-slate-50/50">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-100">
                        <AlertCircle className="w-5 h-5 text-white" />
                    </div>
                    <div>
                        <h3 className="text-sm font-black text-slate-900 uppercase tracking-tighter">Verification Queue</h3>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">{orders.length} orders pending review</p>
                    </div>
                </div>
            </div>

            <div className="overflow-x-auto">
                <table className="w-full text-left">
                    <thead>
                        <tr className="border-b border-slate-50">
                            <th className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Order</th>
                            <th className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Customer</th>
                            <th className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Amount</th>
                            <th className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {orders.map((order) => (
                            <tr key={order.id} className="border-b last:border-0 border-slate-50 hover:bg-slate-50/30 transition-colors group">
                                <td className="px-8 py-5">
                                    <Link href={`/admin/orders/${order.id}`} className="text-xs font-black text-blue-600 hover:underline flex items-center gap-1">
                                        #{order.order_number}
                                        <ExternalLink className="w-3 h-3" />
                                    </Link>
                                    <div className="text-[9px] font-bold text-slate-400 uppercase mt-1">
                                        {new Date(order.created_at).toLocaleDateString()}
                                    </div>
                                </td>
                                <td className="px-8 py-5">
                                    <div className="text-xs font-bold text-slate-900">{order.customer_name || 'Guest User'}</div>
                                    <div className="text-[9px] font-bold text-slate-400 uppercase mt-1">{order.customer_phone}</div>
                                </td>
                                <td className="px-8 py-5">
                                    <div className="text-xs font-black text-slate-900">₹{order.total_amount?.toLocaleString()}</div>
                                </td>
                                <td className="px-8 py-5">
                                    <div className="flex items-center justify-end gap-2 text-right">
                                        <button
                                            onClick={() => handleAction(order.id, 'confirmed')}
                                            disabled={actionId === order.id}
                                            className="px-4 py-2 bg-green-50 text-green-600 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-green-600 hover:text-white transition-all flex items-center gap-2"
                                        >
                                            {actionId === order.id ? <Loader2 className="w-3 h-3 animate-spin" /> : <Check className="w-3 h-3" />}
                                            Approve
                                        </button>
                                        <button
                                            onClick={() => handleAction(order.id, 'cancelled')}
                                            disabled={actionId === order.id}
                                            className="px-4 py-2 bg-red-50 text-red-600 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-red-600 hover:text-white transition-all flex items-center gap-2"
                                        >
                                            {actionId === order.id ? <Loader2 className="w-3 h-3 animate-spin" /> : <X className="w-3 h-3" />}
                                            Reject
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
