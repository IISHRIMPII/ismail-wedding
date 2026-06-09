"use client";

import { useState, useRef, useCallback } from "react";
import toast from "react-hot-toast";
import { Lang, t } from "@/lib/i18n";

interface UploadProps {
  lang: Lang;
  onUploadComplete?: () => void;
}

export default function Upload({ lang, onUploadComplete }: UploadProps) {
  const tr = t[lang];
  const isAr = lang === "ar";

  const [name, setName] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [isContest, setIsContest] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [preview, setPreview] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (f: File) => {
    setFile(f);
    if (f.type.startsWith("image/")) {
      setPreview(URL.createObjectURL(f));
    } else {
      setPreview(null);
    }
  };

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const f = e.dataTransfer.files?.[0];
    if (f) handleFileSelect(f);
  }, []);

  const removeFile = () => {
    setFile(null);
    setPreview(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !file) return;
    setUploading(true);
    setProgress(10);

    const interval = setInterval(() => {
      setProgress((p) => (p < 80 ? p + 7 : p));
    }, 250);

    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("uploader_name", name.trim());
      formData.append("is_groom_contest", String(isContest));

      const res = await fetch("/api/upload", { method: "POST", body: formData });
      if (!res.ok) throw new Error();

      clearInterval(interval);
      setProgress(100);

      await new Promise((r) => setTimeout(r, 400));
      toast.success(tr.uploadSuccess);
      setName("");
      setFile(null);
      setPreview(null);
      setIsContest(false);
      setProgress(0);
      onUploadComplete?.();
    } catch {
      clearInterval(interval);
      setProgress(0);
      toast.error(tr.uploadError);
    } finally {
      setUploading(false);
    }
  };

  const canSubmit = !uploading && !!file && !!name.trim();

  return (
    <div className={`card space-y-5 ${isAr ? "rtl" : "ltr"}`}>

      {/* Header */}
      <div className="text-center">
        <div className="w-10 h-10 rounded-full bg-navy/8 flex items-center justify-center mx-auto mb-3">
          <svg className="w-5 h-5 text-navy/60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
              d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
            <circle cx="12" cy="13" r="3" strokeWidth="1.5" />
          </svg>
        </div>
        <h3 className="text-base font-bold text-navy" style={{ fontFamily: "'Amiri', serif" }}>{tr.uploadTitle}</h3>
        <p className="text-xs text-navy/45 mt-0.5" style={{ fontFamily: "'Noto Naskh Arabic', serif" }}>{tr.uploadSubtitle}</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">

        {/* Name */}
        <input
          className="input-field"
          placeholder={tr.namePlaceholder}
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />

        {/* Drop zone or Preview */}
        {!file ? (
          <div
            onClick={() => fileInputRef.current?.click()}
            onDrop={handleDrop}
            onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
            onDragLeave={() => setIsDragging(false)}
            className={`relative border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer transition-all duration-300 select-none ${
              isDragging
                ? "border-gold bg-gold/8 scale-[1.01]"
                : "border-navy/15 hover:border-gold/50 hover:bg-cream/60"
            }`}
          >
            <div className={`w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-3 transition-colors ${isDragging ? "bg-gold/20" : "bg-navy/6"}`}>
              <svg className={`w-7 h-7 transition-colors ${isDragging ? "text-gold" : "text-navy/35"}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
              </svg>
            </div>
            <p className="text-sm text-navy/60 font-medium" style={{ fontFamily: "'Noto Naskh Arabic', serif" }}>
              {isAr ? "اضغط أو اسحب ملفًا هنا" : "Tap or drag a file here"}
            </p>
            <p className="text-xs text-navy/30 mt-1" style={{ fontFamily: "'Noto Naskh Arabic', serif" }}>
              {isAr ? "صور أو فيديوهات" : "Photos or videos"}
            </p>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*,video/*"
              onChange={(e) => { const f = e.target.files?.[0]; if (f) handleFileSelect(f); }}
              className="hidden"
            />
          </div>
        ) : (
          <div className="relative rounded-2xl overflow-hidden border border-gold/25 shadow-sm group">
            {preview ? (
              <img src={preview} alt="preview" className="w-full h-52 object-cover" />
            ) : (
              <div className="w-full h-28 bg-navy/8 flex flex-col items-center justify-center gap-2">
                <svg className="w-8 h-8 text-navy/30" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                    d="M15 10l4.553-2.069A1 1 0 0121 8.867V15.13a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
                <p className="text-navy/40 text-xs truncate max-w-[200px]">{file.name}</p>
              </div>
            )}
            {/* Remove button */}
            <button
              type="button"
              onClick={removeFile}
              className="absolute top-2 right-2 w-7 h-7 rounded-full bg-black/55 text-white text-xs flex items-center justify-center hover:bg-black/75 transition-colors"
            >
              ✕
            </button>
            {/* File info overlay */}
            <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/60 to-transparent px-3 py-2.5">
              <p className="text-white text-xs truncate">{file.name}</p>
            </div>
          </div>
        )}

        {/* Contest toggle */}
        <button
          type="button"
          onClick={() => setIsContest(!isContest)}
          className="w-full flex items-center gap-3 p-3 rounded-xl border border-navy/10 hover:border-gold/30 transition-colors bg-transparent text-start"
        >
          <div className={`w-11 h-6 rounded-full transition-all duration-300 flex-shrink-0 flex items-center px-0.5 ${isContest ? "bg-gold" : "bg-navy/20"}`}>
            <div className={`w-5 h-5 rounded-full bg-white shadow transition-all duration-300 ${isContest ? "translate-x-5" : "translate-x-0"}`} />
          </div>
          <span className="text-sm text-navy/65 leading-snug" style={{ fontFamily: "'Noto Naskh Arabic', serif" }}>
            🏆 {tr.isGroomContest}
          </span>
        </button>

        {/* Progress bar */}
        {uploading && (
          <div className="w-full bg-navy/8 rounded-full h-1.5 overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-gold-dark to-gold-light transition-all duration-300 ease-out rounded-full"
              style={{ width: `${progress}%` }}
            />
          </div>
        )}

        {/* Submit */}
        <button type="submit" disabled={!canSubmit} className="btn-primary w-full">
          {uploading ? (
            <>
              <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
              {tr.uploading}
            </>
          ) : tr.upload}
        </button>

      </form>
    </div>
  );
}
