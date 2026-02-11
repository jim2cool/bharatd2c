"use client";

import { useState } from "react";
import { Upload, Copy, Folder, Image as ImageIcon, Loader2 } from "lucide-react";
import { toast } from "sonner";
import Image from "next/image";

type UploadedFile = {
    url: string;
    name: string;
    folder: string;
};

export default function MediaManagerPage() {
    const [uploading, setUploading] = useState(false);
    const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
    const [dragActive, setDragActive] = useState(false);

    const handleUpload = async (files: FileList | null) => {
        if (!files || files.length === 0) return;

        setUploading(true);
        const results: UploadedFile[] = [];

        // Process sequentially or in small batches to avoid overwhelming the server/browser
        for (let i = 0; i < files.length; i++) {
            const file = files[i];
            if (!file.type.startsWith("image/")) continue;

            const formData = new FormData();
            formData.append("file", file);

            // Use webkitRelativePath to detect folder structure if dropped
            // e.g. "MyProduct/image.jpg" -> folder="MyProduct"
            let folder = "uploads";
            if (file.webkitRelativePath) {
                const parts = file.webkitRelativePath.split("/");
                if (parts.length > 1) {
                    folder = parts[0];
                }
            }
            formData.append("folder", folder);

            try {
                const res = await fetch("/api/upload", {
                    method: "POST",
                    body: formData,
                });
                const data = await res.json();
                if (data.url) {
                    results.push({
                        url: data.url,
                        name: file.name,
                        folder: folder,
                    });
                }
            } catch (err) {
                console.error("Upload failed for", file.name, err);
            }
        }

        setUploadedFiles((prev) => [...prev, ...results]);
        setUploading(false);
        toast.success(`Uploaded ${results.length} images`);
    };

    const handleDrag = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === "dragenter" || e.type === "dragover") {
            setDragActive(true);
        } else if (e.type === "dragleave") {
            setDragActive(false);
        }
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);
        if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
            handleUpload(e.dataTransfer.files);
        }
    };

    const copyUrl = (url: string) => {
        navigator.clipboard.writeText(url);
        toast.success("URL copied to clipboard");
    };

    const downloadAllUrls = () => {
        const csvContent = "data:text/csv;charset=utf-8,"
            + "Folder,Filename,URL\n"
            + uploadedFiles.map(f => `${f.folder},${f.name},${f.url}`).join("\n");

        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", "uploaded_images.csv");
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    return (
        <div className="p-8 max-w-7xl mx-auto space-y-8">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Media Manager</h1>
                    <p className="text-gray-500">
                        Upload product images in folders. Copy URLs for bulk import.
                    </p>
                </div>

                {uploadedFiles.length > 0 && (
                    <button
                        onClick={downloadAllUrls}
                        className="bg-black text-white px-4 py-2 rounded-md text-sm font-medium flex items-center gap-2 hover:bg-gray-800"
                    >
                        <Copy className="w-4 h-4" />
                        Download URL List (CSV)
                    </button>
                )}
            </div>

            {/* DRAG & DROP ZONE */}
            <div
                className={`border-2 border-dashed rounded-xl p-12 text-center transition-colors ${dragActive ? "border-blue-500 bg-blue-50" : "border-gray-300 hover:border-gray-400"
                    }`}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
            >
                <Folder className="w-12 h-12 mx-auto text-gray-400 mb-4" />
                <h3 className="text-lg font-medium text-gray-900">
                    Drag & drop folders or images here
                </h3>
                <p className="text-gray-500 mt-1 mb-6">
                    Supports multiple files and nested folders
                </p>

                <label className="cursor-pointer bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded-md font-medium hover:bg-gray-50 shadow-sm inline-flex items-center gap-2">
                    <Upload className="w-4 h-4" />
                    Select Files
                    <input
                        type="file"
                        multiple
                        // @ts-ignore
                        webkitdirectory=""
                        className="hidden"
                        onChange={(e) => handleUpload(e.target.files)}
                    />
                </label>
            </div>

            {/* UPLOADING STATE */}
            {uploading && (
                <div className="flex items-center justify-center py-12">
                    <Loader2 className="w-8 h-8 animate-spin text-gray-500" />
                    <span className="ml-3 text-gray-500">Uploading media...</span>
                </div>
            )}

            {/* RESULTS GRID */}
            {uploadedFiles.length > 0 && (
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                    {uploadedFiles.map((file, idx) => (
                        <div key={idx} className="group relative border rounded-lg overflow-hidden bg-white shadow-sm hover:shadow-md transition-shadow">
                            <div className="aspect-square relative bg-gray-100">
                                <Image
                                    src={file.url}
                                    alt={file.name}
                                    fill
                                    className="object-cover"
                                />
                            </div>
                            <div className="p-2 border-t text-xs">
                                <p className="font-medium truncate" title={file.name}>{file.name}</p>
                                <p className="text-gray-500 truncate" title={file.folder}>{file.folder}</p>
                            </div>

                            {/* Overlay Button */}
                            <button
                                onClick={() => copyUrl(file.url)}
                                className="absolute top-2 right-2 bg-white/90 p-1.5 rounded shadow-sm opacity-0 group-hover:opacity-100 transition-opacity hover:bg-white"
                                title="Copy URL"
                            >
                                <Copy className="w-3.5 h-3.5 text-gray-700" />
                            </button>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
