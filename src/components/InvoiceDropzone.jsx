// src/components/InvoiceDropzone.jsx
import React, { useCallback, useState } from "react";
import { CloudArrowUpIcon } from "@heroicons/react/24/outline";
import { toast } from "sonner";

const API = import.meta.env.VITE_API_URL || "http://localhost:4000";

export default function InvoiceDropzone({ token, onUploaded, onFilesSelected, compact, label }) {
  const [dragOver, setDragOver] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [analyzing, setAnalyzing] = useState(false); // 🔥 nytt state

  const handleFiles = useCallback(
    async (files) => {
      if (!files || !files[0]) return;

      // 🚀 NEW: Delegate to parent if handler exists (Scan Theatre Mode)
      if (onFilesSelected) {
        onFilesSelected(Array.from(files));
        return;
      }

      const file = files[0];

      const formData = new FormData();
      formData.append("file", file);

      setUploading(true);
      try {
        const res = await fetch(`${API}/api/invoices/scan`, {
          method: "POST",
          headers: token ? { Authorization: `Bearer ${token}` } : undefined,
          body: formData,
        });

        if (!res.ok) throw new Error(`HTTP ${res.status}`);

        // 🔥 Efter upload -> visa "AI analyserar…" i UI
        setAnalyzing(true);
        toast.success("Fakturan är uppladdad – AI analyserar den nu.");

        onUploaded && onUploaded();
      } catch (err) {
        console.error(err);
        toast.error("Kunde inte ladda upp fakturan.");
      } finally {
        setUploading(false);

        // "Analyserar…" stannar på tills SSE eller reload ändrar listan
        setTimeout(() => setDragOver(false), 200);
      }
    },
    [token, onUploaded]
  );

  const onDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragOver(false);
    handleFiles(e.dataTransfer.files);
  };

  const onDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragOver(true);
  };

  const onDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragOver(false);
  };

  const onPickFile = (e) => {
    handleFiles(e.target.files);
    e.target.value = "";
  };

  return (
    <label
      onDrop={onDrop}
      onDragOver={onDragOver}
      onDragLeave={onDragLeave}
      className={`flex items-center gap-2 rounded-xl border text-xs px-3 cursor-pointer transition
      ${dragOver
          ? "border-[#1E5CB3] bg-blue-50/60"
          : "border-dashed border-slate-300 bg-white hover:bg-slate-50"
        } 
      ${compact ? "h-full w-full justify-center" : "py-2"}
      ${uploading || analyzing ? "opacity-60 cursor-progress" : ""}`}
    >
      <input
        type="file"
        accept="application/pdf,image/*"
        className="hidden"
        disabled={uploading || analyzing}
        onChange={onPickFile}
      />

      <CloudArrowUpIcon className={`text-[#1E5CB3] ${compact ? "w-5 h-5" : "w-4 h-4"}`} />

      <div className="flex flex-col">
        <span className={`${compact ? "font-semibold text-slate-600" : "font-medium text-slate-800"}`}>
          {uploading
            ? "Laddar upp..."
            : analyzing
              ? "Analyserar..."
              : (label || "Dra in din faktura här")}
        </span>
      </div>
    </label>
  );
}
