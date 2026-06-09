# حفل زفاف إسماعيل — Wedding Website

A bilingual (Arabic/English) wedding invitation website built with **Next.js 14** + **Supabase**.

## Features
- Beautiful Arabic invitation hero with Islamic geometric design
- Live countdown to the wedding
- Interactive OpenStreetMap with directions
- Guest photo & video upload (up to 50MB)
- **Best photo of the groom** voting contest
- Guestbook / wishes wall
- Arabic ↔ English language toggle

---

## Setup in 5 Steps

### 1. Create a Supabase Project
1. Go to [supabase.com](https://supabase.com) → New project
2. Copy your **Project URL** and **anon public key** from Settings → API

### 2. Run the Database Schema
1. In Supabase Dashboard → **SQL Editor**
2. Paste the contents of `supabase/schema.sql` and click **Run**

### 3. Create the Storage Bucket
1. In Supabase Dashboard → **Storage** → **New bucket**
2. Name: `wedding-media`, toggle **Public bucket: ON**
3. Go to **Policies** → Add policy for `wedding-media`:
   - INSERT: `true`
   - SELECT: `true`

### 4. Configure Environment Variables
```bash
cp .env.local.example .env.local
```
Edit `.env.local`:
```env
NEXT_PUBLIC_SUPABASE_URL=https://xxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGci...
```

### 5. Install & Run
```bash
npm install
npm run dev       # local: http://localhost:3000
npm run build     # production build
```

---

## Deploy to Vercel (Free)
1. Push this folder to a GitHub repo
2. Go to [vercel.com](https://vercel.com) → Import project
3. Add the two env vars (`NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`)
4. Click Deploy — your site is live in ~2 minutes!

---

## Update the Map Location
The map is centred on approximate coordinates for مجلس جامع بن عمير.
To update: edit `LAT` and `LNG` in `components/Map.tsx`.

Find the exact coordinates by right-clicking your location on Google Maps → "What's here?"

---

## Customisation
| What | Where |
|------|-------|
| All Arabic/English text | `lib/i18n.ts` |
| Colours (navy, gold, cream) | `tailwind.config.ts` |
| Wedding date/time | `components/Countdown.tsx` line `target` |
| Map coordinates | `components/Map.tsx` lines `LAT` / `LNG` |
| Google Maps directions link | auto-generated from LAT/LNG |

---

## Tech Stack
- **Next.js 14** (App Router, TypeScript)
- **Supabase** (Postgres DB + Storage)
- **Tailwind CSS**
- **Leaflet / OpenStreetMap** (no API key needed)
- **react-hot-toast** (notifications)
- Deploy: **Vercel** (free tier)
