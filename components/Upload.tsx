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
  const [files, setFiles] = useState<File[]>([]);
  const [isContest, setIsContest] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [doneCount, setDoneCount] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const addFiles = (incoming: FileList | null) => {
    if (!incoming) return;
    const valid = Array.from(incoming).filter(
      (f) => f.type.startsWith("image/") || f.type.startsWith("video/")
    );
    setFiles((prev) => {
      const existing = new Set(prev.map((f) => f.name + f.size));
      return [...prev, ...valid.filter((f) => !existing.has(f.name + f.size))];
    });
  };

  const removeFile = (index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    addFiles(e.dataTransfer.files);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || files.length === 0) return;
    setUploading(true);
    setDoneCount(0);

    let successCount = 0;
    for (const file of files) {
      try {
        const formData = new FormData();
        formData.append("file", file);
        formData.append("uploader_name", name.trim());
        formData.append("is_groom_contest", String(isContest));
        const res = await fetch("/api/upload", { method: "POST", body: formData });
        if (!res.ok) throw new Error();
        successCount++;
        setDoneCount(successCount);
      } catch {
        toast.error(`${tr.uploadError}: ${file.name}`);
      }
    }

    if (successCount > 0) {
      toast.success(
        isAr
          ? `تم رفع ${successCount} ملف بنجاح 🎉`
          : `${successCount} file${successCount > 1 ? "s" : ""} uploaded!`
      );
    }

    setName("");
    setFiles([]);
    setIsContest(false);
    setDoneCount(0);
    setUploading(false);
    onUploadComplete?.();
  };

  const canSubmit = !uploading && files.length > 0 && !!name.trim();

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

        {/* Drop zone */}
        <div
          onClick={() => fileInputRef.current?.click()}
          onDrop={handleDrop}
          onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
          onDragLeave={() => setIsDragging(false)}
          className={`relative border-2 border-dashed rounded-2xl p-6 text-center cursor-pointer transition-all duration-300 select-none ${
            isDragging
              ? "border-gold bg-gold/8 scale-[1.01]"
              : "border-navy/15 hover:border-gold/50 hover:bg-cream/60"
          }`}
        >
          <div className={`w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-2 transition-colors ${isDragging ? "bg-gold/20" : "bg-navy/6"}`}>
            <svg className={`w-6 h-6 transition-colors ${isDragging ? "text-gold" : "text-navy/35"}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
            </svg>
          </div>
          <p className="text-sm text-navy/60 font-medium" style={{ fontFamily: "'Noto Naskh Arabic', serif" }}>
            {isAr ? "اضغط أو اسحب الملفات هنا" : "Tap or drag files here"}
          </p>
          <p className="text-xs text-navy/30 mt-1" style={{ fontFamily: "'Noto Naskh Arabic', serif" }}>
            {isAr ? "يمكنك اختيار أكثر من ملف" : "You can select multiple files"}
          </p>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*,video/*"
            multiple
            onChange={(e) => addFiles(e.target.files)}
            className="hidden"
          />
        </div>

        {/* File previews */}
        {files.length > 0 && (
          <div className="grid grid-cols-3 gap-2">
            {files.map((f, i) => (
              <div key={i} className="relative rounded-xl overflow-hidden border border-gold/20 group">
                {f.type.startsWith("image/") ? (
                  <img
                    src={URL.createObjectURL(f)}
                    alt={f.name}
                    className="w-full h-20 object-cover"
                  />
                ) : (
                  <div className="w-full h-20 bg-navy/8 flex flex-col items-center justify-center gap-1">
                    <svg className="w-6 h-6 text-navy/30" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                        d="M15 10l4.553-2.069A1 1 0 0121 8.867V15.13a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                    </svg>
                    <p className="text-[10px] text-navy/40 truncate w-full text-center px-1">{f.name}</p>
                  </div>
                )}
                {/* Done tick */}
                {uploading && i < doneCount && (
                  <div className="absolute inset-0 bg-green-500/60 flex items-center justify-center">
                    <span className="text-white text-xl">✓</span>
                  </div>
                )}
                {/* Remove */}
                {!uploading && (
                  <button
                    type="button"
                    onClick={() => removeFile(i)}
                    className="absolute top-1 right-1 w-5 h-5 rounded-full bg-black/60 text-white text-[10px] flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    ✕
                  </button>
                )}
              </div>
            ))}
            {/* Add more */}
            {!uploading && (
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="w-full h-20 rounded-xl border-2 border-dashed border-navy/15 hover:border-gold/40 flex items-center justify-center text-navy/30 hover:text-gold transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
              </button>
            )}
          </div>
        )}

        {/* Progress */}
        {uploading && (
          <div className="space-y-1">
            <div className="w-full bg-navy/8 rounded-full h-1.5 overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-gold-dark to-gold transition-all duration-300 rounded-full"
                style={{ width: `${Math.round((doneCount / files.length) * 100)}%` }}
              />
            </div>
            <p className="text-xs text-navy/40 text-center" style={{ fontFamily: "'Noto Naskh Arabic', serif" }}>
              {isAr ? `${doneCount} / ${files.length}` : `${doneCount} / ${files.length}`}
            </p>
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

        {/* Submit */}
        <button type="submit" disabled={!canSubmit} className="btn-primary w-full">
          {uploading
            ? (isAr ? `جارٍ الرفع... ${doneCount}/${files.length}` : `Uploading ${doneCount}/${files.length}...`)
            : files.length > 1
              ? (isAr ? `ارفع ${files.length} ملفات` : `Upload ${files.length} files`)
              : tr.upload}
        </button>

      </form>
    </div>
  );
}
