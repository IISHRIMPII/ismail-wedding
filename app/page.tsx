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

    </main>
  );
}
