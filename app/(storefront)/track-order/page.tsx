"use client";

import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Lock, ArrowLeft, Search, CheckCircle2, Package, MapPin, Truck } from "lucide-react";
import Link from "next/link";
import { supabaseBrowser } from "@/lib/supabase-browser";

export default function TrackOrderPage() {
    const [phone, setPhone] = useState("");
    const [step, setStep] = useState<"phone" | "otp" | "orders">("phone");
    const [otp, setOtp] = useState("");
    const [loading, setLoading] = useState(false);
    const [orders, setOrders] = useState<any[]>([]);
    const [error, setError] = useState("");

    const sendOtp = async () => {
        if (!/^[6-9]\d{9}$/.test(phone)) {
            setError("Please enter a valid 10-digit mobile number");
            return;
        }
        setLoading(true);
        setError("");
        try {
            const res = await fetch("/api/otp/send", {
                method: "POST",
                body: JSON.stringify({ phone, type: 'track_order' }),
            });
            const data = await res.json();
            if (data.success) {
                setStep("otp");
            } else {
                setError("Failed to send code. Please try again.");
            }
        } catch (err) {
            setError("Service unavailable.");
        } finally {
            setLoading(false);
        }
    };

    const verifyOtp = async () => {
        if (otp.length !== 4) return;
        setLoading(true);
        setError("");
        try {
            const res = await fetch("/api/otp/verify", {
                method: "POST",
                body: JSON.stringify({ phone, otp }),
            });
            const data = await res.json();
            if (data.success) {
                fetchOrders();
            } else {
                setError("Invalid verification code");
            }
        } catch (err) {
            setError("Verification failed.");
        } finally {
            setLoading(false);
        }
    };

    const fetchOrders = async () => {
        setLoading(true);
        const { data, error } = await supabaseBrowser
            .from("orders")
            .select("*")
            .eq("customer_phone", phone)
            .order("created_at", { ascending: false });

        if (error) {
            setError("Failed to load orders");
        } else {
            setOrders(data || []);
            setStep("orders");
        }
        setLoading(false);
    };

    return (
        <div className="min-h-screen bg-[#fafafa]">
            <header className="bg-white border-b border-neutral-100 py-6 sticky top-0 z-50">
                <div className="container max-w-2xl px-6 flex items-center justify-between mx-auto">
                    <Link href="/" className="text-neutral-400 hover:text-neutral-900 transition-colors">
                        <ArrowLeft className="w-5 h-5" />
                    </Link>
                    <div className="text-xl font-black text-neutral-900 tracking-tighter">Track Order</div>
                    <div className="w-5" /> {/* Spacer */}
                </div>
            </header>

            <main className="container max-w-2xl px-6 mx-auto py-12">
                {step === "phone" && (
                    <div className="bg-white p-10 rounded-[2.5rem] border border-neutral-100 shadow-sm space-y-8 animate-in fade-in slide-in-from-bottom-4">
                        <div className="text-center space-y-2">
                            <div className="w-16 h-16 rounded-3xl bg-neutral-900 text-white flex items-center justify-center mx-auto shadow-xl mb-6">
                                <Search className="w-8 h-8" />
                            </div>
                            <h1 className="text-2xl font-black text-neutral-900 tracking-tight">View Your Orders</h1>
                            <p className="text-xs text-neutral-400 font-bold uppercase tracking-widest">Enter your mobile number to get access</p>
                        </div>

                        <div className="space-y-6">
                            <div className="space-y-2">
                                <Label className="text-[10px] uppercase font-bold text-neutral-500 tracking-wider">Mobile Number</Label>
                                <div className="relative">
                                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm font-bold text-neutral-400">+91</span>
                                    <Input
                                        placeholder="00000 00000"
                                        value={phone}
                                        onChange={(e) => setPhone(e.target.value.replace(/\D/g, ''))}
                                        className="h-14 pl-12 rounded-2xl bg-neutral-50 border-transparent focus:bg-white focus:ring-neutral-900 transition-all"
                                    />
                                </div>
                            </div>
                            {error && <p className="text-[10px] text-red-600 font-black uppercase tracking-widest text-center">{error}</p>}
                            <Button
                                onClick={sendOtp}
                                disabled={loading || phone.length !== 10}
                                className="w-full h-14 bg-neutral-900 text-white rounded-2xl font-black uppercase tracking-widest shadow-lg"
                            >
                                {loading ? "Sending..." : "Send SMS Code"}
                            </Button>
                        </div>
                    </div>
                )}

                {step === "otp" && (
                    <div className="bg-white p-10 rounded-[2.5rem] border border-neutral-100 shadow-sm space-y-8 animate-in fade-in slide-in-from-bottom-4">
                        <div className="text-center space-y-2">
                            <div className="w-16 h-16 rounded-3xl bg-neutral-900 text-white flex items-center justify-center mx-auto shadow-xl mb-6">
                                <Lock className="w-8 h-8" />
                            </div>
                            <h1 className="text-2xl font-black text-neutral-900 tracking-tight">Enter OTP Code</h1>
                            <p className="text-xs text-neutral-400 font-bold uppercase tracking-widest">Sent to +91 {phone}</p>
                        </div>

                        <div className="space-y-6">
                            <div className="space-y-2 text-center">
                                <Input
                                    placeholder="• • • •"
                                    maxLength={4}
                                    value={otp}
                                    onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                                    className="h-16 text-center text-3xl font-black tracking-[0.5em] rounded-2xl bg-neutral-50 border-transparent focus:bg-white focus:ring-neutral-900 transition-all"
                                />
                            </div>
                            {error && <p className="text-[10px] text-red-600 font-black uppercase tracking-widest text-center">{error}</p>}
                            <Button
                                onClick={verifyOtp}
                                disabled={loading || otp.length !== 4}
                                className="w-full h-14 bg-neutral-900 text-white rounded-2xl font-black uppercase tracking-widest shadow-lg"
                            >
                                {loading ? "Verifying..." : "View Orders"}
                            </Button>
                            <button onClick={() => setStep("phone")} className="w-full text-[10px] text-neutral-400 font-black uppercase tracking-widest hover:text-neutral-900">Change Phone Number</button>
                        </div>
                    </div>
                )}

                {step === "orders" && (
                    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4">
                        <div className="flex items-center justify-between mb-8">
                            <div>
                                <h1 className="text-2xl font-black text-neutral-900 tracking-tight">Your History</h1>
                                <p className="text-xs text-neutral-400 font-bold uppercase tracking-widest">{orders.length} orders found</p>
                            </div>
                            <Button onClick={() => setStep("phone")} variant="outline" size="sm" className="rounded-xl font-bold uppercase tracking-widest text-[10px]">Logout</Button>
                        </div>

                        {orders.length === 0 ? (
                            <div className="bg-white p-12 rounded-[2.5rem] border border-neutral-100 text-center space-y-4">
                                <div className="w-16 h-16 rounded-full bg-neutral-50 flex items-center justify-center mx-auto">
                                    <Package className="w-6 h-6 text-neutral-300" />
                                </div>
                                <p className="text-sm font-bold text-neutral-500">No orders found for this number.</p>
                                <Link href="/products">
                                    <Button className="mt-4 rounded-xl font-black uppercase tracking-widest text-xs bg-neutral-900">Start Shopping</Button>
                                </Link>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {orders.map((order) => (
                                    <div key={order.id} className="bg-white p-8 rounded-[2.5rem] border border-neutral-100 shadow-sm space-y-6">
                                        <div className="flex justify-between items-start">
                                            <div>
                                                <p className="text-[10px] font-black text-neutral-400 uppercase tracking-widest mb-1">Order ID</p>
                                                <p className="text-sm font-black text-neutral-900">#{order.id.slice(0, 8).toUpperCase()}</p>
                                            </div>
                                            <div className="flex flex-col items-end">
                                                <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest ${order.order_status === 'delivered' ? 'bg-green-50 text-green-600' :
                                                        order.order_status === 'shipped' ? 'bg-blue-50 text-blue-600' :
                                                            'bg-amber-50 text-amber-600'
                                                    }`}>
                                                    {order.order_status || 'Pending'}
                                                </span>
                                                <p className="text-[10px] text-neutral-400 font-bold mt-1">{new Date(order.created_at).toLocaleDateString()}</p>
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-2 gap-4 py-4 border-y border-neutral-50">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-xl bg-neutral-50 flex items-center justify-center shrink-0">
                                                    <Truck className="w-5 h-5 text-neutral-400" />
                                                </div>
                                                <div>
                                                    <p className="text-[9px] font-black text-neutral-400 uppercase tracking-widest">Method</p>
                                                    <p className="text-xs font-bold text-neutral-900 uppercase">{order.payment_method}</p>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-xl bg-neutral-50 flex items-center justify-center shrink-0">
                                                    <CheckCircle2 className="w-5 h-5 text-neutral-400" />
                                                </div>
                                                <div>
                                                    <p className="text-[9px] font-black text-neutral-400 uppercase tracking-widest">Payment</p>
                                                    <p className="text-xs font-bold text-neutral-900 uppercase">{order.payment_status}</p>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="flex justify-between items-center">
                                            <div className="flex items-center gap-2">
                                                <MapPin className="w-4 h-4 text-neutral-300" />
                                                <p className="text-xs font-bold text-neutral-500">{order.city}, {order.state}</p>
                                            </div>
                                            <p className="text-xl font-black text-neutral-900 tracking-tighter">₹{order.total_amount.toLocaleString()}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                )}
            </main>
        </div>
    );
}
