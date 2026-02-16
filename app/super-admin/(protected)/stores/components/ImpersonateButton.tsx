"use client";

import { useState } from "react";
import { UserCog, Loader2 } from "lucide-react";
import { toast } from "sonner";

interface ImpersonateButtonProps {
    userId: string;
    storeSlug: string;
}

export default function ImpersonateButton({ userId, storeSlug }: ImpersonateButtonProps) {
    const [loading, setLoading] = useState(false);

    const handleImpersonate = async () => {
        setLoading(true);
        try {
            const res = await fetch("/api/super-admin/impersonate", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ userId, storeSlug }),
            });

            const data = await res.json();

            if (data.success) {
                toast.success("Entering impersonation mode...");
                // Redirect to the store admin domain
                window.location.href = data.redirect;
            } else {
                toast.error(data.error || "Failed to impersonate user");
            }
        } catch (err) {
            toast.error("Network error during impersonation");
        } finally {
            setLoading(false);
        }
    };

    return (
        <button
            onClick={handleImpersonate}
            disabled={loading}
            className="inline-flex items-center gap-1.5 text-neutral-400 hover:text-black transition-colors font-medium text-xs border border-neutral-100 px-2.5 py-1 rounded-lg hover:bg-neutral-50"
            title="Impersonate Store Owner"
        >
            {loading ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
            ) : (
                <UserCog className="w-3.5 h-3.5" />
            )}
            {loading ? "..." : "Impersonate"}
        </button>
    );
}
