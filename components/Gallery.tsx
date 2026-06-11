"use client";

import { useState, useEffect, useCallback } from "react";
import toast from "react-hot-toast";
import { Lang, t } from "@/lib/i18n";
import { Media } from "@/lib/supabase";
import Upload from "./Upload";

interface GalleryProps {
  lang: Lang;
}

export default function Gallery({ lang }: GalleryProps) {
  const tr = t[lang];
  const isAr = lang === "ar";

  const [media, setMedia] = useState<Media[]>([]);
  const [lightbox, setLightbox] = useState<Media | null>(null);
  const [votedIds, setVotedIds] = useState<Set<string>>(new Set());
  const [showUpload, setShowUpload] = useState(false);

  const fetchMedia = useCallback(async () => {
    const res = await fetch("/api/upload");
    if (res.ok) setMedia(await res.json());
  }, []);

  useEffect(() => {
    fetchMedia();
    try {
      const stored = JSON.parse(localStorage.getItem("votedMedia") || "[]");
      setVotedIds(new Set(stored));
    } catch {}
  }, [fetchMedia]);

  const handleVote = async (id: string) => {
    if (votedIds.has(id)) return;
    try {
      const res = await fetch("/api/vote", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ media_id: id }),
      });
      if (!res.ok) throw new Error();
      toast.success(tr.voteSuccess);
      const newVoted = new Set(votedIds).add(id);
      setVotedIds(newVoted);
      localStorage.setItem("votedMedia", JSON.stringify(Array.from(newVoted)));
      fetchMedia();
    } catch {
      toast.error(tr.wishError);
    }
  };

  const regularMedia = media.filter((m) => !m.is_groom_contest);
  const contestMedia = media.filter((m) => m.is_groom_contest);

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

      {/* Upload toggle button */}
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

      {/* Upload form (collapsible) */}
      {showUpload && (
        <div className="max-w-lg mx-auto mb-10">
          <Upload lang={lang} onUploadComplete={() => { fetchMedia(); setShowUpload(false); }} />
        </div>
      )}

      {/* Regular gallery grid */}
      {regularMedia.length > 0 && (
        <div className="max-w-5xl mx-auto mb-14">
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2.5">
            {regularMedia.map((m) => (
              <MediaCard
                key={m.id}
                item={m}
                onOpen={setLightbox}
              />
            ))}
          </div>
        </div>
      )}

      {/* Contest section */}
      {contestMedia.length > 0 && (
        <div className="max-w-4xl mx-auto">
          <div className="gold-divider-full mb-10" />
          <div className="text-center mb-8">
            <h3 className="text-xl text-cream" style={{ fontFamily: "'Amiri', serif" }}>🏆 {tr.contestTitle}</h3>
            <p className="text-cream/40 text-sm mt-1" style={{ fontFamily: "'Noto Naskh Arabic', serif" }}>{tr.contestSubtitle}</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {[...contestMedia]
              .sort((a, b) => b.votes - a.votes)
              .map((m, i) => (
                <div key={m.id} className="bg-white/8 backdrop-blur-sm rounded-2xl border border-gold/20 overflow-hidden shadow-lg">
                  {/* Rank badge */}
                  {i < 3 && (
                    <div className="absolute m-3 z-10">
                      <span className={`text-xs px-2.5 py-1 rounded-full font-bold ${
                        i === 0 ? "bg-gold text-white" :
                        i === 1 ? "bg-white/30 text-cream" :
                        "bg-white/20 text-cream/80"
                      }`}>
                        {["👑 #1", "🥈 #2", "🥉 #3"][i]}
                      </span>
                    </div>
                  )}
                  <div className="relative">
                    <img
                      src={m.file_url}
                      alt={m.uploader_name}
                      className="w-full h-48 object-cover cursor-pointer hover:opacity-90 transition-opacity"
                      onClick={() => setLightbox(m)}
                    />
                  </div>
                  <div className="flex items-center justify-between p-3">
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-cream/90 truncate" style={{ fontFamily: "'Noto Naskh Arabic', serif" }}>{m.uploader_name}</p>
                      <p className="text-xs text-gold/60">{m.votes} {tr.votes}</p>
                    </div>
                    <button
                      onClick={() => handleVote(m.id)}
                      disabled={votedIds.has(m.id)}
                      className={`flex items-center gap-1.5 px-3.5 py-2 rounded-full text-xs font-medium transition-all duration-200 flex-shrink-0 ${
                        votedIds.has(m.id)
                          ? "bg-gold/25 text-gold cursor-default"
                          : "bg-gold text-white hover:bg-gold-dark active:scale-95"
                      }`}
                    >
                      ❤️ {tr.vote}
                    </button>
                  </div>
                </div>
              ))}
          </div>
        </div>
      )}

      {media.length === 0 && !showUpload && (
        <div className="text-center py-10">
          <p className="text-4xl mb-3">📷</p>
          <p className="text-cream/30 text-sm" style={{ fontFamily: "'Noto Naskh Arabic', serif" }}>{tr.noMedia}</p>
        </div>
      )}

      {/* Lightbox */}
      {lightbox && (
        <div
          className="fixed inset-0 bg-black/95 z-50 flex items-center justify-center p-4"
          onClick={() => setLightbox(null)}
        >
          <button
            className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/10 text-white flex items-center justify-center hover:bg-white/20 transition-colors z-10"
            onClick={() => setLightbox(null)}
          >
            ✕
          </button>
          <div onClick={(e) => e.stopPropagation()} className="max-w-full max-h-[90vh] relative">
            {lightbox.file_type === "video" ? (
              <video
                src={lightbox.file_url}
                controls
                autoPlay
                className="max-w-full max-h-[85vh] rounded-2xl shadow-2xl"
              />
            ) : (
              <img
                src={lightbox.file_url}
                alt={lightbox.uploader_name}
                className="max-w-full max-h-[85vh] rounded-2xl object-contain shadow-2xl"
              />
            )}
            <div className="absolute -bottom-8 left-0 right-0 text-center">
              <p className="text-white/40 text-sm" style={{ fontFamily: "'Noto Naskh Arabic', serif" }}>{lightbox.uploader_name}</p>
            </div>
          </div>
        </div>
      )}

    </section>
  );
}

function MediaCard({
  item,
  onOpen,
}: {
  item: Media;
  onOpen: (m: Media) => void;
}) {
  return (
    <div className="group relative rounded-xl overflow-hidden bg-white/8 border border-white/10 shadow-sm hover:border-gold/30 transition-all duration-300 hover:shadow-lg hover:scale-[1.02]">
      {item.file_type === "video" ? (
        <div className="relative">
          <video src={item.file_url} className="w-full h-36 object-cover cursor-pointer" onClick={() => onOpen(item)} />
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="w-10 h-10 rounded-full bg-black/50 flex items-center justify-center">
              <svg className="w-5 h-5 text-white ml-0.5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M8 5v14l11-7z" />
              </svg>
            </div>
          </div>
        </div>
      ) : (
        <img
          src={item.file_url}
          alt={item.uploader_name}
          className="w-full h-36 object-cover cursor-pointer"
          onClick={() => onOpen(item)}
        />
      )}
      {/* Hover overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
      <div className="p-2">
        <p className="text-xs text-cream/60 truncate" style={{ fontFamily: "'Noto Naskh Arabic', serif" }}>{item.uploader_name}</p>
      </div>
    </div>
  );
}
