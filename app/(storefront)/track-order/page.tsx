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
        <div className="min-h-screen bg-[var(--bg-primary)]">
            <header className="bg-[var(--bg-primary)] border-b border-[var(--border)] py-6 sticky top-0 z-50">
                <div className="container max-w-2xl px-6 flex items-center justify-between mx-auto">
                    <Link href="/" className="text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors">
                        <ArrowLeft className="w-5 h-5" />
                    </Link>
                    <div className="text-xl font-black text-[var(--text-primary)] tracking-tighter uppercase italic">Track Order</div>
                    <div className="w-5" /> {/* Spacer */}
                </div>
            </header>

            <main className="container max-w-2xl px-6 mx-auto py-12">
                {step === "phone" && (
                    <div className="bg-[var(--bg-secondary)] p-10 rounded-[var(--radius-card)] border border-[var(--border)] shadow-sm space-y-8 animate-in fade-in slide-in-from-bottom-4">
                        <div className="text-center space-y-2">
                            <div className="w-16 h-16 rounded-[var(--radius-card)] bg-[var(--primary)] text-[var(--cta-text)] flex items-center justify-center mx-auto shadow-xl mb-6">
                                <Search className="w-8 h-8" />
                            </div>
                            <h1 className="text-2xl font-black text-[var(--text-primary)] tracking-tight uppercase italic">View Your Orders</h1>
                            <p className="text-xs text-[var(--text-secondary)] font-bold uppercase tracking-widest opacity-70">Enter your mobile number to get access</p>
                        </div>

                        <div className="space-y-6">
                            <div className="space-y-2">
                                <Label className="text-[10px] uppercase font-bold text-[var(--text-secondary)] tracking-wider">Mobile Number</Label>
                                <div className="relative">
                                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm font-bold text-[var(--text-secondary)]">+91</span>
                                    <Input
                                        placeholder="00000 00000"
                                        value={phone}
                                        onChange={(e) => setPhone(e.target.value.replace(/\D/g, ''))}
                                        className="h-14 pl-12 rounded-[var(--radius-button)] bg-[var(--bg-primary)] border-[var(--border)] focus:ring-[var(--primary)] transition-all font-bold"
                                    />
                                </div>
                            </div>
                            {error && <p className="text-[10px] text-[var(--error)] font-black uppercase tracking-widest text-center">{error}</p>}
                            <Button
                                onClick={sendOtp}
                                disabled={loading || phone.length !== 10}
                                className="w-full h-14 bg-[var(--primary)] text-[var(--cta-text)] rounded-[var(--radius-button)] font-black uppercase tracking-widest shadow-lg border-none"
                            >
                                {loading ? "Sending..." : "Send SMS Code"}
                            </Button>
                        </div>
                    </div>
                )}

                {step === "otp" && (
                    <div className="bg-[var(--bg-secondary)] p-10 rounded-[var(--radius-card)] border border-[var(--border)] shadow-sm space-y-8 animate-in fade-in slide-in-from-bottom-4">
                        <div className="text-center space-y-2">
                            <div className="w-16 h-16 rounded-[var(--radius-card)] bg-[var(--primary)] text-[var(--cta-text)] flex items-center justify-center mx-auto shadow-xl mb-6">
                                <Lock className="w-8 h-8" />
                            </div>
                            <h1 className="text-2xl font-black text-[var(--text-primary)] tracking-tight uppercase italic">Enter OTP Code</h1>
                            <p className="text-xs text-[var(--text-secondary)] font-bold uppercase tracking-widest opacity-70">Sent to +91 {phone}</p>
                        </div>

                        <div className="space-y-6">
                            <div className="space-y-2 text-center">
                                <Input
                                    placeholder="• • • •"
                                    maxLength={4}
                                    value={otp}
                                    onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                                    className="h-16 text-center text-3xl font-black tracking-[0.5em] rounded-[var(--radius-button)] bg-[var(--bg-primary)] border-[var(--border)] focus:ring-[var(--primary)] transition-all"
                                />
                            </div>
                            {error && <p className="text-[10px] text-[var(--error)] font-black uppercase tracking-widest text-center">{error}</p>}
                            <Button
                                onClick={verifyOtp}
                                disabled={loading || otp.length !== 4}
                                className="w-full h-14 bg-[var(--primary)] text-[var(--cta-text)] rounded-[var(--radius-button)] font-black uppercase tracking-widest shadow-lg border-none"
                            >
                                {loading ? "Verifying..." : "View Orders"}
                            </Button>
                            <button onClick={() => setStep("phone")} className="w-full text-[10px] text-[var(--text-secondary)] font-black uppercase tracking-widest hover:text-[var(--text-primary)]">Change Phone Number</button>
                        </div>
                    </div>
                )}

                {step === "orders" && (
                    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4">
                        <div className="flex items-center justify-between mb-8">
                            <div>
                                <h1 className="text-2xl font-black text-[var(--text-primary)] tracking-tight uppercase italic">Your History</h1>
                                <p className="text-xs text-[var(--text-secondary)] font-bold uppercase tracking-widest opacity-70">{orders.length} orders found</p>
                            </div>
                            <Button onClick={() => setStep("phone")} variant="outline" size="sm" className="rounded-[var(--radius-button)] font-bold uppercase tracking-widest text-[10px] border-[var(--border)] text-[var(--text-secondary)] hover:bg-[var(--bg-secondary)]">Logout</Button>
                        </div>

                        {orders.length === 0 ? (
                            <div className="bg-[var(--bg-secondary)] p-12 rounded-[var(--radius-card)] border border-[var(--border)] text-center space-y-4">
                                <div className="w-16 h-16 rounded-full bg-[var(--bg-primary)] flex items-center justify-center mx-auto">
                                    <Package className="w-6 h-6 text-[var(--text-secondary)] opacity-30" />
                                </div>
                                <p className="text-sm font-bold text-[var(--text-secondary)]">No orders found for this number.</p>
                                <Link href="/products">
                                    <Button className="mt-4 rounded-[var(--radius-button)] font-black uppercase tracking-widest text-xs bg-[var(--primary)] text-[var(--cta-text)] border-none">Start Shopping</Button>
                                </Link>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {orders.map((order) => (
                                    <div key={order.id} className="bg-[var(--bg-secondary)] p-8 rounded-[var(--radius-card)] border border-[var(--border)] shadow-sm space-y-6">
                                        <div className="flex justify-between items-start">
                                            <div>
                                                <p className="text-[10px] font-black text-[var(--text-secondary)] uppercase tracking-widest opacity-60 mb-1">Order ID</p>
                                                <p className="text-sm font-black text-[var(--text-primary)]">#{order.id.slice(0, 8).toUpperCase()}</p>
                                            </div>
                                            <div className="flex flex-col items-end">
                                                <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest ${order.order_status === 'delivered' ? 'bg-green-100 text-green-700' :
                                                    order.order_status === 'shipped' ? 'bg-blue-100 text-primary' :
                                                        'bg-amber-100 text-amber-700'
                                                    }`}>
                                                    {order.order_status || 'Pending'}
                                                </span>
                                                <p className="text-[10px] text-[var(--text-secondary)] font-bold mt-1 opacity-60">{new Date(order.created_at).toLocaleDateString()}</p>
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-2 gap-4 py-4 border-y border-[var(--border)] opacity-80">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-[var(--radius-button)] bg-[var(--bg-primary)] flex items-center justify-center shrink-0 border border-[var(--border)]">
                                                    <Truck className="w-5 h-5 text-[var(--text-secondary)] opacity-50" />
                                                </div>
                                                <div>
                                                    <p className="text-[9px] font-black text-[var(--text-secondary)] uppercase tracking-widest opacity-60">Method</p>
                                                    <p className="text-xs font-bold text-[var(--text-primary)] uppercase">{order.payment_method}</p>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-xl bg-[var(--bg-primary)] flex items-center justify-center shrink-0 border border-[var(--border)]">
                                                    <CheckCircle2 className="w-5 h-5 text-[var(--text-secondary)] opacity-50" />
                                                </div>
                                                <div>
                                                    <p className="text-[9px] font-black text-[var(--text-secondary)] uppercase tracking-widest opacity-60">Payment</p>
                                                    <p className="text-xs font-bold text-[var(--text-primary)] uppercase">{order.payment_status}</p>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-2">
                                                <MapPin className="w-4 h-4 text-[var(--text-secondary)] opacity-30" />
                                                <p className="text-xs font-bold text-[var(--text-secondary)] opacity-70">{order.city}, {order.state}</p>
                                            </div>
                                            <p className="text-xl font-black text-[var(--text-primary)] tracking-tighter">₹{order.total_amount.toLocaleString()}</p>
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
