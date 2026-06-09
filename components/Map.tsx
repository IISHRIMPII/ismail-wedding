"use client";

import { useEffect, useRef } from "react";
import { Lang, t } from "@/lib/i18n";

interface MapProps {
  lang: Lang;
}

const LAT = 15.3694;
const LNG = 44.191;

export default function Map({ lang }: MapProps) {
  const tr = t[lang];
  const isAr = lang === "ar";
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstance = useRef<any>(null);

  useEffect(() => {
    if (typeof window === "undefined" || mapInstance.current) return;

    import("leaflet").then((L) => {
      import("leaflet/dist/leaflet.css");
      if (!mapRef.current) return;

      const map = L.map(mapRef.current, {
        center: [LAT, LNG],
        zoom: 15,
        zoomControl: true,
        scrollWheelZoom: false,
      });

      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: "© OpenStreetMap contributors",
      }).addTo(map);

      const icon = L.divIcon({
        html: `<div style="
          width:38px;height:38px;border-radius:50% 50% 50% 0;
          background:#1a2a4a;border:3px solid #c9a96e;
          transform:rotate(-45deg);
          box-shadow:0 3px 12px rgba(26,42,74,0.5);
        "></div>`,
        className: "",
        iconSize: [38, 38],
        iconAnchor: [19, 38],
      });

      L.marker([LAT, LNG], { icon })
        .addTo(map)
        .bindPopup(
          `<div style="font-family:'Noto Naskh Arabic',serif;direction:rtl;text-align:right;min-width:140px">
            <b style="color:#1a2a4a">${tr.mapSubtitle}</b><br/>
            <span style="color:#c9a96e;font-size:12px">${tr.date}</span>
          </div>`,
          { maxWidth: 220, className: "custom-popup" }
        )
        .openPopup();

      mapInstance.current = map;
    });
  }, [tr.date, tr.mapSubtitle]);

  const directionsUrl = `https://www.google.com/maps/dir/?api=1&destination=${LAT},${LNG}`;

  return (
    <section className={`pattern-bg py-16 px-4 ${isAr ? "rtl" : "ltr"}`}>

      {/* Header */}
      <div className="text-center mb-10">
        <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-navy/8 mb-4">
          <svg className="w-6 h-6 text-navy/50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
              d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
        </div>
        <h2 className="section-title">{tr.mapTitle}</h2>
        <p className="section-subtitle">{tr.mapSubtitle}</p>
      </div>

      {/* Map */}
      <div className="max-w-3xl mx-auto">
        <div
          ref={mapRef}
          className="w-full h-64 md:h-80 rounded-2xl overflow-hidden border-2 border-gold/25 shadow-xl"
          style={{ zIndex: 0 }}
        />

        {/* Info row */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-5 bg-white/70 backdrop-blur-sm rounded-2xl border border-gold/15 px-5 py-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-navy/8 flex items-center justify-center flex-shrink-0">
              <svg className="w-5 h-5 text-navy/50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <circle cx="12" cy="12" r="10" strokeWidth="1.5" />
                <polyline points="12 6 12 12 16 14" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <div>
              <p className="text-navy font-semibold text-sm" style={{ fontFamily: "'Noto Naskh Arabic', serif" }}>{tr.time}</p>
              <p className="text-navy/45 text-xs" style={{ fontFamily: "'Noto Naskh Arabic', serif" }}>{tr.date}</p>
            </div>
          </div>
          <a
            href={directionsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-gold text-sm"
            style={{ fontFamily: "'Noto Naskh Arabic', serif" }}
          >
            {tr.getDirections} ↗
          </a>
        </div>
      </div>

    </section>
  );
}
