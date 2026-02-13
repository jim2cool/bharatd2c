import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  Zap,
  Shield,
  Timer,
  Banknote,
  CheckCircle2,
} from "lucide-react";

export default function EasyD2CLanding() {
  const [isSubmitted, setIsSubmitted] = useState(false);

  if (isSubmitted) {
    return <ThankYouPage />;
  }

  return (
    <div className="bg-zinc-950 text-white min-h-screen font-sans">
      {/* TOP BAR */}
      <div className="sticky top-0 z-50 bg-yellow-400 text-black text-center py-2 font-semibold text-sm">
        🎉 First 100 Founders Get 3 Months Free
      </div>

      {/* HERO */}
      <section className="px-6 py-24 text-center max-w-5xl mx-auto">
        <h1 className="text-5xl md:text-6xl font-bold tracking-tight mb-6">
          Stop Building. Start Billing.
        </h1>

        <p className="text-xl text-zinc-400 mb-10">
          Launch a high-converting D2C store in minutes. Built to sell. Priced
          to start.
        </p>

        <div className="flex flex-col md:flex-row gap-4 justify-center mb-4">
          <button
            onClick={() => setIsSubmitted(true)}
            className="bg-orange-600 hover:bg-orange-500 transition px-8 py-4 rounded-full font-semibold"
          >
            Claim My Free Spot
          </button>

          <button className="text-zinc-400 underline hover:text-white">
            See How It Works
          </button>
        </div>

        <p className="text-sm text-zinc-500">No credit card required.</p>
      </section>

      {/* PROBLEM */}
      <section className="px-6 py-20 max-w-6xl mx-auto grid md:grid-cols-2 gap-12">
        <div>
          <h3 className="text-2xl font-semibold mb-6">The Old Way</h3>
          <ul className="space-y-4 text-zinc-400">
            {[
              "Pick theme",
              "Install 12 apps",
              "Watch tutorials",
              "Spend ₹20k",
            ].map((item) => (
              <li key={item} className="line-through">
                {item}
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h2 className="text-3xl font-bold">
            Starting a brand shouldn’t feel like assembling IKEA blindfolded.
          </h2>
        </div>
      </section>

      {/* SOLUTION GRID */}
      <section className="px-6 py-20 max-w-6xl mx-auto">
        <h2 className="text-3xl font-bold mb-12 text-center">
          Everything You Actually Need.
        </h2>

        <div className="grid md:grid-cols-4 gap-6">
          {[
            { icon: Zap, text: "Built-in conversion engine" },
            { icon: Shield, text: "Built-in trust signals" },
            { icon: Timer, text: "Built-in urgency" },
            { icon: Banknote, text: "COD-ready from day one" },
          ].map(({ icon: Icon, text }) => (
            <div
              key={text}
              className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 text-center"
            >
              <Icon className="mx-auto mb-4 text-orange-500" size={32} />
              <p className="text-zinc-300">{text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* PRICING */}
      <section className="px-6 py-20 flex justify-center">
        <div className="bg-white text-black rounded-xl p-10 text-center max-w-md">
          <h3 className="text-3xl font-bold mb-3">₹199/Month. That’s It.</h3>
          <p className="text-zinc-600 mb-4">Less than a plate of Biryani.</p>
          <span className="bg-yellow-400 px-4 py-2 rounded-full text-sm font-semibold">
            First 100 founders: 3 Months Free
          </span>
        </div>
      </section>

      {/* COMPARISON */}
      <section className="px-6 py-20 max-w-5xl mx-auto">
        <div className="grid grid-cols-2 text-center gap-6">
          <div className="opacity-50">
            <h4 className="font-bold mb-4">Old Way</h4>
            <ul className="space-y-3 text-zinc-400">
              <li>Theme & Plugins</li>
              <li>Confusion</li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold mb-4 text-green-500">Easy D2C</h4>
            <ul className="space-y-3">
              <li className="flex justify-center gap-2">
                <CheckCircle2 className="text-green-500" /> One Click Publish
              </li>
              <li className="flex justify-center gap-2">
                <CheckCircle2 className="text-green-500" /> Revenue
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* FOUNDER ENERGY */}
      <section className="px-6 py-16 text-center max-w-3xl mx-auto">
        <p className="text-xl text-zinc-300">
          Your Hustle Deserves Better Tools. You don't need a dev friend. You
          need to start.
        </p>
      </section>

      {/* FOOTER CTA */}
      <section className="px-6 py-24 text-center">
        <h2 className="text-3xl font-bold mb-4">
          Be One of the First 100 Founders.
        </h2>
        <p className="text-zinc-400 mb-6">87/100 Spots Claimed.</p>

        <button
          onClick={() => setIsSubmitted(true)}
          className="bg-orange-600 hover:bg-orange-500 transition w-full md:w-auto px-12 py-5 rounded-full text-lg font-semibold"
        >
          Start Selling
        </button>
      </section>
    </div>
  );
}

/* ================= THANK YOU PAGE ================= */

function ThankYouPage() {
  return (
    <div className="bg-zinc-950 text-white min-h-screen flex items-center justify-center px-6">
      <div className="text-center max-w-xl">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 120 }}
          className="flex justify-center mb-6"
        >
          <CheckCircle2 size={100} className="text-green-500" />
        </motion.div>

        <h1 className="text-4xl font-bold mb-4">Boom. You're In.</h1>

        <p className="text-zinc-400 mb-10">
          Welcome to the First 100. Your 3 months of free access are active.
        </p>

        <div className="bg-zinc-900 border border-green-500 rounded-xl p-8">
          <p className="mb-6">Step 1: Check your email for login details.</p>

          <button className="bg-green-600 text-black font-bold px-8 py-4 rounded-full">
            Enter Dashboard
          </button>
        </div>
      </div>
    </div>
  );
}
