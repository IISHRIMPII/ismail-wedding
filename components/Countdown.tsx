"use client";

import { useEffect, useState } from "react";
import { Lang, t } from "@/lib/i18n";

interface CountdownProps {
  lang: Lang;
}

function pad(n: number) {
  return String(n).padStart(2, "0");
}

export default function Countdown({ lang }: CountdownProps) {
  const tr = t[lang];
  const isAr = lang === "ar";

  const [time, setTime] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const target = new Date("2026-06-18T21:00:00+03:00").getTime();

    const tick = () => {
      const now = Date.now();
      const diff = Math.max(0, target - now);
      setTime({
        days: Math.floor(diff / 86_400_000),
        hours: Math.floor((diff % 86_400_000) / 3_600_000),
        minutes: Math.floor((diff % 3_600_000) / 60_000),
        seconds: Math.floor((diff % 60_000) / 1_000),
      });
    };

    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  const units = [
    { value: time.days, label: tr.days },
    { value: time.hours, label: tr.hours },
    { value: time.minutes, label: tr.minutes },
    { value: time.seconds, label: tr.seconds },
  ];

  return (
    <section className={`navy-pattern-bg py-16 px-4 ${isAr ? "rtl" : "ltr"}`}>

      {/* Header */}
      <div className="text-center mb-10">
        <p className="text-gold/60 text-xs tracking-widest uppercase mb-3" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
          {isAr ? "باقي على الحفل" : "Time Remaining"}
        </p>
        <h2 className="text-2xl text-cream" style={{ fontFamily: "'Amiri', serif" }}>
          {tr.countdownTitle}
        </h2>
        <div className="gold-divider-full mt-4" />
      </div>

      {/* Countdown boxes */}
      <div className={`flex items-center justify-center gap-2 sm:gap-4 max-w-sm mx-auto ${isAr ? "flex-row-reverse" : "flex-row"}`}>
        {units.map((u, i) => (
          <div key={i} className="flex-1 flex flex-col items-center">

            {/* Number box */}
            <div className="w-full aspect-square max-w-[72px] sm:max-w-[80px] rounded-2xl bg-white/6 border border-gold/25 backdrop-blur-sm flex items-center justify-center shadow-lg relative overflow-hidden">
              {/* Inner shine */}
              <div className="absolute inset-0 bg-gradient-to-b from-white/5 to-transparent" />
              <span
                key={mounted ? pad(u.value) : ""}
                className="relative text-3xl sm:text-4xl font-bold text-cream tabular-nums"
                style={{ fontVariantNumeric: "tabular-nums", fontFamily: "'Cormorant Garamond', serif" }}
              >
                {mounted ? pad(u.value) : "00"}
              </span>
            </div>

            {/* Label */}
            <p className="text-gold/60 text-[11px] mt-2" style={{ fontFamily: "'Noto Naskh Arabic', serif" }}>
              {u.label}
            </p>

          </div>
        ))}
      </div>

      {/* Date reminder */}
      <p className="text-center text-cream/25 text-xs mt-10" style={{ fontFamily: "'Noto Naskh Arabic', serif" }}>
        {tr.date} — {tr.location}
      </p>

    </section>
  );
}
