import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Image as ImageIcon, Upload } from "lucide-react";
import { toast } from "sonner";

export function LogoUpload({ currentUrl, onUpload }) {
    const [preview, setPreview] = useState(currentUrl);

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        if (!file.type.includes("image/")) {
            toast.error("Endast bilder (PNG, SVG, JPG) är tillåtna.");
            return;
        }

        // Mock upload flow
        const reader = new FileReader();
        reader.onload = (ev) => {
            setPreview(ev.target.result);
            onUpload?.(ev.target.result); // Pass base64 or URL up
        };
        reader.readAsDataURL(file);
    };

    return (
        <div className="flex items-center gap-6">
            <div className="w-24 h-24 rounded-lg bg-slate-50 border border-slate-200 flex items-center justify-center overflow-hidden shrink-0">
                {preview ? (
                    <img src={preview} alt="Logo" className="w-full h-full object-contain p-2" />
                ) : (
                    <ImageIcon className="w-8 h-8 text-slate-300" />
                )}
            </div>
            <div>
                <h4 className="text-sm font-medium text-slate-700">Logotyp</h4>
                <p className="text-xs text-slate-500 mt-1 mb-3 max-w-[200px]">
                    Visas på rapporter och i inloggat läge för dina kunder. Rekommenderad storlek 100x100px.
                </p>
                <div className="relative">
                    <input
                        type="file"
                        accept="image/png, image/svg+xml, image/jpeg"
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                        onChange={handleFileChange}
                    />
                    <Button variant="outline" size="sm" className="gap-2">
                        <Upload className="w-4 h-4" /> Byt logotyp
                    </Button>
                </div>
            </div>
        </div>
    );
}
