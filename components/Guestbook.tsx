"use client";

import { useState, useEffect, useCallback } from "react";
import toast from "react-hot-toast";
import { Lang, t } from "@/lib/i18n";
import { Wish } from "@/lib/supabase";

interface GuestbookProps {
  lang: Lang;
}

export default function Guestbook({ lang }: GuestbookProps) {
  const tr = t[lang];
  const isAr = lang === "ar";

  const [wishes, setWishes] = useState<Wish[]>([]);
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const fetchWishes = useCallback(async () => {
    const res = await fetch("/api/wishes");
    if (res.ok) setWishes(await res.json());
  }, []);

  useEffect(() => {
    fetchWishes();
  }, [fetchWishes]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !message.trim()) return;
    setLoading(true);
    try {
      const res = await fetch("/api/wishes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: name.trim(), message: message.trim() }),
      });
      if (!res.ok) throw new Error();
      toast.success(tr.wishSuccess);
      setSent(true);
      fetchWishes();
      setTimeout(() => {
        setSent(false);
        setName("");
        setMessage("");
      }, 3000);
    } catch {
      toast.error(tr.wishError);
    } finally {
      setLoading(false);
    }
  };

  const avatarColors = [
    "from-navy to-navy-light",
    "from-gold-dark to-gold",
    "from-[#2d4a6e] to-navy-light",
    "from-gold to-gold-light",
  ];

  return (
    <section className={`pattern-bg py-16 px-4 ${isAr ? "rtl" : "ltr"}`}>

      {/* Section header */}
      <div className="text-center mb-10">
        <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-navy/8 mb-4">
          <svg className="w-6 h-6 text-navy/50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
              d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
          </svg>
        </div>
        <h2 className="section-title">{tr.wishesTitle}</h2>
        <p className="section-subtitle">{tr.wishesSubtitle}</p>
      </div>

      {/* Form */}
      <div className="max-w-lg mx-auto mb-10">
        {sent ? (
          <div className="card text-center py-12">
            <div className="text-5xl mb-4">🎉</div>
            <p className="text-navy text-lg font-bold" style={{ fontFamily: "'Amiri', serif" }}>{tr.wishSuccess}</p>
            <p className="text-navy/45 text-sm mt-2" style={{ fontFamily: "'Noto Naskh Arabic', serif" }}>
              {isAr ? "شكراً لمشاركتنا فرحتك" : "Thank you for sharing your joy"}
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="card space-y-4">
            <input
              className="input-field"
              placeholder={tr.namePlaceholder}
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
            <textarea
              className="input-field min-h-[110px] resize-none"
              placeholder={tr.wishPlaceholder}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              required
            />
            <button type="submit" disabled={loading || !name.trim() || !message.trim()} className="btn-primary w-full">
              {loading ? (
                <>
                  <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  <span>...</span>
                </>
              ) : (
                <>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                      d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                  </svg>
                  {tr.submitWish}
                </>
              )}
            </button>
          </form>
        )}
      </div>

      {/* Divider */}
      {wishes.length > 0 && (
        <div className="max-w-lg mx-auto mb-8">
          <div className="flex items-center gap-3">
            <div className="flex-1 h-px bg-navy/10" />
            <p className="text-navy/35 text-xs" style={{ fontFamily: "'Noto Naskh Arabic', serif" }}>
              {tr.allWishes} ({wishes.length})
            </p>
            <div className="flex-1 h-px bg-navy/10" />
          </div>
        </div>
      )}

      {/* Wishes list */}
      <div className="max-w-lg mx-auto space-y-3">
        {wishes.length === 0 ? (
          <div className="text-center py-10">
            <p className="text-navy/25 text-4xl mb-3">💌</p>
            <p className="text-navy/35 text-sm" style={{ fontFamily: "'Noto Naskh Arabic', serif" }}>{tr.noWishes}</p>
          </div>
        ) : (
          wishes.map((w, i) => (
            <div key={w.id} className="card card-hover py-4 px-5">
              <div className="flex items-start gap-3">
                <div className={`w-9 h-9 rounded-full bg-gradient-to-br ${avatarColors[i % avatarColors.length]} flex items-center justify-center text-white text-sm font-bold flex-shrink-0 shadow-sm`}>
                  {w.name[0]?.toUpperCase()}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-navy text-sm" style={{ fontFamily: "'Noto Naskh Arabic', serif" }}>{w.name}</p>
                  <p className="text-navy/65 text-sm mt-1 leading-relaxed" style={{ fontFamily: "'Noto Naskh Arabic', serif" }}>{w.message}</p>
                  <p className="text-navy/25 text-[11px] mt-2">
                    {new Date(w.created_at).toLocaleDateString(lang === "ar" ? "ar-SA" : "en-GB")}
                  </p>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

    </section>
  );
}
