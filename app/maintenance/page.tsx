import Link from "next/link";
import { Hammer, Instagram, Twitter } from "lucide-react";

export default function MaintenancePage() {
    return (
        <div className="min-h-screen bg-white flex flex-col items-center justify-center p-6 text-center">
            <div className="max-w-md w-full space-y-8">
                {/* ICON */}
                <div className="relative mx-auto w-24 h-24 bg-neutral-50 rounded-[2.5rem] flex items-center justify-center border border-neutral-100 shadow-sm animate-pulse">
                    <Hammer className="w-10 h-10 text-black" />
                    <div className="absolute -top-1 -right-1 w-4 h-4 bg-orange-500 rounded-full border-2 border-white" />
                </div>

                {/* TEXT */}
                <div className="space-y-4">
                    <h1 className="text-4xl font-black text-neutral-900 tracking-tight italic">Be Right Back.</h1>
                    <p className="text-neutral-500 font-medium leading-relaxed">
                        Bharat D2C is currently undergoing scheduled maintenance to improve our infrastructure. We'll be back online shortly.
                    </p>
                </div>

                {/* SOCIALS/SUPPORT */}
                <div className="pt-8 border-t border-neutral-50 flex flex-col items-center gap-6">
                    <div className="flex gap-4">
                        <a href="#" className="w-10 h-10 bg-neutral-900 text-white rounded-xl flex items-center justify-center hover:scale-110 transition-transform">
                            <Twitter className="w-5 h-5" />
                        </a>
                        <a href="#" className="w-10 h-10 bg-neutral-900 text-white rounded-xl flex items-center justify-center hover:scale-110 transition-transform">
                            <Instagram className="w-5 h-5" />
                        </a>
                    </div>
                    <p className="text-[10px] text-neutral-400 font-bold uppercase tracking-widest">
                        Follow us for real-time updates
                    </p>
                </div>

                {/* LOGIN LINK (Hidden but accessible for admins) */}
                <div className="pt-12">
                    <Link href="/login" className="text-[10px] text-neutral-200 hover:text-neutral-400 font-medium transition-colors">
                        Authorized Personnel Only
                    </Link>
                </div>
            </div>
        </div>
    );
}
