"use client";

import { useRef, useState } from "react";
import { useMutation } from "convex/react";
import { ConvexHttpClient } from "convex/browser";
import { api } from "@workspaceRoot/convex/_generated/api";
import { Id } from "@workspaceRoot/convex/_generated/dataModel";
import { Upload, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

const convexClient = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL!);

interface ImageUploaderProps {
    onUploadComplete: (urls: string[]) => void;
    maxFiles?: number;
    disabled?: boolean;
}

export function ImageUploader({ onUploadComplete, maxFiles = 5, disabled }: ImageUploaderProps) {
    const [uploading, setUploading] = useState(false);
    const [progress, setProgress] = useState(0);
    const [dragOver, setDragOver] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const inputRef = useRef<HTMLInputElement>(null);
    const generateUploadUrl = useMutation(api.files.generateUploadUrl);

    async function uploadFiles(files: FileList | File[]) {
        const imageFiles = Array.from(files)
            .filter(f => f.type.startsWith("image/"))
            .slice(0, maxFiles);
        if (!imageFiles.length) return;

        setUploading(true);
        setProgress(0);
        setError(null);

        try {
            const urls: string[] = [];
            for (let i = 0; i < imageFiles.length; i++) {
                const file = imageFiles[i];

                // Step 1: get a short-lived upload URL from Convex
                const uploadUrl = await generateUploadUrl();

                // Step 2: POST the file directly to Convex storage
                const res = await fetch(uploadUrl, {
                    method: "POST",
                    headers: { "Content-Type": file.type },
                    body: file,
                });
                if (!res.ok) throw new Error(`Upload failed (${res.status})`);
                const { storageId } = await res.json() as { storageId: string };

                // Step 3: resolve the serving URL via Convex query
                const url = await convexClient.query(api.files.getUrl, {
                    storageId: storageId as Id<"_storage">,
                });
                if (url) urls.push(url);

                setProgress(Math.round(((i + 1) / imageFiles.length) * 100));
            }
            onUploadComplete(urls);
        } catch (err) {
            setError(err instanceof Error ? err.message : "Upload failed");
        } finally {
            setUploading(false);
            setProgress(0);
        }
    }

    function handleDrop(e: React.DragEvent) {
        e.preventDefault();
        setDragOver(false);
        if (disabled || uploading) return;
        uploadFiles(e.dataTransfer.files);
    }

    function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
        if (e.target.files) {
            uploadFiles(e.target.files);
            e.target.value = "";
        }
    }

    return (
        <div className="space-y-2">
            <div
                onClick={() => !uploading && !disabled && inputRef.current?.click()}
                onDrop={handleDrop}
                onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
                onDragLeave={() => setDragOver(false)}
                className={cn(
                    "border-2 border-dashed rounded-2xl h-40 flex flex-col items-center justify-center gap-3 transition-all",
                    !uploading && !disabled && "cursor-pointer",
                    dragOver
                        ? "border-primary/70 bg-primary/5"
                        : "border-neutral-800 bg-neutral-900/50 hover:border-primary/50 hover:bg-neutral-800/50",
                    (disabled || uploading) && "opacity-60 pointer-events-none"
                )}
            >
                <input
                    ref={inputRef}
                    type="file"
                    accept="image/*"
                    multiple
                    className="hidden"
                    onChange={handleChange}
                />

                {uploading ? (
                    <>
                        <Loader2 className="w-6 h-6 text-primary animate-spin" />
                        <p className="text-xs text-neutral-400 font-serif">Uploading... {progress}%</p>
                        <div className="w-32 h-1 bg-neutral-800 rounded-full overflow-hidden">
                            <div
                                className="h-full bg-primary rounded-full transition-all duration-300"
                                style={{ width: `${progress}%` }}
                            />
                        </div>
                    </>
                ) : (
                    <>
                        <Upload className="w-6 h-6 text-neutral-500" />
                        <p className="text-sm text-neutral-400 font-serif">Drop images here or click to upload</p>
                        <p className="text-[10px] text-neutral-600 uppercase tracking-widest">
                            PNG, JPG, WEBP · max 16MB each
                        </p>
                    </>
                )}
            </div>

            {error && (
                <p className="text-xs text-red-400 px-1">{error}</p>
            )}
        </div>
    );
}
