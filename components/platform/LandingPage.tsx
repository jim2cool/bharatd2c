import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function LandingPage() {
    return (
        <div className="min-h-screen bg-black text-white selection:bg-white selection:text-black">
            {/* Navigation */}
            <nav className="fixed top-0 w-full z-50 border-b border-white/10 bg-black/50 backdrop-blur-md">
                <div className="container mx-auto px-6 h-16 flex items-center justify-between">
                    <div className="text-xl font-bold tracking-tighter">Bharat D2C</div>
                    <div className="flex items-center gap-4">
                        <Link
                            href="/login"
                            className="text-sm font-medium text-gray-300 hover:text-white transition-colors"
                        >
                            Login
                        </Link>
                        <Button asChild className="bg-white text-black hover:bg-gray-200">
                            <Link href="/login">Start Free Trial</Link>
                        </Button>
                    </div>
                </div>
            </nav>

            {/* Hero Section */}
            <section className="pt-32 pb-20 px-6">
                <div className="container mx-auto max-w-4xl text-center">
                    <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-8 leading-tight">
                        The Commerce Platform for <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500">Modern India</span>.
                    </h1>
                    <p className="text-xl text-gray-400 mb-10 max-w-2xl mx-auto leading-relaxed">
                        From checkout to logistics, Bharat D2C gives you everything you need to start, scale, and manage your business.
                    </p>
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                        <Button asChild size="lg" className="h-12 px-8 text-base bg-white text-black hover:bg-gray-200">
                            <Link href="/login">Create Your Store</Link>
                        </Button>
                        <Button asChild variant="outline" size="lg" className="h-12 px-8 text-base border-white/20 hover:bg-white/10 text-white">
                            <Link href="#features">Explore Features</Link>
                        </Button>
                    </div>
                </div>
            </section>

            {/* Features Grid */}
            <section id="features" className="py-24 bg-white/5">
                <div className="container mx-auto px-6">
                    <div className="grid md:grid-cols-3 gap-12">
                        <FeatureCard
                            title="Storefronts that Sell"
                            desc="Beautiful, high-converting themes designed for the Indian consumer. Mobile-first and blazing fast."
                        />
                        <FeatureCard
                            title="Smart Logistics"
                            desc="Automated shipping integration. Handle returns and exchanges effortlessly with our built-in OMS."
                        />
                        <FeatureCard
                            title="Analytics & Insights"
                            desc="Deep dive into your sales, traffic, and customer behavior. Make data-driven decisions."
                        />
                    </div>
                </div>
            </section>

            {/* Pricing Teaser */}
            <section className="py-24 px-6 border-t border-white/10">
                <div className="container mx-auto max-w-3xl text-center">
                    <h2 className="text-3xl font-bold mb-6">Simple, Transparent Pricing</h2>
                    <p className="text-lg text-gray-400 mb-8">
                        Start small and scale up. Plans starting at just <span className="text-white font-bold">₹199/month</span>.
                    </p>
                    <Button asChild variant="link" className="text-blue-400 hover:text-blue-300">
                        <Link href="/pricing">View all plans →</Link>
                    </Button>
                </div>
            </section>

            {/* Footer */}
            <footer className="py-12 border-t border-white/10 text-center text-gray-500 text-sm">
                <p>&copy; {new Date().getFullYear()} Bharat D2C Platform. All rights reserved.</p>
            </footer>
        </div>
    );
}

function FeatureCard({ title, desc }: { title: string; desc: string }) {
    return (
        <div className="p-8 rounded-2xl bg-white/5 border border-white/10 hover:border-white/20 transition-colors">
            <h3 className="text-xl font-bold mb-4">{title}</h3>
            <p className="text-gray-400 leading-relaxed">
                {desc}
            </p>
        </div>
    );
}
