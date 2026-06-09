"use client";

import { Lang } from "@/lib/i18n";

interface Props {
  lang: Lang;
  setLang: (l: Lang) => void;
}

export default function LanguageToggle({ lang, setLang }: Props) {
  return (
    <div className="fixed top-4 right-4 z-50 flex items-center bg-navy/85 backdrop-blur-md rounded-full border border-gold/25 overflow-hidden shadow-xl">
      <button
        onClick={() => setLang("ar")}
        className={`px-4 py-2 text-sm transition-all duration-200 ${
          lang === "ar"
            ? "bg-gold text-white font-medium"
            : "text-cream/55 hover:text-cream"
        }`}
        style={{ fontFamily: "'Noto Naskh Arabic', serif" }}
      >
        عربي
      </button>
      <button
        onClick={() => setLang("en")}
        className={`px-4 py-2 text-sm transition-all duration-200 ${
          lang === "en"
            ? "bg-gold text-white font-medium"
            : "text-cream/55 hover:text-cream"
        }`}
        style={{ fontFamily: "'Cormorant Garamond', serif", letterSpacing: "0.05em" }}
      >
        EN
      </button>
    </div>
  );
}
