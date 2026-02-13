"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Banknote, CheckCircle2, Shield, Timer, Zap } from "lucide-react";

export default function LandingPage() {
    useEffect(() => {
        const elements = document.querySelectorAll("[data-reveal]");
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add("opacity-100", "translate-y-0");
                        observer.unobserve(entry.target);
                    }
                });
            },
            { threshold: 0.2 }
        );

        elements.forEach((el) => observer.observe(el));

        return () => observer.disconnect();
    }, []);

    return (
        <div className="min-h-screen bg-slate-50 text-slate-900 selection:bg-slate-900 selection:text-white">
            <div className="sticky top-0 z-50 bg-yellow-300 text-slate-900">
                <div className="mx-auto flex h-10 max-w-6xl items-center justify-center px-4 text-sm font-semibold">
                    🎉 First 100 Founders Get 3 Months Free
                </div>
            </div>

            <nav className="sticky top-10 z-40 border-b border-slate-200 bg-white/80 backdrop-blur-md">
                <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
                    <div className="text-xl font-semibold tracking-tight">Easy D2C</div>
                    <div className="flex items-center gap-4">
                        <Link
                            href="/login"
                            className="text-sm font-semibold text-slate-600 transition-colors hover:text-slate-900"
                        >
                            Login
                        </Link>
                        <Link
                            href="/signup"
                            className="rounded-full bg-slate-900 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-slate-800"
                        >
                            Start Free Trial
                        </Link>
                    </div>
                </div>
            </nav>

            <main>
                <section className="relative overflow-hidden px-6 pt-24 pb-20">
                    <div className="pointer-events-none absolute -top-40 right-0 h-72 w-72 rounded-full bg-orange-200 blur-3xl opacity-70" />
                    <div className="pointer-events-none absolute -bottom-32 left-10 h-80 w-80 rounded-full bg-teal-200 blur-3xl opacity-70" />
                    <div className="mx-auto flex max-w-5xl flex-col items-center text-center">
                        <div className="flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-xs font-semibold uppercase tracking-wide text-slate-600 shadow-sm">
                            Built for bold founders
                            <span className="rounded-full bg-orange-100 px-2 py-0.5 text-[10px] font-semibold text-orange-700">
                                New
                            </span>
                            <span className="ml-1 inline-flex h-2 w-2 items-center justify-center">
                                <span className="h-2 w-2 rounded-full bg-orange-500 animate-pulse" />
                            </span>
                        </div>
                        <h1 className="mt-8 text-4xl font-semibold tracking-tight text-slate-900 sm:text-6xl">
                            Stop Building. Start Billing.
                        </h1>
                        <p className="mt-6 text-lg text-slate-600 sm:text-xl">
                            Launch a high-converting D2C store in minutes. Built to sell. Priced to start.
                        </p>
                        <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row">
                            <Link
                                href="/signup"
                                className="rounded-full bg-orange-600 px-8 py-4 text-base font-semibold text-white shadow-lg shadow-orange-200 transition-all hover:-translate-y-0.5 hover:bg-orange-500"
                            >
                                Claim My Free Spot
                            </Link>
                            <a
                                href="#solution"
                                className="text-sm font-semibold text-slate-600 underline underline-offset-4 transition-colors hover:text-slate-900"
                            >
                                See How It Works
                            </a>
                        </div>
                        <p className="mt-4 text-sm text-slate-500">No credit card required.</p>
                    </div>
                    {/* ... (rest of the sections remain the same) */}
                    <div className="mx-auto mt-12 grid w-full max-w-5xl gap-4 sm:grid-cols-3">
                        <div className="rounded-2xl border border-slate-200 bg-white p-5 text-left shadow-sm transition-all hover:-translate-y-1 hover:shadow-lg">
                            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Average launch</p>
                            <p className="mt-3 text-2xl font-semibold text-slate-900">48 hours</p>
                            <p className="mt-2 text-sm text-slate-500">From signup to first product live.</p>
                        </div>
                        <div className="rounded-2xl border border-slate-200 bg-white p-5 text-left shadow-sm transition-all hover:-translate-y-1 hover:shadow-lg">
                            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Conversion lift</p>
                            <p className="mt-3 text-2xl font-semibold text-slate-900">+28%</p>
                            <p className="mt-2 text-sm text-slate-500">Built-in checkout optimizations.</p>
                        </div>
                        <div className="rounded-2xl border border-slate-200 bg-white p-5 text-left shadow-sm transition-all hover:-translate-y-1 hover:shadow-lg">
                            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Setup time</p>
                            <p className="mt-3 text-2xl font-semibold text-slate-900">15 mins</p>
                            <p className="mt-2 text-sm text-slate-500">Zero code, zero plugins.</p>
                        </div>
                    </div>
                </section>

                <section
                    className="px-6 pb-12 opacity-0 translate-y-4 transition-all duration-700 motion-reduce:opacity-100 motion-reduce:translate-y-0"
                    data-reveal
                >
                    <div className="mx-auto max-w-6xl rounded-3xl border border-slate-200 bg-white/70 p-8 shadow-sm backdrop-blur">
                        <p className="text-center text-xs font-semibold uppercase tracking-[0.3em] text-slate-400">
                            Trusted by founders moving fast
                        </p>
                        <div className="mt-6 grid grid-cols-2 gap-4 text-center text-sm font-semibold text-slate-500 sm:grid-cols-4 lg:grid-cols-6">
                            <div className="rounded-2xl bg-slate-50 py-3">UrbanMint</div>
                            <div className="rounded-2xl bg-slate-50 py-3">VedaSkin</div>
                            <div className="rounded-2xl bg-slate-50 py-3">LumenTea</div>
                            <div className="rounded-2xl bg-slate-50 py-3">Coastline</div>
                            <div className="rounded-2xl bg-slate-50 py-3">NovaWear</div>
                            <div className="rounded-2xl bg-slate-50 py-3">DailyDose</div>
                        </div>
                    </div>
                </section>

                <section
                    className="px-6 pb-16 opacity-0 translate-y-4 transition-all duration-700 motion-reduce:opacity-100 motion-reduce:translate-y-0"
                    data-reveal
                >
                    <div className="mx-auto max-w-6xl overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
                        <div className="border-b border-slate-200 bg-slate-50 px-6 py-3 text-xs font-semibold uppercase tracking-[0.3em] text-slate-500">
                            Live now: fast launch stack
                        </div>
                        <div className="relative overflow-hidden py-6">
                            <div
                                className="flex w-max gap-10 whitespace-nowrap px-6 text-sm font-semibold text-slate-600"
                                style={{ animation: "marquee 18s linear infinite" }}
                            >
                                <span>Conversion-first checkout</span>
                                <span>COD enabled</span>
                                <span>1-click theme publish</span>
                                <span>AI product copy</span>
                                <span>Built-in trust widgets</span>
                                <span>Smart logistics routing</span>
                                <span>Unified analytics</span>
                                <span>Automated returns</span>
                                <span className="px-4">•</span>
                                <span>Conversion-first checkout</span>
                                <span>COD enabled</span>
                                <span>1-click theme publish</span>
                                <span>AI product copy</span>
                                <span>Built-in trust widgets</span>
                                <span>Smart logistics routing</span>
                                <span>Unified analytics</span>
                                <span>Automated returns</span>
                            </div>
                        </div>
                    </div>
                </section>

                <div className="relative">
                    <svg
                        viewBox="0 0 1440 120"
                        className="h-20 w-full text-white"
                        preserveAspectRatio="none"
                    >
                        <path
                            d="M0,64L1440,0L1440,120L0,120Z"
                            fill="currentColor"
                        />
                    </svg>
                </div>

                <section
                    className="px-6 py-16 opacity-0 translate-y-4 transition-all duration-700 motion-reduce:opacity-100 motion-reduce:translate-y-0"
                    data-reveal
                >
                    <div className="mx-auto grid max-w-6xl gap-10 md:grid-cols-2">
                        <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
                            <p className="text-sm font-semibold text-slate-500">The Old Way</p>
                            <ul className="mt-6 space-y-3 text-lg text-slate-600">
                                <li className="line-through">Pick theme</li>
                                <li className="line-through">Install 12 apps</li>
                                <li className="line-through">Watch tutorials</li>
                                <li className="line-through">Spend ₹20k</li>
                            </ul>
                        </div>
                        <div className="rounded-3xl border border-slate-200 bg-gradient-to-br from-slate-900 to-slate-800 p-8 text-white shadow-lg">
                            <p className="text-sm font-semibold text-orange-200">The Problem</p>
                            <h2 className="mt-6 text-2xl font-semibold leading-tight sm:text-3xl">
                                Starting a brand shouldn’t feel like assembling IKEA blindfolded.
                            </h2>
                        </div>
                    </div>
                </section>

                <section
                    id="solution"
                    className="px-6 py-16 opacity-0 translate-y-4 transition-all duration-700 motion-reduce:opacity-100 motion-reduce:translate-y-0"
                    data-reveal
                >
                    <div className="mx-auto max-w-6xl">
                        <div className="mb-10 flex items-center justify-between">
                            <h2 className="text-3xl font-semibold text-slate-900 sm:text-4xl">
                                Everything You Actually Need.
                            </h2>
                        </div>
                        <div className="grid gap-6 md:grid-cols-6">
                            <SolutionCard
                                icon={Zap}
                                label="Built-in conversion engine"
                                className="md:col-span-3 group"
                                iconClassName="text-orange-600"
                            />
                            <SolutionCard
                                icon={Shield}
                                label="Built-in trust signals"
                                className="md:col-span-3 group"
                                iconClassName="text-teal-600"
                            />
                            <SolutionCard
                                icon={Timer}
                                label="Built-in urgency"
                                className="md:col-span-2 group"
                                iconClassName="text-slate-800"
                            />
                            <SolutionCard
                                icon={Banknote}
                                label="COD-ready from day one"
                                className="md:col-span-4 group"
                                iconClassName="text-orange-600"
                            />
                        </div>
                    </div>
                </section>

                <section
                    className="px-6 py-16 opacity-0 translate-y-4 transition-all duration-700 motion-reduce:opacity-100 motion-reduce:translate-y-0"
                    data-reveal
                >
                    <div className="mx-auto max-w-6xl rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
                        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
                            <div>
                                <p className="text-sm font-semibold uppercase tracking-wide text-slate-500">Onboarding in 3 steps</p>
                                <h3 className="mt-3 text-3xl font-semibold text-slate-900">
                                    From idea to store in a single afternoon.
                                </h3>
                            </div>
                            <Link
                                href="/login"
                                className="inline-flex items-center justify-center rounded-full border border-slate-200 px-5 py-2 text-sm font-semibold text-slate-700 transition-colors hover:border-slate-300 hover:text-slate-900"
                            >
                                See the dashboard
                            </Link>
                        </div>
                        <div className="mt-10 grid gap-6 md:grid-cols-3">
                            <TimelineCard
                                step="01"
                                title="Create your store"
                                copy="Name your brand, add your logo, and publish instantly."
                            />
                            <TimelineCard
                                step="02"
                                title="Add products"
                                copy="Bulk upload or quick add with AI-ready descriptions."
                            />
                            <TimelineCard
                                step="03"
                                title="Start selling"
                                copy="Go live with COD, automated logistics, and built-in trust."
                            />
                        </div>
                    </div>
                </section>

                <section
                    className="px-6 py-16 opacity-0 translate-y-4 transition-all duration-700 motion-reduce:opacity-100 motion-reduce:translate-y-0"
                    data-reveal
                >
                    <div className="mx-auto max-w-4xl rounded-3xl border border-orange-200 bg-white p-10 text-center shadow-lg shadow-orange-100">
                        <div className="mx-auto flex w-fit items-center gap-2 rounded-full bg-orange-100 px-4 py-2 text-xs font-semibold uppercase tracking-wide text-orange-700">
                            First 100 founders: 3 Months Free
                        </div>
                        <h3 className="mt-6 text-3xl font-bold text-slate-900 sm:text-4xl">₹199/Month. That’s It.</h3>
                        <p className="mt-3 text-lg text-slate-600">Less than a plate of Biryani.</p>
                    </div>
                </section>

                <section
                    className="px-6 py-16 opacity-0 translate-y-4 transition-all duration-700 motion-reduce:opacity-100 motion-reduce:translate-y-0"
                    data-reveal
                >
                    <div className="mx-auto max-w-5xl rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
                        <div className="grid gap-8 md:grid-cols-2">
                            <div>
                                <p className="text-sm font-semibold uppercase tracking-wide text-slate-400">Old Way</p>
                                <ul className="mt-6 space-y-4 text-lg text-slate-500">
                                    <li>Theme & Plugins</li>
                                    <li>Confusion</li>
                                </ul>
                            </div>
                            <div>
                                <p className="text-sm font-semibold uppercase tracking-wide text-slate-900">Easy D2C</p>
                                <ul className="mt-6 space-y-4 text-lg text-slate-900">
                                    <li className="flex items-center gap-3">
                                        <CheckCircle2 className="h-5 w-5 text-green-600" />
                                        One Click Publish
                                    </li>
                                    <li className="flex items-center gap-3">
                                        <CheckCircle2 className="h-5 w-5 text-green-600" />
                                        Revenue
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </section>

                <section
                    className="px-6 py-16 opacity-0 translate-y-4 transition-all duration-700 motion-reduce:opacity-100 motion-reduce:translate-y-0"
                    data-reveal
                >
                    <div className="mx-auto max-w-4xl rounded-3xl border border-slate-200 bg-gradient-to-br from-white to-slate-50 p-10 text-left shadow-sm">
                        <div className="mb-6 h-1 w-16 rounded-full bg-gradient-to-r from-orange-500 to-teal-500" />
                        <p className="text-2xl font-semibold text-slate-900 sm:text-3xl">
                            “Easy D2C let us launch in days, not weeks. We focused on storytelling and sales, not setup.”
                        </p>
                        <div className="mt-6 text-sm font-semibold text-slate-600">
                            Nisha Mehta • Founder, LumenTea
                        </div>
                    </div>
                </section>

                <section
                    className="px-6 pb-20 opacity-0 translate-y-4 transition-all duration-700 motion-reduce:opacity-100 motion-reduce:translate-y-0"
                    data-reveal
                >
                    <div className="mx-auto max-w-5xl rounded-3xl border border-slate-200 bg-slate-900 px-8 py-12 text-center text-white shadow-xl">
                        <div className="mx-auto mb-6 flex w-fit items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-xs font-semibold uppercase tracking-wide text-white/80">
                            87/100 Spots Claimed
                        </div>
                        <h3 className="text-3xl font-semibold sm:text-4xl">Be One of the First 100 Founders.</h3>
                        <p className="mt-4 text-lg text-white/70">
                            Ship your store today and lock in three free months.
                        </p>
                        <Link
                            href="/signup"
                            className="mt-8 w-full rounded-full bg-orange-600 px-8 py-4 text-base font-semibold text-white shadow-lg shadow-orange-400/30 transition-all hover:-translate-y-0.5 hover:bg-orange-500 sm:w-auto"
                        >
                            Start Selling
                        </Link>
                    </div>
                </section>
            </main>
            <style jsx>{`
                @keyframes marquee {
                    0% {
                        transform: translateX(0%);
                    }
                    100% {
                        transform: translateX(-50%);
                    }
                }
            `}</style>
        </div>
    );
}

function SolutionCard({
    icon: Icon,
    label,
    className,
    iconClassName,
}: {
    icon: typeof Zap;
    label: string;
    className?: string;
    iconClassName?: string;
}) {
    return (
        <div
            className={`rounded-3xl border border-slate-200 bg-white p-6 shadow-sm transition-all hover:-translate-y-1 hover:border-slate-300 hover:shadow-lg ${className || ""
                }`}
        >
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-100 transition-colors group-hover:bg-slate-900">
                <Icon className={`h-6 w-6 transition-colors group-hover:text-white ${iconClassName || "text-slate-900"}`} />
            </div>
            <p className="mt-5 text-base font-semibold text-slate-900">{label}</p>
        </div>
    );
}

function TimelineCard({
    step,
    title,
    copy,
}: {
    step: string;
    title: string;
    copy: string;
}) {
    return (
        <div className="rounded-3xl border border-slate-200 bg-slate-50/80 p-6 transition-all hover:-translate-y-1 hover:bg-white hover:shadow-lg">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">{step}</p>
            <h4 className="mt-4 text-xl font-semibold text-slate-900">{title}</h4>
            <p className="mt-2 text-sm text-slate-600">{copy}</p>
        </div>
    );
}

