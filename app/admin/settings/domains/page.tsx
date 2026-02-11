"use client";

import { useState } from "react";
import { CheckCircle, Globe, ExternalLink, Loader2, AlertCircle } from "lucide-react";
import { getActiveStoreIdClient } from "@/lib/getActiveStore.client";

export default function DomainsPage() {
    const storeId = getActiveStoreIdClient();
    const [domain, setDomain] = useState("");
    const [connecting, setConnecting] = useState(false);
    const [status, setStatus] = useState<"none" | "connected" | "pending">("none");

    // Mock checking status - in real app, fetch from DB
    // useEffect(() => { ... checkDomainStatus ... }, []);

    const handleConnect = async () => {
        if (!domain) return;
        setConnecting(true);

        // Simulate API call to get Domain Connect URL
        setTimeout(() => {
            // In reality, we'd redirect here:
            // window.location.href = `https://dcc.godaddy.com/manage/properties/dns/template/...`
            alert(`Redirecting to GoDaddy to connect ${domain}... (Integration Pending Template ID)`);
            setConnecting(false);
        }, 1500);
    };

    return (
        <div className="max-w-4xl mx-auto pt-10 pb-20 space-y-8">

            {/* HEADER */}
            <div>
                <h1 className="text-2xl font-semibold mb-2">Custom Domain</h1>
                <p className="text-gray-500">
                    Connect your existing domain to your store.
                </p>
            </div>

            {/* STATUS CARD */}
            <div className="bg-white border rounded-lg p-8 shadow-sm">
                <div className="flex items-start justify-between">
                    <div className="flex gap-4">
                        <div className={`p-3 rounded-full ${status === 'connected' ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-600'}`}>
                            <Globe className="w-6 h-6" />
                        </div>
                        <div>
                            <h2 className="font-semibold text-lg">
                                {status === 'connected' ? 'Domain Connected' : 'No Domain Connected'}
                            </h2>
                            <p className="text-gray-500 text-sm mt-1">
                                {status === 'connected'
                                    ? `Your store is live at ${domain}`
                                    : 'Your store is currently using the default subdomain.'}
                            </p>
                        </div>
                    </div>

                    {status === 'connected' && (
                        <div className="flex items-center gap-2 text-green-600 text-sm font-medium bg-green-50 px-3 py-1 rounded-full">
                            <CheckCircle className="w-4 h-4" />
                            Active
                        </div>
                    )}
                </div>

                {/* INPUT FORM */}
                {status !== 'connected' && (
                    <div className="mt-8 max-w-xl">
                        <label className="block text-sm font-medium mb-2">Domain Name</label>
                        <div className="flex gap-3">
                            <input
                                type="text"
                                placeholder="e.g. mystore.com"
                                className="flex-1 border rounded px-4 py-2"
                                value={domain}
                                onChange={(e) => setDomain(e.target.value)}
                            />
                            <button
                                onClick={handleConnect}
                                disabled={!domain || connecting}
                                className="bg-black text-white px-6 py-2 rounded font-medium disabled:opacity-50 flex items-center gap-2"
                            >
                                {connecting && <Loader2 className="w-4 h-4 animate-spin" />}
                                Connect with GoDaddy
                            </button>
                        </div>
                        <p className="text-xs text-gray-500 mt-2 flex items-center gap-1">
                            <AlertCircle className="w-3 h-3" />
                            We will redirect you to GoDaddy to login and authorize the connection.
                        </p>
                    </div>
                )}
            </div>

            {/* MANUAL SETUP INFO */}
            <div className="bg-gray-50 border rounded-lg p-6">
                <h3 className="font-medium mb-2">Manual Configuration</h3>
                <p className="text-sm text-gray-600 mb-4">
                    If you don't use GoDaddy, point your domain's DNS records to our server.
                </p>
                <div className="grid grid-cols-2 gap-4 text-sm">
                    <div className="bg-white p-3 rounded border">
                        <div className="text-gray-500 text-xs uppercase font-semibold mb-1">Type</div>
                        <div className="font-mono">A Record</div>
                    </div>
                    <div className="bg-white p-3 rounded border">
                        <div className="text-gray-500 text-xs uppercase font-semibold mb-1">Value</div>
                        <div className="font-mono">123.45.67.89</div>
                    </div>
                </div>
            </div>

        </div>
    );
}
