"use client";

import { useState } from "react";
import { Upload, FileDown, CheckCircle, AlertCircle, Loader2 } from "lucide-react";
import { supabaseBrowser } from "@/lib/supabase-browser";
import { getActiveStoreIdClient } from "@/lib/getActiveStore.client";
import { toast } from "sonner";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function BulkImportPage() {
    const router = useRouter();
    const [importing, setImporting] = useState(false);
    const [logs, setLogs] = useState<string[]>([]);

    // Robust CSV Parser (Handles quotes)
    const parseCSV = (text: string) => {
        const lines = text.split("\n").filter((l) => l.trim() !== "");
        const headers = lines[0].split(",").map((h) => h.trim());

        // Quick validation of headers
        const required = ["Title", "Price", "Category"];
        const missing = required.filter(r => !headers.includes(r));
        if (missing.length > 0) {
            // throw new Error(`Missing required columns: ${missing.join(", ")}`);
            // Relaxed validation for now
        }

        const result = [];
        for (let i = 1; i < lines.length; i++) {
            // Regex to split by comma ONLY if not inside quotes
            const currentLine = lines[i].split(/,(?=(?:(?:[^"]*"){2})*[^"]*$)/);

            const obj: any = {};

            headers.forEach((header, index) => {
                let value = currentLine[index]?.trim();
                if (value) {
                    // Remove surrounding quotes and unescape double quotes
                    value = value.replace(/^"|"$/g, '').replace(/""/g, '"');
                }
                obj[header] = value;
            });
            result.push(obj);
        }
        return result;
    };

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const storeId = getActiveStoreIdClient();
        if (!storeId) {
            toast.error("No active store found");
            return;
        }

        setImporting(true);
        setLogs([]);

        try {
            const text = await file.text();
            const data = parseCSV(text);

            setLogs(prev => [...prev, `Found ${data.length} rows. Starting import...`]);

            // Transform CSV row to API Payload
            const payload = data.map((row: any) => ({
                title: row.Title,
                // Status Mapping: "Active" -> "published", else "draft"
                status: row.Status?.toLowerCase() === 'active' ? 'published' : 'draft',

                price: parseFloat(row.Price) || 0,
                mrp: parseFloat(row.MRP) || 0,
                cogs: parseFloat(row.COGS) || 0,
                qty: parseInt(row.Quantity) || 0,
                location: row.Location || "",

                description: row["Description (HTML)"] || "",

                seo_title: row["SEO Title"] || "",
                seo_description: row["SEO Description"] || "",

                // Booleans
                cod_enabled: row["COD Allowed"]?.toLowerCase() === 'true',

                rating: parseFloat(row.Rating) || 0,
                review_count: parseInt(row.Reviews) || 0,

                // Arrays (Comma separated)
                highlights: row.Highlights ? row.Highlights.split(';').map((s: string) => s.trim()) : [],
                collection_slug: row.Category ? [row.Category.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "")] : [], // Simple slugify

                // Images
                images: row["Image Src"] ? row["Image Src"].split(',').map((s: string) => s.trim()) : []
            }));

            // Call API
            const res = await fetch('/api/admin/products/import', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ products: payload, storeId })
            });

            const result = await res.json();

            if (!res.ok) throw new Error(result.error);

            // Add API logs
            if (result.logs) setLogs(prev => [...prev, ...result.logs]);

            toast.success(`Import complete: ${result.success} success, ${result.failed} failed`);

        } catch (err: any) {
            toast.error(`Failed to import: ${err.message}`);
            setLogs(prev => [...prev, `CRITICAL ERROR: ${err.message}`]);
        } finally {
            setImporting(false);
        }
    };

    const downloadTemplate = () => {
        const headers = [
            "Title", "Status", "Price", "MRP", "COGS", "Quantity", "Location",
            "Description (HTML)", "Category", "Image Src", "Highlights",
            "Rating", "Reviews", "SEO Title", "SEO Description", "COD Allowed"
        ];
        const row1 = [
            "Sample Product", "Active", "999", "1299", "400", "100", "Warehouse A",
            "<h2>Features</h2><p>Great product.</p>", "Electronics", "https://example.com/img1.jpg,https://example.com/img2.jpg",
            "Feature 1; Feature 2", "4.5", "10", "Best Product", "Buy this now", "TRUE"
        ];
        const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), row1.join(",")].join("\n");

        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", "advanced_product_import_template.csv");
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    return (
        <div className="p-8 max-w-4xl mx-auto space-y-8">
            <div>
                <Link href="/admin/products" className="text-sm text-gray-500 hover:underline mb-2 block">
                    &larr; Back to Products
                </Link>
                <h1 className="text-3xl font-bold tracking-tight">Bulk Product Import</h1>
                <p className="text-gray-500">
                    Upload a CSV file to create products in bulk.
                </p>
            </div>

            <div className="bg-white p-6 border rounded-lg shadow-sm space-y-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h3 className="font-medium">1. Download Template</h3>
                        <p className="text-sm text-gray-500">Start with a pre-formatted CSV file.</p>
                    </div>
                    <button
                        onClick={downloadTemplate}
                        className="flex items-center gap-2 border px-4 py-2 rounded hover:bg-gray-50 text-sm font-medium"
                    >
                        <FileDown className="w-4 h-4" />
                        Download CSV Template
                    </button>
                </div>

                <hr />

                <div>
                    <h3 className="font-medium mb-4">2. Upload CSV</h3>

                    <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100">
                        <div className="flex flex-col items-center justify-center pt-5 pb-6 text-gray-500">
                            <Upload className="w-8 h-8 mb-2" />
                            <p className="text-sm font-medium">Click to upload or drag and drop</p>
                            <p className="text-xs">CSV files only</p>
                        </div>
                        <input
                            type="file"
                            accept=".csv"
                            className="hidden"
                            onChange={handleFileUpload}
                            disabled={importing}
                        />
                    </label>
                </div>
            </div>

            {/* LOGS */}
            {logs.length > 0 && (
                <div className="bg-gray-900 text-green-400 p-4 rounded-lg font-mono text-sm max-h-64 overflow-y-auto">
                    {logs.map((log, i) => (
                        <div key={i}>{log}</div>
                    ))}
                    {importing && <div className="animate-pulse mt-2">Processing...</div>}
                </div>
            )}
        </div>
    );
}
