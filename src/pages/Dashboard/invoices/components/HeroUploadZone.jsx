import React, { useState } from 'react';
import { CloudArrowUpIcon } from "@heroicons/react/24/outline";
import { toast } from "sonner";

export default function HeroUploadZone({ onFilesSelected, token }) {
    const [isDragOver, setIsDragOver] = useState(false);

    const handleDrop = (e) => {
        e.preventDefault();
        setIsDragOver(false);
        if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
            onFilesSelected(Array.from(e.dataTransfer.files));
            toast.info("Faturor köade för analys...");
        }
    };

    const handleDragOver = (e) => {
        e.preventDefault();
        setIsDragOver(true);
    };

    const handleDragLeave = (e) => {
        e.preventDefault();
        setIsDragOver(false);
    };

    const handleFileSelect = (e) => {
        if (e.target.files && e.target.files.length > 0) {
            onFilesSelected(Array.from(e.target.files));
            toast.info("Faturor köade för analys...");
        }
    };

    return (
        <div
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            className={`
                relative group cursor-pointer
                border-2 border-dashed rounded-2xl p-8 text-center transition-all duration-300
                flex flex-col items-center justify-center gap-4 bg-slate-50/50 hover:bg-indigo-50/30
                ${isDragOver ? 'border-indigo-500 ring-4 ring-indigo-500/10 scale-[1.01] bg-indigo-50/50' : 'border-slate-300 hover:border-indigo-400'}
            `}
        >
            <input
                type="file"
                multiple
                accept=".pdf,.png,.jpg,.jpeg"
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                onChange={handleFileSelect}
            />

            <div className={`
                w-16 h-16 rounded-full flex items-center justify-center transition-all duration-300
                ${isDragOver ? 'bg-indigo-100 text-indigo-600 scale-110 shadow-lg' : 'bg-white shadow-sm text-slate-400 group-hover:text-indigo-500 group-hover:scale-110'}
            `}>
                <CloudArrowUpIcon className="w-8 h-8" />
            </div>

            <div className="space-y-1">
                <h3 className="text-lg font-semibold text-slate-900 group-hover:text-indigo-700 transition-colors">
                    Dra in fakturor eller klicka här
                </h3>
                <p className="text-sm text-slate-500 max-w-sm mx-auto">
                    Valiflow extraherar automatiskt belopp, datum, leverantör och riskbedömer innehållet direkt.
                </p>
            </div>

            {/* Decoration */}
            <div className="absolute inset-0 pointer-events-none rounded-2xl ring-1 ring-inset ring-black/5 group-hover:ring-indigo-500/20"></div>
        </div>
    );
}
