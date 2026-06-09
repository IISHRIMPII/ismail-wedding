"use client";

import { useState } from "react";
import { Lang } from "@/lib/i18n";
import Hero from "@/components/Hero";
import Countdown from "@/components/Countdown";
import Map from "@/components/Map";
import Guestbook from "@/components/Guestbook";
import Gallery from "@/components/Gallery";
import LanguageToggle from "@/components/LanguageToggle";

export default function Home() {
  const [lang, setLang] = useState<Lang>("ar");

  return (
    <main>
      <LanguageToggle lang={lang} setLang={setLang} />
      <Hero lang={lang} />
      <Countdown lang={lang} />
      <Map lang={lang} />
      <Gallery lang={lang} />
      <Guestbook lang={lang} />

      <footer className="navy-pattern-bg py-10 px-6 text-center">
        <div className="gold-divider-full mb-6" />
        <p className="text-gold/60 text-base" style={{ fontFamily: "'Amiri', serif" }}>
          بِسْمِ اللهِ الرَّحْمٰنِ الرَّحِيْمِ
        </p>
        <p className="text-cream/25 text-xs mt-3" style={{ fontFamily: "'Noto Naskh Arabic', serif" }}>
          إسماعيل ٢٠٢٦ · {lang === "ar" ? "بمشيئة الله تعالى" : "By the will of Allah"}
        </p>
      </footer>
    </main>
  );
}
