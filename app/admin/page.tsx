"use client";

import { useState, useEffect, useCallback } from "react";
import { Wish, Media } from "@/lib/supabase";

type Tab = "media" | "wishes";

export default function AdminPage() {
  const [password, setPassword] = useState("");
  const [authed, setAuthed] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [tab, setTab] = useState<Tab>("media");
  const [wishes, setWishes] = useState<Wish[]>([]);
  const [media, setMedia] = useState<Media[]>([]);
  const [deleting, setDeleting] = useState<string | null>(null);

  const fetchData = useCallback(async (pwd: string) => {
    setLoading(true);
    const res = await fetch("/api/admin", {
      headers: { "x-admin-password": pwd },
    });
    if (!res.ok) {
      setError("Wrong password");
      setAuthed(false);
      setLoading(false);
      return;
    }
    const data = await res.json();
    setWishes(data.wishes);
    setMedia(data.media);
    setAuthed(true);
    setLoading(false);
  }, []);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    fetchData(password);
  };

  const handleDelete = async (type: "wish" | "media", id: string, file_url?: string) => {
    if (!confirm("Delete this item?")) return;
    setDeleting(id);
    const res = await fetch("/api/admin", {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        "x-admin-password": password,
      },
      body: JSON.stringify({ type, id, file_url }),
    });
    if (res.ok) {
      if (type === "wish") setWishes((w) => w.filter((x) => x.id !== id));
      else setMedia((m) => m.filter((x) => x.id !== id));
    }
    setDeleting(null);
  };

  if (!authed) {
    return (
      <div className="navy-pattern-bg min-h-screen flex items-center justify-center p-6">
        <div className="bg-white/10 backdrop-blur-sm border border-gold/20 rounded-2xl p-8 w-full max-w-sm">
          <p className="text-gold text-center text-2xl mb-1">🔒</p>
          <h1 className="text-cream text-center text-xl font-semibold mb-6" style={{ fontFamily: "'Noto Naskh Arabic', serif" }}>
            لوحة الإدارة
          </h1>
          <form onSubmit={handleLogin} className="space-y-4">
            <input
              type="password"
              placeholder="كلمة المرور"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-2.5 text-cream placeholder-cream/30 focus:outline-none focus:border-gold text-center text-lg tracking-widest"
              autoFocus
            />
            {error && <p className="text-red-400 text-sm text-center">{error}</p>}
            <button
              type="submit"
              disabled={loading || !password}
              className="w-full bg-gold hover:bg-gold-dark text-white py-2.5 rounded-xl font-medium transition-colors disabled:opacity-50"
            >
              {loading ? "جارٍ التحقق..." : "دخول"}
            </button>
          </form>
        </div>
      </div>
    );
  }

  const photoCount = media.filter((m) => m.file_type === "photo").length;
  const videoCount = media.filter((m) => m.file_type === "video").length;
  const contestCount = media.filter((m) => m.is_groom_contest).length;

  return (
    <div className="navy-pattern-bg min-h-screen text-cream">
      {/* Header */}
      <div className="border-b border-white/10 px-6 py-4 flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold" style={{ fontFamily: "'Noto Naskh Arabic', serif" }}>لوحة الإدارة — حفل إسماعيل</h1>
          <p className="text-cream/40 text-xs mt-0.5">أهلاً إسماعيل 👑</p>
        </div>
        <button
          onClick={() => { setAuthed(false); setPassword(""); }}
          className="text-cream/40 hover:text-cream text-sm transition-colors"
        >
          تسجيل خروج
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-6 max-w-4xl mx-auto">
        {[
          { label: "التهنئات", value: wishes.length, icon: "💌" },
          { label: "الصور", value: photoCount, icon: "📷" },
          { label: "الفيديوهات", value: videoCount, icon: "🎬" },
          { label: "مسابقة العريس", value: contestCount, icon: "🏆" },
        ].map((s) => (
          <div key={s.label} className="bg-white/8 rounded-2xl border border-white/10 p-4 text-center">
            <p className="text-2xl mb-1">{s.icon}</p>
            <p className="text-2xl font-bold text-gold">{s.value}</p>
            <p className="text-cream/50 text-xs mt-1" style={{ fontFamily: "'Noto Naskh Arabic', serif" }}>{s.label}</p>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div className="max-w-4xl mx-auto px-6">
        <div className="flex gap-2 mb-6">
          {(["media", "wishes"] as Tab[]).map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`px-5 py-2 rounded-full text-sm font-medium transition-colors ${
                tab === t ? "bg-gold text-white" : "bg-white/8 text-cream/60 hover:text-cream"
              }`}
              style={{ fontFamily: "'Noto Naskh Arabic', serif" }}
            >
              {t === "media" ? `الوسائط (${media.length})` : `التهنئات (${wishes.length})`}
            </button>
          ))}
          <button
            onClick={() => fetchData(password)}
            className="ml-auto px-4 py-2 rounded-full text-xs bg-white/8 text-cream/40 hover:text-cream transition-colors"
          >
            ↻ تحديث
          </button>
        </div>

        {/* Media tab */}
        {tab === "media" && (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 pb-10">
            {media.map((m) => (
              <div key={m.id} className="relative group bg-white/8 rounded-xl border border-white/10 overflow-hidden">
                {m.file_type === "video" ? (
                  <video src={m.file_url} className="w-full h-32 object-cover" />
                ) : (
                  <img src={m.file_url} alt={m.uploader_name} className="w-full h-32 object-cover" />
                )}
                {/* Badges */}
                <div className="absolute top-1.5 left-1.5 flex gap-1">
                  {m.is_groom_contest && (
                    <span className="bg-gold text-white text-[10px] px-1.5 py-0.5 rounded-full">🏆</span>
                  )}
                  {m.file_type === "video" && (
                    <span className="bg-black/60 text-white text-[10px] px-1.5 py-0.5 rounded-full">▶</span>
                  )}
                </div>
                <div className="p-2">
                  <p className="text-xs text-cream/70 truncate">{m.uploader_name}</p>
                  {m.is_groom_contest && (
                    <p className="text-[10px] text-gold/70">❤️ {m.votes}</p>
                  )}
                  <p className="text-[10px] text-cream/30">
                    {new Date(m.created_at).toLocaleDateString("ar-SA")}
                  </p>
                </div>
                {/* Delete button */}
                <button
                  onClick={() => handleDelete("media", m.id, m.file_url)}
                  disabled={deleting === m.id}
                  className="absolute top-1.5 right-1.5 w-6 h-6 rounded-full bg-red-500/80 text-white text-xs flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600 disabled:opacity-50"
                >
                  ✕
                </button>
              </div>
            ))}
            {media.length === 0 && (
              <p className="col-span-4 text-center text-cream/30 py-10 text-sm">لا توجد وسائط بعد</p>
            )}
          </div>
        )}

        {/* Wishes tab */}
        {tab === "wishes" && (
          <div className="space-y-3 pb-10">
            {wishes.map((w) => (
              <div key={w.id} className="bg-white/8 rounded-xl border border-white/10 p-4 flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-gold/20 flex items-center justify-center text-gold font-bold text-sm flex-shrink-0">
                  {w.name[0]?.toUpperCase()}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-cream">{w.name}</p>
                  <p className="text-sm text-cream/60 mt-0.5 leading-relaxed">{w.message}</p>
                  <p className="text-xs text-cream/25 mt-1">
                    {new Date(w.created_at).toLocaleString("ar-SA")}
                  </p>
                </div>
                <button
                  onClick={() => handleDelete("wish", w.id)}
                  disabled={deleting === w.id}
                  className="text-red-400/50 hover:text-red-400 text-lg transition-colors disabled:opacity-30 flex-shrink-0"
                >
                  🗑
                </button>
              </div>
            ))}
            {wishes.length === 0 && (
              <p className="text-center text-cream/30 py-10 text-sm">لا توجد تهنئات بعد</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
