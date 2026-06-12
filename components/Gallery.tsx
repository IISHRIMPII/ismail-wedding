"use client";

import { useState } from "react";
import { Lang, t } from "@/lib/i18n";
import Upload from "./Upload";

interface GalleryProps {
  lang: Lang;
}

export default function Gallery({ lang }: GalleryProps) {
  const tr = t[lang];
  const isAr = lang === "ar";
  const [showUpload, setShowUpload] = useState(false);

  return (
    <section className={`navy-pattern-bg py-16 px-4 ${isAr ? "rtl" : "ltr"}`}>

      {/* Section header */}
      <div className="text-center mb-10">
        <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-white/8 mb-4">
          <svg className="w-6 h-6 text-cream/50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
              d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
        </div>
        <h2 className="text-2xl text-cream mb-1" style={{ fontFamily: "'Amiri', serif" }}>{tr.galleryTitle}</h2>
        <p className="text-cream/40 text-sm" style={{ fontFamily: "'Noto Naskh Arabic', serif" }}>{tr.gallerySubtitle}</p>
        <div className="gold-divider-full mt-5" />
      </div>

      {/* Upload toggle */}
      <div className="max-w-lg mx-auto mb-6">
        <button
          onClick={() => setShowUpload(!showUpload)}
          className="w-full flex items-center justify-center gap-2 py-3.5 px-6 rounded-2xl border-2 border-dashed border-gold/30 text-cream/60 hover:border-gold/60 hover:text-cream/80 hover:bg-white/5 transition-all duration-300 text-sm"
          style={{ fontFamily: "'Noto Naskh Arabic', serif" }}
        >
          <svg className={`w-4 h-4 transition-transform duration-300 ${showUpload ? "rotate-45" : ""}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          {showUpload
            ? (isAr ? "إخفاء نموذج الرفع" : "Hide upload form")
            : (isAr ? "شارك صورة أو فيديو" : "Share a photo or video")}
        </button>
      </div>

      {showUpload && (
        <div className="max-w-lg mx-auto">
          <Upload lang={lang} onUploadComplete={() => setShowUpload(false)} />
        </div>
      )}

    </section>
  );
}
