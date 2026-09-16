# Milestone 1 — Fondasi & Design System
Tanggal: 15 September 2026

Project: C:\Users\ROG ALLY\Documents\EXTREME STUDIOS\PROJECT\Web Perwanida

## 1. Audit awal
Folder kosong: 0 file, tanpa framework, repository Git, aset, environment, maupun fungsi existing. Tidak ada file lama yang dihapus atau ditimpa. Audit lengkap tersimpan di project: docs/AUDIT.md.

## 2. Arsitektur
Next.js 16.3.5, React 19.3.0, TypeScript strict, App Router dan CSS native.
Root / mengarah ke /home. Route group (website) memiliki shell persistent. Konten detail memakai registry + halaman renderer bersama; unknown route mengembalikan HTTP 404.
UI berbasis Server Components, hanya navigasi interaktif menggunakan client component.

## 3. Data/content
Kontrak bertipe mencakup identitas, kontak, visi/misi/tujuan/sejarah, program unggulan/penunjang/kurikulum, fasilitas, ekstrakurikuler, guru, tendik, komite, galeri, artikel, agenda, testimoni, SPMB, sosial dan FAQ.
Data awal: identitas dan visi dari brief, 5 nama program unggulan, 7 ekstrakurikuler, 3 fasilitas, serta kontak publik resmi.
Record memiliki stable ID/slug, kategori, summary/body, keyword, relatedPage, updatedAt, sourceIds dan status.
Data belum tersedia dicatat sebagai pending/null/koleksi kosong. Tidak ada nama guru, biaya, testimoni, atau status pendaftaran fiktif.
Repository adapter siap diganti CMS; extractor knowledge murni membaca data yang sama dan mengecualikan pending.
Sumber: [Website resmi](https://www.kbraperwanida.sch.id/), [Tentang Kami](https://www.kbraperwanida.sch.id/about), [Kontak](https://www.kbraperwanida.sch.id/kontak).

## 4. Komponen reusable
Container, Section, SectionHeader, Button, ButtonLink, IconButton, Card, Badge, ResponsiveImage, Navbar, DesktopNavigation/dropdown bertingkat, MobileNavigation/dialog, Footer, Breadcrumb, PageHeader, CTA, EmptyState, LoadingState dan ContentCard.
Menu desktop memakai klik/keyboard, Escape, penutupan saat klik luar atau fokus keluar.
Menu mobile mendukung nested disclosure, focus containment/return, Escape, scroll lock, penutupan setelah navigasi dan saat pindah breakpoint desktop.

## 5. Routing
27 route konten:
- /home
- /profil
- /profil/tentang-kami
- /profil/guru-tendik
- /profil/komite
- /profil/fasilitas
- /program
- /program/kurikulum
- /program/unggulan
- /program/unggulan/character-building
- /program/unggulan/cinta-budaya-indonesia
- /program/unggulan/gerakan-literasi
- /program/unggulan/green-school
- /program/unggulan/mengaji-metode-ummi
- /program/penunjang
- /galeri
- /galeri/ekstrakurikuler
- /galeri/mengaji
- /galeri/prestasi
- /galeri/agenda
- /berita
- /berita/daily-activity
- /berita/event
- /multimedia
- /multimedia/video
- /kontak
- /spmb

Tambahan teknis: root redirect, halaman 404, robots.txt dan sitemap.xml.

## 6. Design tokens
Emerald #175341, deep emerald #103d31, fresh green #46754d, sage #e1e8da, ivory #fbf9f3, gold #eacb76.
Warna, radius, shadow, spacing, ukuran container, touch target dan motion terpusat.
Dua font system: Trebuchet MS untuk heading dan Arial untuk body; fallback sans-serif pada perangkat yang tidak memiliki font tersebut.
Display/h1/h2/h3/h4/body-lg/body/body-sm/caption tersedia. Ukuran heading fluid.
Container maksimum 1280px; touch target utama minimum 44px.

## 7. File utama
Semua path berikut relatif terhadap folder project di atas:
- package.json dan package-lock.json
- src/config/routes.ts dan site.ts
- src/styles/tokens.css dan src/app/globals.css
- src/types/content.ts
- src/data/content/school.ts, sources.ts, ui.ts
- src/lib/content.ts dan seo.ts
- src/app/layout.tsx dan page.tsx
- src/app/(website)/layout.tsx
- src/app/(website)/home/page.tsx
- src/app/(website)/[...slug]/page.tsx
- src/components/layout/site-shell.tsx dan navigation.tsx
- README.md, docs/AUDIT.md, docs/CONTENT-INTEGRITY.md

## 8. Hasil validasi
- npm run lint: lulus, tanpa error/warning lint.
- npm run typecheck: lulus.
- npm test: 4/4 lulus.
- npm run build: lulus, 32 halaman internal/generated diproses.
- npm run test:e2e: 5/5 lulus, Google Chrome headless, production server.
- 27 route: HTTP 200, satu h1, title/description dan noindex preview.
- Root redirect dan unknown URL HTTP 404: lulus.
- Tidak ada page error/HTTP 5xx pada tes seluruh route.
- Responsive: 320, 375, 390, 430, 768, 1024, 1280, 1440 dan 1920px, tanpa horizontal overflow pada home, program unggulan dan kontak.
- Dropdown desktop dan menu mobile: lulus, termasuk keyboard.
- Axe WCAG 2 A/AA dan 2.1 AA: tidak ada pelanggaran terdeteksi pada home desktop/mobile dan menu mobile terbuka.
- Skip link, focus return, focus containment dan reduced motion: lulus.
- Visual screenshot desktop dan mobile diperiksa.
- Instalasi dependency melaporkan 0 vulnerability.
- Pemeriksaan source: tidak ditemukan API key Gemini, SDK AI, library animasi besar, atau kode entrance.
- Belum diuji di perangkat fisik/Safari/Firefox; validasi responsive menggunakan viewport Chrome.

## 9. Pending / batasan
- Logo dan fotografi resmi belum diimpor; preview memakai wordmark teks dan placeholder foto berlabel jelas. Tidak ada image generation/stock photo.
- Migrasi konten lengkap dan verifikasi periode SPMB masih pending di contentGaps.
- Tidak ada CMS, backend pendaftaran atau submission form.
- Domain final belum ditetapkan. SITE_URL belum diisi; preview noindex dan sitemap kosong. Aktifkan indexability hanya setelah konten dan publikasi siap.
- Font system dapat berbeda fallback antar-OS; font resmi/self-hosted dapat dipilih pada milestone visual berikutnya.
- ESLint 9 dipakai dengan konfigurasi Next; npm memberi pemberitahuan lifecycle deprecated. Lint lulus dan audit dependency tidak menemukan vulnerability. Evaluasi migrasi major tooling terpisah bila diperlukan.

## 10. Siap untuk Milestone 2
Komponen, tokens, routing, shell, typed content dan repository sudah siap menerima konten lengkap serta halaman final.
Entrance nanti dapat menggantikan root redirect.
Concierge nanti dapat ditempatkan pada conciergeSlot di shell persistent dan menggunakan knowledge source yang sama.
Interactive Splash, Gemini API/chatbot, entrance animation dan homepage final belum dibuat. Tidak ada deployment.

## Preview & menjalankan
Preview production lokal: http://localhost:3215/home
Development: buka terminal pada folder project lalu jalankan npm run dev.
Validasi ulang: npm run lint, npm run typecheck, npm test, npm run build, npm run test:e2e.

[Preview desktop](./perwanida-desktop.png) · [Preview mobile](./perwanida-mobile.png)

