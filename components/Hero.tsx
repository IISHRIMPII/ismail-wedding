"use client";

import { Lang, t } from "@/lib/i18n";

interface HeroProps {
  lang: Lang;
}

export default function Hero({ lang }: HeroProps) {
  const tr = t[lang];
  const isAr = lang === "ar";

  return (
    <section className={`pattern-bg min-h-screen flex flex-col items-center justify-center px-4 py-16 ${isAr ? "rtl" : "ltr"}`}>
      <div className="w-full max-w-[400px] mx-auto">

        {/* Invitation Card */}
        <div className="invitation-card">

          {/* Top gold bar */}
          <div className="h-1.5 bg-gradient-to-r from-gold-dark via-gold-light to-gold-dark" />

          <div className="px-7 py-9 flex flex-col items-center text-center gap-5">

            {/* Badge */}
            <div className="bg-navy text-cream text-base px-7 py-2 rounded-full border border-gold/40 shadow-md tracking-widest"
              style={{ fontFamily: "'Amiri', serif" }}>
              دَعـوَة
            </div>

            {/* Bismillah */}
            <p className="text-navy text-lg leading-loose"
              style={{ fontFamily: "'Amiri', serif" }}>
              {tr.bismillah}
            </p>

            {/* Ornament */}
            <div className="w-full flex items-center gap-3">
              <div className="flex-1 h-px bg-gradient-to-r from-transparent to-gold/40" />
              <span className="text-gold text-base leading-none">✦</span>
              <div className="flex-1 h-px bg-gradient-to-l from-transparent to-gold/40" />
            </div>

            {/* Quran Ayah */}
            <div className="w-full bg-cream/70 rounded-2xl px-5 py-4 border border-gold/15">
              <p className="text-navy/80 text-sm leading-8" style={{ fontFamily: "'Amiri', serif" }}>
                {tr.ayah}
              </p>
              <p className="text-gold/60 text-xs mt-2">{tr.surah}</p>
            </div>

            {/* Host / Invitation text */}
            <div className="space-y-1">
              <p className="text-navy/55 text-sm" style={{ fontFamily: "'Noto Naskh Arabic', serif" }}>
                {tr.hostedBy}
              </p>
              <p className="text-navy font-bold text-[15px]" style={{ fontFamily: "'Amiri', serif" }}>
                {tr.host}
              </p>
              <p className="text-navy/55 text-sm" style={{ fontFamily: "'Noto Naskh Arabic', serif" }}>
                {tr.invite}
              </p>
            </div>

            {/* Groom Name */}
            <div className="py-2 relative">
              <div className="absolute inset-0 bg-gold/8 blur-2xl rounded-full" />
              <h1
                className="relative text-[72px] leading-none text-navy font-bold"
                style={{
                  fontFamily: "'Amiri', serif",
                  textShadow: "0 2px 24px rgba(201,169,110,0.25)",
                }}
              >
                {tr.groom}
              </h1>
            </div>

            {/* Will by */}
            <div className="w-full flex items-center gap-3">
              <div className="flex-1 h-px bg-navy/10" />
              <p className="text-navy/40 text-xs whitespace-nowrap" style={{ fontFamily: "'Noto Naskh Arabic', serif" }}>
                {tr.willBy}
              </p>
              <div className="flex-1 h-px bg-navy/10" />
            </div>

            {/* Event Details */}
            <div className="w-full flex items-start justify-around gap-2 pt-1">

              {/* Time */}
              <div className="flex flex-col items-center gap-2 flex-1">
                <div className="w-11 h-11 rounded-full border border-navy/20 bg-navy/4 flex items-center justify-center">
                  <svg className="w-5 h-5 text-navy/60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <circle cx="12" cy="12" r="10" strokeWidth="1.5" />
                    <polyline points="12 6 12 12 16 14" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
                <p className="text-navy/75 text-xs leading-snug" style={{ fontFamily: "'Noto Naskh Arabic', serif" }}>
                  {tr.time}
                </p>
              </div>

              {/* Location */}
              <div className="flex flex-col items-center gap-2 flex-1">
                <div className="w-11 h-11 rounded-full border border-navy/20 bg-navy/4 flex items-center justify-center">
                  <svg className="w-5 h-5 text-navy/60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z" strokeWidth="1.5" strokeLinejoin="round" />
                    <circle cx="12" cy="9" r="2.5" strokeWidth="1.5" />
                  </svg>
                </div>
                <p className="text-navy/75 text-xs leading-snug" style={{ fontFamily: "'Noto Naskh Arabic', serif" }}>
                  {tr.location}
                </p>
              </div>

              {/* Date */}
              <div className="flex flex-col items-center gap-2 flex-1">
                <div className="w-11 h-11 rounded-full border border-navy/20 bg-navy/4 flex items-center justify-center">
                  <svg className="w-5 h-5 text-navy/60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <rect x="3" y="4" width="18" height="18" rx="2" strokeWidth="1.5" />
                    <line x1="3" y1="10" x2="21" y2="10" strokeWidth="1.5" />
                    <line x1="8" y1="2" x2="8" y2="6" strokeWidth="1.5" strokeLinecap="round" />
                    <line x1="16" y1="2" x2="16" y2="6" strokeWidth="1.5" strokeLinecap="round" />
                  </svg>
                </div>
                <p className="text-navy/75 text-xs leading-snug" style={{ fontFamily: "'Noto Naskh Arabic', serif" }}>
                  {tr.date}
                </p>
              </div>

            </div>

            {/* Closing calligraphy */}
            <p className="text-navy/30 text-sm pt-2" style={{ fontFamily: "'Amiri', serif" }}>
              أفـراحًا زاخـرة وحضـور
            </p>

          </div>

          {/* Bottom gold bar */}
          <div className="h-1.5 bg-gradient-to-r from-gold-dark via-gold-light to-gold-dark" />
        </div>

        {/* Scroll cue */}
        <div className="mt-10 flex justify-center scroll-hint">
          <div className="flex flex-col items-center gap-1 opacity-40">
            <svg className="w-5 h-5 text-navy" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </div>

      </div>
    </section>
  );
}
